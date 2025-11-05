# 🚀 DÉPLOIEMENT GITHUB PAGES - JEROME2024-NET

## ✅ Git initialisé !

Votre projet est prêt à être poussé sur GitHub.

## 📝 Étapes suivantes

### 1. Créer le repository sur GitHub (si pas déjà fait)

1. Allez sur https://github.com/new
2. **Repository name** : `Agora`
3. **Description** : Plateforme moderne d'événements avec billetterie
4. **Visibilité** : Public (pour GitHub Pages gratuit)
5. ❌ **Ne créez pas de README** (vous en avez déjà un)
6. Cliquez sur **"Create repository"**

### 2. Pousser le code sur GitHub

```bash
git push -u origin main
```

Si vous avez une erreur d'authentification, utilisez un token :
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Cochez : `repo`, `workflow`
4. Utilisez le token comme mot de passe

### 3. Activer GitHub Pages

1. Allez sur votre repo : https://github.com/Jerome2024-net/Agora
2. Cliquez sur **Settings**
3. Dans le menu de gauche : **Pages**
4. Sous **Source** :
   - Sélectionnez **"GitHub Actions"**
5. C'est tout ! Le workflow va se déclencher automatiquement

### 4. Attendre le déploiement

1. Allez dans l'onglet **Actions** de votre repo
2. Vous verrez le workflow "Deploy to GitHub Pages" en cours
3. Attendez ~2-5 minutes

### 5. Votre site sera accessible à :

```
https://jerome2024-net.github.io/Agora/
```

## 🎯 Structure déployée

```
Frontend (Static) → GitHub Pages
    ├── Page d'accueil
    ├── Authentification
    ├── Événements
    ├── Profil
    ├── Dashboard
    ├── Tickets
    └── Wallet

Backend (À déployer séparément) → Railway/Heroku
    ├── API Stripe
    ├── Webhooks
    └── Connect
```

## ⚠️ Important

### Ce qui fonctionne sur GitHub Pages :
- ✅ Interface complète
- ✅ Navigation
- ✅ Design responsive
- ✅ Affichage des événements
- ✅ Filtres et recherche
- ✅ Authentification locale (localStorage)

### Ce qui nécessite le backend :
- ⏳ Paiements Stripe (à déployer sur Railway)
- ⏳ Stripe Connect (à déployer sur Railway)
- ⏳ Webhooks (à déployer sur Railway)

## 🚀 Prochaine étape : Déployer le backend

### Option 1 : Railway (Recommandé - Gratuit)

1. Allez sur https://railway.app
2. Connectez votre GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Sélectionnez `Jerome2024-net/Agora`
5. **Root Directory** : `backend`
6. Variables d'environnement :
   ```
   STRIPE_SECRET_KEY=sk_test_votre_cle
   STRIPE_WEBHOOK_SECRET=whsec_votre_secret
   FRONTEND_URL=http://localhost:3000
   FRONTEND_URL_PROD=https://jerome2024-net.github.io
   NODE_ENV=production
   ```
7. Deploy !

Railway vous donnera une URL comme :
```
https://agora-backend-production.up.railway.app
```

### Option 2 : Heroku

```bash
cd backend
heroku create jerome-agora-backend
heroku config:set STRIPE_SECRET_KEY=sk_test_xxx
heroku config:set FRONTEND_URL_PROD=https://jerome2024-net.github.io
git subtree push --prefix backend heroku main
```

## 🔗 Après le déploiement backend

Mettez à jour l'URL backend dans le frontend en créant `src/lib/api.ts` :

```typescript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://votre-backend.up.railway.app'
  : 'http://localhost:3001';

export const api = {
  createCheckoutSession: async (data: any) => {
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  // ... autres méthodes
};
```

## 📊 Vérification

### Frontend déployé ?
✅ Visitez : https://jerome2024-net.github.io/Agora/

### Backend déployé ?
✅ Visitez : https://votre-backend.railway.app/

### Webhooks configurés ?
✅ Dashboard Stripe → Webhooks → Endpoint actif

## 🐛 Dépannage

### Le site ne s'affiche pas ?
- Attendez 5 minutes après le premier push
- Vérifiez Actions → Le workflow doit être vert ✅
- Vérifiez Settings → Pages → Site actif

### Erreur 404 ?
- L'URL est bien `https://jerome2024-net.github.io/Agora/` (avec `/Agora/`)
- Pas `https://jerome2024-net.github.io/` (sans `/Agora/`)

### Les images ne s'affichent pas ?
- Les images Unsplash externes fonctionnent toujours
- Les images locales doivent être dans `public/`

## 📞 Commandes utiles

```bash
# Voir le statut Git
git status

# Faire des modifications et les pousser
git add .
git commit -m "Update: description"
git push

# Voir l'historique
git log --oneline

# Voir les branches
git branch -a
```

## 🎉 Félicitations !

Votre plateforme Agora sera bientôt en ligne !

**URLs :**
- Frontend : https://jerome2024-net.github.io/Agora/
- Backend : (à déployer sur Railway)
- Repository : https://github.com/Jerome2024-net/Agora

**Prochaines étapes :**
1. ✅ Pousser le code : `git push -u origin main`
2. ⏳ Attendre le déploiement (2-5 min)
3. ⏳ Activer GitHub Pages
4. ⏳ Déployer le backend sur Railway
5. ⏳ Connecter frontend et backend

---

📧 Contact : contact@agora-platform.com
🔗 GitHub : https://github.com/Jerome2024-net
