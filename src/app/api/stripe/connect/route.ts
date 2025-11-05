import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail, userName, existingAccountId } = body;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    let accountId = existingAccountId;

    // Créer un compte Connect seulement s'il n'existe pas déjà
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express', // Utiliser Express pour simplicité (Standard pour plus de contrôle)
        country: 'FR',
        email: userEmail,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          userId: userId,
          userName: userName,
        },
      });

      accountId = account.id;
      console.log('✅ Compte Stripe Connect créé:', accountId);
    } else {
      console.log('🔄 Utilisation du compte existant:', accountId);
    }

    // Créer le lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?stripe_refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?stripe_success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      success: true,
      accountId: accountId,
      onboardingUrl: accountLink.url,
    });

  } catch (error) {
    console.error('❌ Erreur création compte Connect:', error);
    return NextResponse.json(
      {
        error: 'Erreur création compte Stripe',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}

// GET - Vérifier le statut du compte Connect
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID manquant' },
        { status: 400 }
      );
    }

    const account = await stripe.accounts.retrieve(accountId);

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        detailsSubmitted: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        status: account.charges_enabled && account.payouts_enabled ? 'active' : 'pending',
      },
    });

  } catch (error) {
    console.error('❌ Erreur récupération compte:', error);
    return NextResponse.json(
      {
        error: 'Erreur vérification compte',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
