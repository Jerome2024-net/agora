import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserById, createWithdrawalRequest, updateWithdrawalStatus } from '@/lib/data';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

// POST - Créer une demande de retrait
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount } = body;

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Paramètres invalides' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est un organisateur
    if (user.type !== 'organizer') {
      return NextResponse.json(
        { error: 'Seuls les organisateurs peuvent retirer des fonds' },
        { status: 403 }
      );
    }

    // Vérifier qu'il a un compte Stripe Connect
    if (!user.stripeAccountId) {
      return NextResponse.json(
        { error: 'Vous devez connecter un compte Stripe pour retirer des fonds' },
        { status: 400 }
      );
    }

    // Vérifier le solde disponible
    const availableBalance = user.walletBalance || 0;
    if (amount > availableBalance) {
      return NextResponse.json(
        { error: `Solde insuffisant. Disponible: ${availableBalance.toFixed(2)}€` },
        { status: 400 }
      );
    }

    // Créer la demande de retrait dans la base de données locale
    const withdrawalRequest = createWithdrawalRequest({
      id: `WITHDRAWAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      amount: amount,
      status: 'processing',
      requestedAt: new Date().toISOString(),
      method: 'stripe_payout',
      notes: `Retrait vers le compte bancaire via Stripe Connect`,
    });

    try {
      // Créer le payout Stripe vers le compte Connect de l'organisateur
      const payout = await stripe.payouts.create(
        {
          amount: Math.round(amount * 100), // En centimes
          currency: 'eur',
          description: `Retrait Agora - Wallet`,
          metadata: {
            userId: userId,
            withdrawalId: withdrawalRequest.id,
          },
        },
        {
          stripeAccount: user.stripeAccountId, // Compte Connect de l'organisateur
        }
      );

      // Mettre à jour le statut avec l'ID de transaction Stripe
      updateWithdrawalStatus(withdrawalRequest.id, 'completed', payout.id);

      console.log(`✅ Payout créé avec succès:
        - Montant: ${amount.toFixed(2)}€
        - Organisateur: ${user.name}
        - Stripe Payout ID: ${payout.id}
        - Arrivée prévue: ${new Date(payout.arrival_date * 1000).toLocaleDateString('fr-FR')}`);

      return NextResponse.json({
        success: true,
        withdrawal: {
          id: withdrawalRequest.id,
          amount: amount,
          status: 'completed',
          stripePayoutId: payout.id,
          arrivalDate: new Date(payout.arrival_date * 1000).toISOString(),
        },
      });

    } catch (stripeError: any) {
      // En cas d'erreur Stripe, mettre le retrait en échec
      updateWithdrawalStatus(withdrawalRequest.id, 'rejected', undefined);

      console.error('❌ Erreur lors de la création du payout Stripe:', stripeError);

      return NextResponse.json(
        {
          error: 'Erreur lors du retrait',
          details: stripeError.message,
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur création retrait:', error);
    return NextResponse.json(
      {
        error: 'Erreur création retrait',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}

// GET - Récupérer l'historique des retraits d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID manquant' },
        { status: 400 }
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'historique des retraits
    const { getWithdrawalRequests } = await import('@/lib/data');
    const withdrawals = getWithdrawalRequests(userId);

    return NextResponse.json({
      success: true,
      withdrawals: withdrawals,
    });

  } catch (error) {
    console.error('❌ Erreur récupération retraits:', error);
    return NextResponse.json(
      {
        error: 'Erreur récupération retraits',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
