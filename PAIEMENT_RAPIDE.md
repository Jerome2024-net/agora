# 💳 Paiement Stripe - Guide Rapide

## 🚀 Configuration en 3 étapes

### 1️⃣ Créer un compte Stripe TEST

Allez sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)

### 2️⃣ Copier vos clés API

Dans le Dashboard Stripe (mode TEST activé) :
- **Developers** > **API Keys**
- Copiez votre **Publishable key** (`pk_test_...`)
- Copiez votre **Secret key** (`sk_test_...`)

### 3️⃣ Configurer `.env.local`

Modifiez le fichier `.env.local` à la racine du projet :

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Puis redémarrez le serveur** :
```bash
npm run dev
```

---

## 🧪 Tester un paiement

1. Allez sur http://localhost:3000
2. Connectez-vous comme **participant**
3. Choisissez un événement **payant**
4. Cliquez sur **"Procéder au paiement sécurisé"**
5. Utilisez la carte de test :
   ```
   Numéro : 4242 4242 4242 4242
   Date : 12/34 (n'importe quelle date future)
   CVC : 123 (n'importe quels 3 chiffres)
   ```
6. Confirmez le paiement
7. Vous verrez des **confettis** 🎉
8. Redirection automatique vers **"Mes Billets"**

---

## ✅ Que teste-t-on ?

- ✅ **Paiement sécurisé** par Stripe Checkout
- ✅ **Génération de billets** avec QR codes
- ✅ **Page de succès** animée avec confettis
- ✅ **Événements gratuits** (sans paiement Stripe)
- ✅ **Types de billets multiples** (VIP, Standard, etc.)

---

## 📚 Documentation complète

Pour la configuration avancée (webhooks, production, etc.) :
👉 Consultez **[STRIPE_SETUP.md](./STRIPE_SETUP.md)**

---

## 🆘 Problèmes courants

### ❌ "Error: Stripe key not configured"
→ Vérifiez que `.env.local` contient bien vos clés
→ Redémarrez le serveur après modification

### ❌ "Cannot create checkout session"
→ Vérifiez que votre clé **Secret** commence par `sk_test_`
→ Assurez-vous d'être en mode TEST dans Stripe

### ❌ Les billets ne sont pas créés
→ En développement, les webhooks ne fonctionnent pas automatiquement
→ Pour l'instant, testez avec des événements **gratuits**
→ Pour activer les webhooks : voir [STRIPE_SETUP.md](./STRIPE_SETUP.md) section 5

---

## 🎯 Fonctionnalités implémentées

✅ **Paiement par carte** via Stripe Checkout
✅ **Événements gratuits** (pas de paiement requis)
✅ **Multi-billets** (acheter plusieurs billets d'un coup)
✅ **Types de billets** (VIP, Standard, Étudiant, etc.)
✅ **Page de succès** avec confettis et son
✅ **Page d'annulation** si l'utilisateur abandonne
✅ **QR codes** générés automatiquement
✅ **État de paiement** dans les réservations
✅ **Webhooks** pour confirmation asynchrone (production)

---

## 💡 En résumé

1. **Gratuit** → Pas de paiement, billets créés directement
2. **Payant** → Redirection vers Stripe → Paiement → Billets créés

**C'est prêt ! 🚀**
