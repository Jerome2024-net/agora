require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_PROD,
    'http://localhost:3000',
    'https://votre-username.github.io'
  ],
  credentials: true
}));

// Pour Stripe webhook, on doit traiter le raw body
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  console.log('✅ Webhook received:', event.type);
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('💳 Payment successful:', session.id);
      // TODO: Mettre à jour la base de données avec la réservation
      break;
      
    case 'account.updated':
      const account = event.data.object;
      console.log('🔄 Stripe Connect account updated:', account.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Pour les autres routes, on parse le JSON
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Agora Backend API',
    version: '1.0.0',
    endpoints: {
      checkout: 'POST /api/create-checkout-session',
      connect: 'POST /api/stripe/connect',
      dashboard: 'POST /api/stripe/dashboard',
      webhook: 'POST /api/webhook'
    }
  });
});

// ==========================================
// 1. CREATE CHECKOUT SESSION (Paiement)
// ==========================================
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { eventTitle, ticketType, quantity, pricePerTicket, organizerStripeAccountId, userEmail } = req.body;

    // Validation
    if (!eventTitle || !quantity || !pricePerTicket) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calcul des montants
    const baseAmount = pricePerTicket * quantity * 100; // en centimes
    const serviceFeeRate = 0.05; // 5%
    const serviceFee = Math.round(baseAmount * serviceFeeRate);
    const totalAmount = baseAmount + serviceFee;

    // Créer la session Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${eventTitle} - ${ticketType}`,
              description: `${quantity} billet(s)`,
            },
            unit_amount: Math.round(baseAmount / quantity),
          },
          quantity: quantity,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Frais de service',
              description: '5% frais de plateforme',
            },
            unit_amount: Math.round(serviceFee / quantity),
          },
          quantity: quantity,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        eventTitle,
        ticketType,
        quantity: quantity.toString(),
        organizerStripeAccountId: organizerStripeAccountId || 'none',
      },
      // Si l'organisateur a un compte Stripe Connect, on lui transfère l'argent
      ...(organizerStripeAccountId && {
        payment_intent_data: {
          application_fee_amount: serviceFee,
          transfer_data: {
            destination: organizerStripeAccountId,
          },
        },
      }),
    });

    res.json({ 
      success: true, 
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==========================================
// 2. STRIPE CONNECT - Onboarding
// ==========================================
app.post('/api/stripe/connect', async (req, res) => {
  try {
    const { userId, userEmail, userName, existingAccountId } = req.body;

    let accountId = existingAccountId;

    // Si pas de compte existant, en créer un
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'FR',
        email: userEmail,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        business_profile: {
          name: userName,
          support_email: userEmail,
        },
      });
      accountId = account.id;
    }

    // Créer le lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: process.env.CONNECT_ONBOARDING_REFRESH_URL,
      return_url: process.env.CONNECT_ONBOARDING_RETURN_URL,
      type: 'account_onboarding',
    });

    res.json({
      success: true,
      accountId: accountId,
      onboardingUrl: accountLink.url,
    });

  } catch (error) {
    console.error('❌ Error creating Stripe Connect account:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.raw?.message || error.message,
    });
  }
});

// ==========================================
// 3. STRIPE CONNECT - Get Account Status
// ==========================================
app.get('/api/stripe/connect', async (req, res) => {
  try {
    const { accountId } = req.query;

    if (!accountId) {
      return res.status(400).json({ error: 'Missing accountId' });
    }

    const account = await stripe.accounts.retrieve(accountId);

    // Déterminer le statut
    let status = 'pending';
    if (account.charges_enabled && account.payouts_enabled) {
      status = 'active';
    } else if (account.requirements?.currently_due?.length > 0) {
      status = 'restricted';
    }

    res.json({
      success: true,
      account: {
        id: account.id,
        status: status,
        detailsSubmitted: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        requirements: account.requirements,
      },
    });

  } catch (error) {
    console.error('❌ Error retrieving Stripe account:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================================
// 4. STRIPE DASHBOARD - Login Link
// ==========================================
app.post('/api/stripe/dashboard', async (req, res) => {
  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ error: 'Missing accountId' });
    }

    const loginLink = await stripe.accounts.createLoginLink(accountId);

    res.json({
      success: true,
      url: loginLink.url,
    });

  } catch (error) {
    console.error('❌ Error creating dashboard login link:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================================
// 5. WALLET - Withdraw Request
// ==========================================
app.post('/api/wallet/withdraw', async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    if (!accountId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Créer un payout vers le compte bancaire de l'organisateur
    const payout = await stripe.payouts.create(
      {
        amount: Math.round(amount * 100), // en centimes
        currency: 'eur',
      },
      {
        stripeAccount: accountId,
      }
    );

    res.json({
      success: true,
      payout: {
        id: payout.id,
        amount: payout.amount / 100,
        status: payout.status,
        arrival_date: payout.arrival_date,
      },
    });

  } catch (error) {
    console.error('❌ Error creating payout:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Agora Backend API started!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Stripe mode: ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'LIVE' : 'TEST'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  / - Health check');
  console.log('  POST /api/create-checkout-session - Create payment');
  console.log('  POST /api/stripe/connect - Create Connect account');
  console.log('  GET  /api/stripe/connect - Get account status');
  console.log('  POST /api/stripe/dashboard - Get dashboard link');
  console.log('  POST /api/wallet/withdraw - Request withdrawal');
  console.log('  POST /api/webhook - Stripe webhooks');
  console.log('');
});

module.exports = app;
