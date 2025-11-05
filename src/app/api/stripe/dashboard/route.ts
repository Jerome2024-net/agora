import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID manquant' },
        { status: 400 }
      );
    }

    // Créer un lien vers le Dashboard Stripe Express
    const loginLink = await stripe.accounts.createLoginLink(accountId);

    return NextResponse.json({
      success: true,
      url: loginLink.url,
    });

  } catch (error) {
    console.error('❌ Erreur création login link:', error);
    return NextResponse.json(
      {
        error: 'Erreur accès dashboard',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
