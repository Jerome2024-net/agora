import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, eventTitle, eventImage, tickets, totalPrice, userId, userName, userEmail, organizerStripeAccountId } = body;

    if (!eventId || !tickets || !totalPrice || !userId) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Calculer le prix total des tickets (ce que l'organisateur reçoit intégralement)
    const ticketsPrice = tickets.reduce((sum: number, ticket: any) => sum + ticket.price * ticket.quantity, 0);

    // Calculer les frais de service (5% du prix des tickets)
    const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.05');
    const serviceFeeAmount = organizerStripeAccountId 
      ? Math.round(ticketsPrice * 100 * commissionRate) // En centimes
      : 0;

    // Créer les line items pour Stripe (tickets + frais de service séparés)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = tickets.map((ticket: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${eventTitle} - ${ticket.type}`,
          description: ticket.description || `Billet ${ticket.type}`,
          images: eventImage ? [eventImage] : undefined,
        },
        unit_amount: Math.round(ticket.price * 100), // Prix du billet en centimes
      },
      quantity: ticket.quantity,
    }));

    // Ajouter les frais de service comme ligne séparée (si Stripe Connect)
    if (organizerStripeAccountId && serviceFeeAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: '💼 Frais de service Agora',
            description: `Frais de plateforme (${(commissionRate * 100).toFixed(0)}%)`,
          },
          unit_amount: serviceFeeAmount, // Frais de service en centimes
        },
        quantity: 1,
      });
    }

    // Configuration de base de la session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}?payment=cancelled`,
      customer_email: userEmail,
      metadata: {
        eventId,
        userId,
        userName,
        eventTitle,
        ticketsData: JSON.stringify(tickets),
      },
    };

    // Si l'organisateur a un compte Stripe Connect, configurer le transfert
    if (organizerStripeAccountId && serviceFeeAmount > 0) {
      sessionConfig.payment_intent_data = {
        application_fee_amount: serviceFeeAmount, // Les frais de service vont à la plateforme
        transfer_data: {
          destination: organizerStripeAccountId, // L'organisateur reçoit le prix des tickets
        },
        metadata: {
          eventId,
          userId,
          ticketsPrice: ticketsPrice.toString(),
          serviceFee: serviceFeeAmount.toString(),
        },
      };
      
      console.log(`💰 Paiement Connect avec frais de service:
        - Prix des tickets: ${ticketsPrice.toFixed(2)}€
        - Frais de service (${(commissionRate * 100).toFixed(0)}%): ${(serviceFeeAmount / 100).toFixed(2)}€
        - Total participant paie: ${(ticketsPrice + serviceFeeAmount / 100).toFixed(2)}€
        - Organisateur reçoit: ${ticketsPrice.toFixed(2)}€ (100% du prix des tickets)
        - Plateforme reçoit: ${(serviceFeeAmount / 100).toFixed(2)}€`);
    } else {
      console.log('⚠️ Organisateur sans compte Stripe Connect - Paiement standard');
    }

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('❌ Erreur création session Stripe:', error);
    return NextResponse.json(
      { 
        error: 'Erreur création session de paiement',
        details: error instanceof Error ? error.message : 'Unknown'
      },
      { status: 500 }
    );
  }
}
