# 🔗 INTÉGRATION FRONTEND ↔️ BACKEND

## 📋 Architecture

```
┌─────────────────────────┐         ┌──────────────────────┐
│   Frontend (GitHub)     │         │  Backend (Railway)   │
│   Static HTML/JS        │ ──────▶ │  Node.js + Stripe    │
│   pages.github.io       │  HTTPS  │  Express API         │
└─────────────────────────┘         └──────────────────────┘
```

## 🚀 Étape 1 : Déployer le Backend

### Option A : Railway (Recommandé)

1. **Créer un compte Railway**
   - Allez sur https://railway.app
   - Connectez votre GitHub

2. **Nouveau projet**
   - "New Project" → "Deploy from GitHub repo"
   - Sélectionnez votre repository Agora
   - Root Directory : `backend`

3. **Variables d'environnement**
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   FRONTEND_URL=http://localhost:3000
   FRONTEND_URL_PROD=https://VOTRE_USERNAME.github.io
   NODE_ENV=production
   ```

4. **Déployer**
   - Railway génère une URL : `https://agora-backend.up.railway.app`
   - Notez cette URL !

### Option B : Heroku

```bash
cd backend
heroku create agora-backend
heroku config:set STRIPE_SECRET_KEY=sk_test_xxxxx
heroku config:set FRONTEND_URL_PROD=https://VOTRE_USERNAME.github.io
git subtree push --prefix backend heroku main
```

### Option C : Render

1. Allez sur https://render.com
2. "New Web Service"
3. Connectez GitHub
4. Root Directory : `backend`
5. Build : `npm install`
6. Start : `npm start`

## 🔧 Étape 2 : Configurer le Frontend

### Créer un fichier de configuration API

Créez `src/lib/api.ts` :

```typescript
// src/lib/api.ts
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://agora-backend.up.railway.app'  // ← Remplacez par votre URL backend
  : 'http://localhost:3001';

export const api = {
  // Créer une session de paiement
  createCheckoutSession: async (data: {
    eventTitle: string;
    ticketType: string;
    quantity: number;
    pricePerTicket: number;
    organizerStripeAccountId?: string;
    userEmail: string;
  }) => {
    const response = await fetch(\`\${API_URL}/api/create-checkout-session\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Créer un compte Stripe Connect
  createStripeConnect: async (data: {
    userId: string;
    userEmail: string;
    userName: string;
    existingAccountId?: string;
  }) => {
    const response = await fetch(\`\${API_URL}/api/stripe/connect\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Obtenir le statut du compte
  getStripeAccountStatus: async (accountId: string) => {
    const response = await fetch(\`\${API_URL}/api/stripe/connect?accountId=\${accountId}\`);
    return response.json();
  },

  // Obtenir le lien dashboard
  getStripeDashboardLink: async (accountId: string) => {
    const response = await fetch(\`\${API_URL}/api/stripe/dashboard\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });
    return response.json();
  },

  // Demander un retrait
  requestWithdrawal: async (accountId: string, amount: number) => {
    const response = await fetch(\`\${API_URL}/api/wallet/withdraw\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount }),
    });
    return response.json();
  },
};
```

### Mettre à jour les appels API existants

**Dans `src/app/events/[id]/page.tsx` :**

```typescript
// Remplacer l'ancien code de paiement par :
import { api } from '@/lib/api';

const handlePayment = async () => {
  try {
    const data = await api.createCheckoutSession({
      eventTitle: event.title,
      ticketType: selectedTicketType.name,
      quantity: ticketQuantity,
      pricePerTicket: selectedTicketType.price,
      organizerStripeAccountId: event.organizer?.stripeAccountId,
      userEmail: user.email,
    });

    if (data.success && data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    alert('Erreur lors de la création du paiement');
  }
};
```

**Dans `src/app/profile/page.tsx` :**

```typescript
import { api } from '@/lib/api';

const handleConnectStripe = async () => {
  try {
    const data = await api.createStripeConnect({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
    });

    if (data.success && data.onboardingUrl) {
      window.location.href = data.onboardingUrl;
    }
  } catch (error) {
    alert('Erreur lors de la connexion à Stripe');
  }
};
```

## 🔔 Étape 3 : Configurer les Webhooks

1. **Allez sur Stripe Dashboard**
   - https://dashboard.stripe.com/test/webhooks

2. **Ajouter un endpoint**
   - URL : `https://agora-backend.up.railway.app/api/webhook`
   - Événements :
     - `checkout.session.completed`
     - `account.updated`
     - `payment_intent.succeeded`

3. **Copier le "Signing secret"**
   - Ajoutez-le dans Railway : `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`

## 🧪 Étape 4 : Tester

### Test en local

```bash
# Terminal 1 : Backend
cd backend
npm run dev

# Terminal 2 : Frontend
npm run dev

# Ouvrir http://localhost:3000
```

### Test en production

1. **Frontend** : `https://VOTRE_USERNAME.github.io/Agora/`
2. **Backend** : `https://agora-backend.up.railway.app/`

### Carte de test Stripe

```
Numéro : 4242 4242 4242 4242
Expiration : 12/34
CVC : 123
```

## ⚙️ Étape 5 : Variables d'environnement

### Frontend (GitHub Pages)

Créez `.env.production` :
```
NEXT_PUBLIC_API_URL=https://agora-backend.up.railway.app
```

### Backend (Railway)

```
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
FRONTEND_URL_PROD=https://VOTRE_USERNAME.github.io
NODE_ENV=production
PORT=3001
```

## 🔒 Sécurité

### ✅ Ce qui est fait
- CORS configuré
- Headers sécurisés (Helmet)
- Validation des webhooks
- HTTPS obligatoire en production

### ⚠️ À faire avant production LIVE
- [ ] Utiliser les clés LIVE Stripe (`sk_live_`)
- [ ] Activer rate limiting
- [ ] Ajouter authentification JWT
- [ ] Logger les erreurs (Sentry)
- [ ] Backup base de données

## 🐛 Dépannage

### Erreur CORS
```javascript
// Vérifier que l'URL frontend est dans la whitelist CORS du backend
// backend/server.js ligne ~15
```

### Webhook ne fonctionne pas
```bash
# Tester avec Stripe CLI
stripe listen --forward-to https://agora-backend.up.railway.app/api/webhook
```

### API retourne 404
```
Vérifier que l'URL backend est correcte dans api.ts
```

## 📊 Monitoring

### Backend
- Railway Logs : https://railway.app/project/xxxxx/logs
- Stripe Dashboard : https://dashboard.stripe.com/test/logs

### Frontend
- GitHub Actions : https://github.com/USERNAME/Agora/actions

## 🎉 C'est prêt !

Votre plateforme Agora est maintenant complète :

✅ Frontend sur GitHub Pages (gratuit)
✅ Backend sur Railway (gratuit)
✅ Paiements Stripe fonctionnels
✅ Stripe Connect pour les organisateurs
✅ Webhooks configurés

**URL de démonstration** : `https://VOTRE_USERNAME.github.io/Agora/`

## 📞 Support

Questions ? contact@agora-platform.com
