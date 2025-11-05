import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addReservation, getEventById, tickets, addWalletTransaction, getUserById } from '@/lib/data';
import { Ticket } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Gérer l'événement de paiement réussi
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('✅ Paiement réussi pour la session:', session.id);
      
      // Récupérer les métadonnées
      const { eventId, userId, userName, ticketsData } = session.metadata!;
      const tickets = JSON.parse(ticketsData);
      
      // Récupérer l'événement
      const eventData = getEventById(eventId);
      if (!eventData) {
        console.error('❌ Événement non trouvé:', eventId);
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }

      // Créer les billets pour chaque type acheté
      const createdTickets: Ticket[] = [];
      for (const ticketInfo of tickets) {
        for (let i = 0; i < ticketInfo.quantity; i++) {
          const ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${ticketId}`;
          
          const ticket: Ticket = {
            id: ticketId,
            reservationId: session.id,
            eventId: eventId,
            userId,
            userName,
            userEmail: session.customer_email || '',
            ticketNumber: i + 1,
            ticketType: ticketInfo.type,
            ticketPrice: ticketInfo.price,
            qrCode: qrCodeUrl,
            status: 'valid' as const,
            purchaseDate: new Date().toISOString(),
          };
          
          tickets.push(ticket); // Ajouter au tableau global
          createdTickets.push(ticket);
        }
      }

      // Créer la réservation
      const totalPrice = tickets.reduce((sum: number, t: any) => sum + (t.price * t.quantity), 0);
      addReservation({
        id: `RES-${Date.now()}`,
        eventId: eventId,
        userId,
        userName,
        userEmail: session.customer_email || '',
        numberOfTickets: createdTickets.length,
        totalPrice,
        reservationDate: new Date().toISOString(),
        status: 'confirmed',
        ticketCode: session.id,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        stripeSessionId: session.id,
      });

      console.log('✅ Billets créés et réservation enregistrée');

      // 💰 ALIMENTER AUTOMATIQUEMENT LE WALLET DE L'ORGANISATEUR
      try {
        const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.05');
        const serviceFee = totalPrice * commissionRate; // 5% de commission
        const netAmount = totalPrice; // L'organisateur reçoit 100% du prix des tickets

        // Créer la transaction dans le wallet
        addWalletTransaction({
          id: `WALLET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: eventData.organizerId, // ID de l'organisateur
          eventId: eventId,
          eventTitle: eventData.title,
          type: 'sale',
          amount: totalPrice, // Prix total des tickets
          serviceFee: serviceFee, // Commission de la plateforme (5%)
          netAmount: netAmount, // Montant net pour l'organisateur (100% du prix)
          status: 'completed', // Paiement réussi = disponible immédiatement
          date: new Date().toISOString(),
          description: `Vente de ${createdTickets.length} billet(s) pour ${eventData.title}`,
          stripePaymentId: session.payment_intent as string || session.id,
          participantName: userName,
        });

        console.log(`💰 Wallet alimenté automatiquement:
          - Organisateur: ${eventData.organizerId}
          - Montant: ${netAmount.toFixed(2)}€ (100% du prix des tickets)
          - Commission plateforme: ${serviceFee.toFixed(2)}€ (${(commissionRate * 100).toFixed(0)}%)
          - Total participant a payé: ${(totalPrice + serviceFee).toFixed(2)}€`);

      } catch (walletError) {
        console.error('❌ Erreur lors de l\'alimentation du wallet:', walletError);
        // Ne pas bloquer la réservation si le wallet échoue
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Erreur webhook:', error);
    return NextResponse.json(
      { error: 'Webhook error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
