# 🎯 ARCHITECTURE COMPLÈTE AGORA

## 📐 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                     AGORA PLATFORM                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐              ┌──────────────────────┐
│  FRONTEND            │              │  BACKEND             │
│  (GitHub Pages)      │◄────HTTPS───►│  (Railway/Heroku)    │
│                      │              │                      │
│  • Next.js Static    │              │  • Node.js/Express   │
│  • React UI          │              │  • Stripe API        │
│  • Tailwind CSS      │              │  • Webhooks          │
│  • Client-side       │              │  • Connect API       │
└──────────────────────┘              └──────────────────────┘
         │                                      │
         │                                      │
         └──────────────┬──────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   STRIPE        │
              │                 │
              │  • Payments     │
              │  • Connect      │
              │  • Webhooks     │
              └─────────────────┘
```

## 📂 Structure du projet

```
Agora/
├── 🎨 FRONTEND
│   ├── src/
│   │   ├── app/                    # Pages Next.js
│   │   │   ├── page.tsx           # 🏠 Home
│   │   │   ├── auth/              # 🔐 Authentification
│   │   │   ├── events/            # 🎫 Événements
│   │   │   ├── profile/           # 👤 Profil
│   │   │   ├── create/            # ➕ Créer événement
│   │   │   ├── dashboard/         # 📊 Dashboard
│   │   │   ├── tickets/           # 🎟️ Mes billets
│   │   │   └── wallet/            # 💰 Portefeuille
│   │   ├── components/            # Composants React
│   │   │   ├── NavBar.tsx         # Navigation
│   │   │   ├── EventCard.tsx      # Carte événement
│   │   │   └── ShareButtons.tsx   # Partage social
│   │   ├── contexts/              # Contextes React
│   │   │   └── AuthContext.tsx    # Auth globale
│   │   ├── lib/
│   │   │   ├── data.ts            # Données locales
│   │   │   └── api.ts             # 🆕 Appels API backend
│   │   └── types/
│   │       └── index.ts           # Types TypeScript
│   ├── next.config.js             # Config Next.js
│   ├── package.json
│   └── .github/workflows/         # CI/CD GitHub Actions
│       └── deploy.yml
│
├── ⚙️ BACKEND
│   ├── server.js                  # 🚀 Serveur Express
│   ├── package.json
│   ├── .env.example               # Template config
│   ├── .gitignore
│   ├── Procfile                   # Config Heroku
│   ├── README.md                  # Doc backend
│   └── QUICKSTART.md              # Guide démarrage
│
└── 📚 DOCUMENTATION
    ├── README.md                  # Doc générale
    ├── DEPLOYMENT_GUIDE.md        # Guide déploiement GitHub
    ├── BACKEND_INTEGRATION_GUIDE.md  # Guide intégration
    └── ARCHITECTURE.md            # ← Ce fichier
```

## 🔄 Flux de données

### 1️⃣ Flux de paiement

```
1. User clique "Réserver" sur le frontend
   ↓
2. Frontend appelle POST /api/create-checkout-session
   ↓
3. Backend crée une session Stripe Checkout
   ↓
4. Backend retourne l'URL Stripe
   ↓
5. Frontend redirige vers Stripe
   ↓
6. User paie sur Stripe
   ↓
7. Stripe envoie webhook au backend
   ↓
8. Backend traite le paiement
   ↓
9. Stripe redirige vers /payment/success
```

### 2️⃣ Flux Stripe Connect

```
1. Organisateur clique "Connecter Stripe"
   ↓
2. Frontend appelle POST /api/stripe/connect
   ↓
3. Backend crée un compte Connect
   ↓
4. Backend retourne URL d'onboarding
   ↓
5. Frontend redirige vers Stripe
   ↓
6. Organisateur remplit ses infos
   ↓
7. Stripe valide le compte
   ↓
8. Stripe redirige vers /profile?stripe_success=true
```

### 3️⃣ Flux de transfert d'argent

```
Participant paie 105€
   ↓
Stripe prend 105€
   ↓
Stripe transfère 100€ → Organisateur
Stripe garde 5€ → Plateforme (vous)
```

## 🎯 Endpoints API

### Frontend → Backend

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/` | GET | Health check |
| `/api/create-checkout-session` | POST | Créer paiement |
| `/api/stripe/connect` | POST | Créer compte Connect |
| `/api/stripe/connect` | GET | Statut compte |
| `/api/stripe/dashboard` | POST | Lien dashboard |
| `/api/wallet/withdraw` | POST | Retrait |
| `/api/webhook` | POST | Webhooks Stripe |

### Exemples d'appels

```typescript
// Dans le frontend (api.ts)
const response = await fetch('https://backend.railway.app/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eventTitle: "Concert",
    ticketType: "VIP",
    quantity: 2,
    pricePerTicket: 50,
    userEmail: "user@example.com"
  })
});
```

## 🔐 Sécurité

### ✅ Implémenté

