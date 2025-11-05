# Options de Déploiement - Agora

## ✅ Actuellement : GitHub Pages (Gratuit)

Votre application est configurée pour GitHub Pages avec les limitations suivantes :

### Limitations GitHub Pages
- ❌ **Pas de routes dynamiques** : `/events/[id]` ne fonctionne pas
- ❌ **Pas d'API routes** : Les endpoints `/api/*` ne fonctionnent pas
- ✅ **Export statique uniquement** : HTML/CSS/JS statiques
- ✅ **Gratuit et illimité**
- ✅ **HTTPS automatique**

### Ce qui fonctionne sur GitHub Pages
- Page d'accueil avec liste des événements
- Page d'authentification
- Page de création d'événement
- Page de profil
- Page des billets
- Page du wallet
- Toutes les pages statiques

### Ce qui ne fonctionne PAS
- **Détails d'un événement** (`/events/[id]`) - route dynamique supprimée
- **API Stripe** - nécessite un backend séparé
- **Paiements** - nécessite le backend déployé

---

## 🚀 Option recommandée : Vercel (Gratuit)

Vercel offre toutes les fonctionnalités de Next.js sans limitations :

### Avantages Vercel
- ✅ **Routes dynamiques complètes** : `/events/[id]` fonctionne
- ✅ **API Routes** : Tous les endpoints `/api/*` fonctionnent
- ✅ **Déploiement automatique** depuis GitHub
- ✅ **Preview deployments** pour chaque PR
- ✅ **Analytics inclus**
- ✅ **100% gratuit** pour projets personnels
- ✅ **HTTPS automatique**
- ✅ **Domaine personnalisé** gratuit

### Comment déployer sur Vercel

1. **Créer un compte Vercel** :
   - Aller sur https://vercel.com
   - Se connecter avec votre compte GitHub

2. **Importer le projet** :
   - Cliquer sur "Add New Project"
   - Sélectionner votre repository `Jerome2024-net/agora`
   - Cliquer sur "Import"

3. **Configuration** :
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build (ou laissez vide)
   Output Directory: .next (ou laissez vide)
   Install Command: npm install (ou laissez vide)
   ```

4. **Variables d'environnement** :
   Ajouter dans les settings :
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_BASE_URL=https://votre-app.vercel.app
   ```

5. **Déployer** :
   - Cliquer sur "Deploy"
   - Attendre 2-3 minutes
   - Votre app sera sur `https://agora-xxx.vercel.app`

6. **Configuration Next.js pour Vercel** :
   Modifiez `next.config.js` :
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     // Supprimer output: 'export'
     // Supprimer basePath
     // Supprimer assetPrefix
     images: {
       domains: ['images.unsplash.com'],
     },
   }
   module.exports = nextConfig
   ```

### Après le déploiement Vercel

1. **Récupérer l'URL** de votre app : `https://agora-xxx.vercel.app`

2. **Configurer Stripe Webhooks** :
   - Aller sur https://dashboard.stripe.com/webhooks
   - Ajouter endpoint : `https://agora-xxx.vercel.app/api/webhook`
   - Sélectionner les événements : `checkout.session.completed`, `account.updated`
   - Copier le signing secret dans les variables d'environnement Vercel

3. **Tester les paiements** :
   - Carte test : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

---

## 🔧 Option Backend séparé : Railway/Render (Gratuit)

Si vous voulez garder GitHub Pages pour le frontend :

### Railway (Recommandé)

1. **Créer compte** : https://railway.app
2. **New Project** → Deploy from GitHub
3. **Sélectionner** le dossier `/backend`
4. **Variables d'environnement** :
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   FRONTEND_URL=https://jerome2024-net.github.io
   FRONTEND_URL_PROD=https://jerome2024-net.github.io/agora
   PORT=3001
   ```
5. **URL du backend** : `https://agora-backend.up.railway.app`

### Render

1. **Créer compte** : https://render.com
2. **New Web Service**
3. **Connect GitHub** repository
4. **Configuration** :
   - Root Directory : `backend`
   - Build Command : `npm install`
   - Start Command : `npm start`
5. **Variables d'environnement** : (comme Railway)

### Connecter le frontend au backend

Dans `src/lib/api.ts` (à créer) :
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://agora-backend.up.railway.app';

export async function createCheckoutSession(data: any) {
  const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

---

## 📊 Comparaison

| Fonctionnalité | GitHub Pages | Vercel | Railway/Render Backend |
|----------------|--------------|---------|------------------------|
| Pages statiques | ✅ | ✅ | ❌ |
| Routes dynamiques | ❌ | ✅ | ❌ |
| API Routes | ❌ | ✅ | ✅ |
| Stripe Payments | ❌ | ✅ | ✅ |
| Prix | Gratuit | Gratuit | Gratuit (limites) |
| Setup complexité | Facile | Très facile | Moyen |
| Recommended | Pour demo | ⭐ Pour prod | Pour backend only |

---

## 🎯 Recommandation finale

**Pour une application complète avec paiements** :
👉 **Déployez sur Vercel** - C'est la solution la plus simple et la plus complète.

**Pour une demo/portfolio sans paiements** :
👉 **Gardez GitHub Pages** - C'est suffisant et gratuit.

**Pour architecture avancée** :
👉 **Frontend GitHub Pages + Backend Railway** - Séparation des responsabilités.

---

## 🆘 Support

Si vous avez besoin d'aide pour le déploiement :
- Vercel : https://vercel.com/docs
- Railway : https://docs.railway.app
- Render : https://render.com/docs
