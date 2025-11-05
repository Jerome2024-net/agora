# 🚀 DÉMARRAGE RAPIDE - BACKEND AGORA

## ✅ Installation terminée !

Les dépendances sont installées. Suivez ces étapes :

## 📝 Étape 1 : Configuration

1. **Créez votre fichier `.env`** :
   ```bash
   cd backend
   copy .env.example .env
   ```

2. **Obtenez vos clés Stripe** :
   - Allez sur https://dashboard.stripe.com
   - Créez un compte gratuit
   - Mode **Test** → Développeurs → Clés API
   - Copiez la **Clé secrète** (commence par `sk_test_`)

3. **Éditez `.env`** :
   ```
   STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_ICI
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

## 🎯 Étape 2 : Démarrer le serveur

### En développement (avec auto-reload)
```bash
npm run dev
```

### En production
```bash
npm start
```

Le serveur démarre sur **http://localhost:3001**

## 🧪 Étape 3 : Tester

### Test du serveur
Ouvrez http://localhost:3001 dans votre navigateur

Vous devriez voir :
```json
{
  "status": "ok",
  "message": "Agora Backend API",
  "version": "1.0.0"
}
```

### Test d'un paiement
```bash
curl -X POST http://localhost:3001/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d "{\"eventTitle\":\"Concert Test\",\"ticketType\":\"Standard\",\"quantity\":1,\"pricePerTicket\":50,\"userEmail\":\"test@example.com\"}"
```

## 🌐 Étape 4 : Déploiement

### Option 1 : Railway (Recommandé - Gratuit)
1. Créez un compte sur https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Sélectionnez votre repo
4. Root Directory : `backend`
5. Ajoutez les variables d'environnement
6. Déployez !

Railway vous donne une URL : `https://xxx.up.railway.app`

### Option 2 : Heroku (Gratuit)
```bash
heroku create agora-backend
heroku config:set STRIPE_SECRET_KEY=sk_test_xxx
git subtree push --prefix backend heroku main
```

### Option 3 : Render (Gratuit)
1. https://render.com
2. "New Web Service"
3. Connectez GitHub
4. Root : `backend`
5. Build : `npm install`
6. Start : `npm start`

## 🔗 Étape 5 : Connecter au Frontend

Une fois le backend déployé, mettez à jour l'URL dans le frontend :

**Créez `src/lib/api.ts`** :
```typescript
const API_URL = 'https://VOTRE_BACKEND_URL';  // ← Remplacez
```

Voir le fichier **BACKEND_INTEGRATION_GUIDE.md** pour plus de détails.

## 📊 Commandes utiles

```bash
# Démarrer en dev
npm run dev

# Démarrer en prod
npm start

# Voir les logs
npm run dev

# Installer une dépendance
npm install package-name
```

## 🎓 Comprendre l'architecture

```
Frontend (GitHub Pages)
    ↓ HTTPS
Backend (Railway/Heroku)
    ↓ API Stripe
Stripe Servers
```

**Le backend gère :**
- ✅ Création des sessions de paiement
- ✅ Stripe Connect (comptes organisateurs)
- ✅ Webhooks Stripe
- ✅ Gestion du wallet
- ✅ Sécurité des clés API

**Le frontend gère :**
- ✅ Interface utilisateur
- ✅ Navigation
- ✅ Affichage des événements
- ✅ Appels au backend via fetch()

## 🐛 Problèmes fréquents

### "stripe is not defined"
➡️ Vérifiez que `STRIPE_SECRET_KEY` est dans `.env`

### "Port 3001 already in use"
➡️ Changez le port dans `.env` : `PORT=3002`

### "Cannot find module"
➡️ Réinstallez : `npm install`

### "CORS error"
➡️ Ajoutez votre URL frontend dans `server.js` ligne 15

## 📚 Documentation

- **README.md** - Documentation complète du backend
- **BACKEND_INTEGRATION_GUIDE.md** - Guide d'intégration
- **DEPLOYMENT_GUIDE.md** - Guide de déploiement GitHub Pages

## 🎉 Prêt à démarrer !

```bash
# Dans le terminal, depuis le dossier backend :
npm run dev
```

Puis ouvrez http://localhost:3001 pour vérifier que ça fonctionne !

---

📧 Questions ? contact@agora-platform.com