- **CORS** : Whitelist des domaines autorisés
- **Helmet.js** : Headers de sécurité HTTP
- **Webhooks signés** : Validation des webhooks Stripe
- **Variables d'environnement** : Pas de clés en dur
- **HTTPS** : Obligatoire en production

### ⚠️ À ajouter avant production

- [ ] **Rate limiting** (express-rate-limit)
- [ ] **Authentification JWT** pour les endpoints sensibles
- [ ] **Validation des inputs** (Joi/Yup)
- [ ] **Logs centralisés** (Sentry/LogRocket)
- [ ] **Base de données** (PostgreSQL/MongoDB)
- [ ] **Cache** (Redis)
- [ ] **Tests** (Jest/Mocha)

## 💰 Modèle économique

### Frais de service

```
Prix billet organisateur : 100,00 €
Frais service (5%) :        +5,00 €
─────────────────────────────────────
Total participant paie :    105,00 €

Répartition :
  → Organisateur reçoit : 100,00 € (100%)
  → Plateforme garde :      5,00 € (frais)
```

### Frais Stripe

```
Stripe prend : 1,4% + 0,25€ par transaction
Sur 105€ : ~1,72€

Revenus nets :
  → Organisateur : 100,00 €
  → Vous : 5,00€ - 1,72€ = 3,28€ net
```

## 🚀 Déploiement

### 1. Frontend (GitHub Pages)

```bash
# Configuration automatique
git push origin main

# GitHub Actions build et déploie
# URL : https://USERNAME.github.io/Agora/
```

### 2. Backend (Railway)

```bash
# Sur Railway :
1. New Project → GitHub repo
2. Root Directory : backend
3. Variables d'environnement :
   STRIPE_SECRET_KEY=sk_test_xxx
   FRONTEND_URL_PROD=https://USERNAME.github.io
4. Deploy

# URL : https://agora-backend.up.railway.app
```

### 3. Webhooks Stripe

```
1. Dashboard Stripe → Webhooks
2. Endpoint : https://agora-backend.up.railway.app/api/webhook
3. Événements :
   - checkout.session.completed
   - account.updated
   - payment_intent.succeeded
4. Copier le signing secret dans Railway
```

## 🧪 Tests

### Local

```bash
# Terminal 1 : Backend
cd backend
npm run dev

# Terminal 2 : Frontend
npm run dev

# Ouvrir http://localhost:3000
```

### Production

```bash
# Frontend
https://USERNAME.github.io/Agora/

# Backend API
https://agora-backend.up.railway.app/

# Test carte Stripe
4242 4242 4242 4242
```

## 📊 Monitoring

### Frontend
- **GitHub Actions** : https://github.com/USER/Agora/actions
- **GitHub Pages** : Settings → Pages

### Backend
- **Railway Logs** : https://railway.app/project/xxx/logs
- **Railway Metrics** : CPU, RAM, Requests

### Stripe
- **Payments** : https://dashboard.stripe.com/test/payments
- **Connect** : https://dashboard.stripe.com/test/connect
- **Logs** : https://dashboard.stripe.com/test/logs
- **Webhooks** : https://dashboard.stripe.com/test/webhooks

## 📈 Scalabilité

### Actuellement (MVP)
- Frontend : Statique (illimité)
- Backend : 1 instance (500 req/min)
- Base de données : localStorage (client-side)

### Pour scaler (Production)
```
┌─────────────┐
│   Vercel    │◄─── Frontend (SSR, ISR)
└─────────────┘
       │
       ▼
┌─────────────┐
│ Railway/AWS │◄─── Backend (Auto-scale)
└─────────────┘
       │
       ▼
┌─────────────┐
│ PostgreSQL  │◄─── Base de données
└─────────────┘
       │
       ▼
┌─────────────┐
│   Redis     │◄─── Cache
└─────────────┘
```

## 🎯 Roadmap

### ✅ Phase 1 (MVP) - Actuelle
- Frontend statique GitHub Pages
- Backend Node.js Railway
- Paiements Stripe
- Stripe Connect

### 🚧 Phase 2 (Production)
- [ ] Base de données PostgreSQL
- [ ] Authentification JWT
- [ ] Rate limiting
- [ ] Tests automatisés
- [ ] Monitoring (Sentry)

### 📋 Phase 3 (Scale)
- [ ] Migration vers Vercel
- [ ] CDN pour les assets
- [ ] Redis cache
- [ ] Microservices
- [ ] Load balancing

## 🔧 Technologies

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Stripe SDK** - API Paiements
- **Helmet** - Sécurité
- **Morgan** - Logs

### Infra
- **GitHub Pages** - Hosting frontend
- **Railway** - Hosting backend
- **Stripe** - Paiements
- **GitHub Actions** - CI/CD

## 📞 Support

- **Documentation** : Voir README.md de chaque dossier
- **Issues** : https://github.com/USER/Agora/issues
- **Email** : contact@agora-platform.com
- **Stripe Docs** : https://stripe.com/docs

## 📝 Licence

MIT License - Voir LICENSE file

---

🎉 **Agora Platform** - Architecture by Design
