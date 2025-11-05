# Backend Node.js Agora

Backend API pour gérer les paiements Stripe et Stripe Connect pour la plateforme Agora.

## 🚀 Installation

```bash
cd backend
npm install
```

## ⚙️ Configuration

1. Copiez le fichier `.env.example` en `.env`
2. Remplissez vos clés Stripe :
   - `STRIPE_SECRET_KEY` - Votre clé secrète Stripe
   - `STRIPE_WEBHOOK_SECRET` - Secret webhook (voir section Webhooks)

```bash
cp .env.example .env
# Éditez .env avec vos clés
```

## 🔑 Obtenir les clés Stripe

1. Allez sur https://dashboard.stripe.com
2. Créez un compte (gratuit)
3. Mode Test : Utilisez les clés test (préfixe `sk_test_` et `pk_test_`)
4. Allez dans **Développeurs > Clés API**
5. Copiez la clé secrète dans `.env`

## 🎯 Démarrage

### Mode développement (avec auto-reload)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:3001`

## 📡 Endpoints API

### 1. Health Check
```
GET /
```
Vérifie que l'API fonctionne

### 2. Créer une session de paiement
```
POST /api/create-checkout-session
Content-Type: application/json

{
  "eventTitle": "Concert de Jazz",
  "ticketType": "VIP",
  "quantity": 2,
  "pricePerTicket": 50,
  "organizerStripeAccountId": "acct_xxx",
  "userEmail": "user@example.com"
}
```

### 3. Créer un compte Stripe Connect
```
POST /api/stripe/connect
Content-Type: application/json

{
  "userId": "123",
  "userEmail": "organizer@example.com",
  "userName": "John Doe"
}
```

### 4. Vérifier le statut d'un compte
```
GET /api/stripe/connect?accountId=acct_xxx
```

### 5. Obtenir le lien du dashboard Stripe
```
POST /api/stripe/dashboard
Content-Type: application/json

{
  "accountId": "acct_xxx"
}
```

### 6. Demander un retrait
```
POST /api/wallet/withdraw
Content-Type: application/json

{
  "accountId": "acct_xxx",
  "amount": 100.00
}
```

### 7. Webhooks Stripe
```
POST /api/webhook
```
Endpoint pour recevoir les notifications Stripe

## 🔔 Configuration des Webhooks

1. Allez sur https://dashboard.stripe.com/test/webhooks
2. Cliquez sur "Ajouter un endpoint"
3. URL : `https://votre-backend.com/api/webhook`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `account.updated`
   - `payment_intent.succeeded`
5. Copiez le "Signing secret" dans `.env` (`STRIPE_WEBHOOK_SECRET`)

### Test en local avec Stripe CLI

```bash
# Installer Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Rediriger les webhooks vers votre serveur local
stripe listen --forward-to localhost:3001/api/webhook

# Le CLI vous donnera un webhook secret à mettre dans .env
```

## 🌐 Déploiement

### Option 1 : Heroku (Gratuit)

```bash
# Installer Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Créer l'app
heroku create agora-backend

# Configurer les variables d'environnement
heroku config:set STRIPE_SECRET_KEY=sk_test_xxx
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_xxx
heroku config:set FRONTEND_URL_PROD=https://username.github.io

# Déployer
git subtree push --prefix backend heroku main

# Ou si erreur :
git push heroku `git subtree split --prefix backend main`:main --force
```

### Option 2 : Railway (Recommandé)

1. Allez sur https://railway.app
2. Connectez votre GitHub
3. "New Project" > "Deploy from GitHub repo"
4. Sélectionnez le dossier `backend`
5. Ajoutez les variables d'environnement
6. Déployez !

### Option 3 : Render

1. Allez sur https://render.com
2. "New Web Service"
3. Connectez votre repo
4. Root Directory : `backend`
5. Build Command : `npm install`
6. Start Command : `npm start`
7. Ajoutez les variables d'environnement

### Option 4 : Vercel (Serverless)

```bash
npm i -g vercel
cd backend
vercel
```

## 🔐 Sécurité

- ✅ Helmet.js pour les headers de sécurité
- ✅ CORS configuré
- ✅ Validation des webhooks Stripe
- ✅ Variables d'environnement pour les secrets
- ✅ Pas de clés en dur dans le code

## 📊 Monitoring

### Logs
```bash
# En développement
npm run dev

# Les logs apparaissent dans le terminal
```

### Stripe Dashboard
- Paiements : https://dashboard.stripe.com/test/payments
- Connect : https://dashboard.stripe.com/test/connect/accounts
- Logs : https://dashboard.stripe.com/test/logs

## 🧪 Tests

### Test manuel avec cURL

```bash
# Health check
curl http://localhost:3001/

# Créer une session de paiement
curl -X POST http://localhost:3001/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "eventTitle": "Concert Test",
    "ticketType": "Standard",
    "quantity": 1,
    "pricePerTicket": 50,
    "userEmail": "test@example.com"
  }'
```

### Cartes de test Stripe

```
✅ Succès : 4242 4242 4242 4242
❌ Refusé : 4000 0000 0000 0002
⏳ 3D Secure : 4000 0027 6000 3184
```

Date d'expiration : n'importe quelle date future
CVC : n'importe quel 3 chiffres

## 🐛 Dépannage

### "stripe is not defined"
➡️ Vérifiez que `STRIPE_SECRET_KEY` est dans `.env`

### "CORS error"
➡️ Ajoutez votre URL frontend dans `FRONTEND_URL`

### "Webhook signature verification failed"
➡️ Vérifiez `STRIPE_WEBHOOK_SECRET` dans `.env`

### Port déjà utilisé
```bash
# Trouver le process
lsof -i :3001

# Ou changer le port dans .env
PORT=3002
```

## 📞 Support

- Documentation Stripe : https://stripe.com/docs
- Status Stripe : https://status.stripe.com
- Support : contact@agora-platform.com

## 📝 Licence

MIT
