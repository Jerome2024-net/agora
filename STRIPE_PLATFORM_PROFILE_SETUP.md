# 🚨 Configuration du Profil de Plateforme Stripe (OBLIGATOIRE)

## ❌ Erreur Actuelle

Si vous voyez cette erreur dans la console :
```
StripeInvalidRequestError: Please review the responsibilities of managing losses 
for connected accounts at https://dashboard.stripe.com/settings/connect/platform-profile.
```

**Cela signifie que votre profil de plateforme Stripe Connect n'est pas encore configuré.**

---

## ✅ Solution : Configurer le Profil de Plateforme (5 minutes)

### Étape 1 : Accéder au Dashboard Stripe

1. Allez sur : **https://dashboard.stripe.com/settings/connect/platform-profile**
2. Connectez-vous avec votre compte Stripe

### Étape 2 : Compléter les Informations de la Plateforme

Vous devez remplir **TOUTES** les informations suivantes :

#### 📋 Informations de base
- **Nom de la plateforme** : `Agora`
- **Type de business** : Sélectionnez le type approprié (ex: Marketplace, SaaS, etc.)
- **URL du site web** : Votre URL de production ou localhost pour les tests
- **Description** : Description de votre plateforme d'événements

#### 🏢 Informations légales
- **Nom légal de l'entreprise**
- **Adresse complète** :
  - Rue
  - Ville
  - Code postal
  - Pays
- **Numéro de SIRET** (si applicable)

#### ⚠️ Responsabilités (CRITIQUE)

**VOUS DEVEZ ACCEPTER LES RESPONSABILITÉS** :

- [ ] **Gestion des pertes** : Accepter la responsabilité des pertes liées aux transactions
- [ ] **Protection contre la fraude** : Accepter de gérer la fraude
- [ ] **Litiges et remboursements** : Accepter de gérer les litiges

> **Important** : Sans accepter ces responsabilités, vous ne pouvez PAS créer de comptes Connect.

### Étape 3 : Enregistrer le Profil

1. Vérifiez que tous les champs sont remplis
2. Cochez TOUTES les cases d'acceptation des responsabilités ✅
3. Cliquez sur **"Save"** ou **"Enregistrer"**

---

## 🎉 Après Configuration

Une fois le profil de plateforme configuré :

1. **Rechargez votre application Agora**
2. **Allez sur `/wallet`** ou **`/profile`**
3. **Cliquez sur "Configurer Stripe Connect"**
4. ✅ **Ça devrait maintenant fonctionner !**

Le système créera automatiquement un compte Stripe Connect pour l'organisateur.

---

## 📊 Vérification

### Comment vérifier que c'est configuré ?

1. Allez sur : https://dashboard.stripe.com/settings/connect/platform-profile
2. Vous devriez voir :
   - ✅ Toutes les informations remplies
   - ✅ Responsabilités acceptées (coches vertes)
   - ✅ Statut : "Active" ou "Complete"

### Test de création de compte Connect

Dans la console de votre application, au lieu de voir :
```
❌ Erreur création compte Connect: StripeInvalidRequestError...
```

Vous devriez voir :
```
✅ Compte Stripe Connect créé automatiquement: acct_xxxxx
```

---

## 🔍 Dépannage

### Erreur : "Platform profile incomplete"

**Solution** : Retournez sur le profil de plateforme et vérifiez :
- Tous les champs obligatoires sont remplis
- Les cases de responsabilités sont TOUTES cochées
- Le bouton "Save" a bien été cliqué

### Erreur : "Loss management not accepted"

**Solution** : 
1. Retournez sur : https://dashboard.stripe.com/settings/connect/platform-profile
2. Cherchez la section **"Loss management"**
3. **Cochez la case d'acceptation** ✅
4. Enregistrez

### Le bouton ne fonctionne toujours pas

**Solutions** :
1. Videz le cache de votre navigateur
2. Redémarrez le serveur Next.js : `npm run dev`
3. Vérifiez que `STRIPE_SECRET_KEY` est bien dans `.env.local`
4. Vérifiez les logs du terminal pour voir l'erreur exacte

---

## 📚 Ressources Stripe

- **Documentation Platform Profile** : https://stripe.com/docs/connect/platform-profile
- **Connect Quickstart** : https://stripe.com/docs/connect/quickstart
- **Dashboard Settings** : https://dashboard.stripe.com/settings/connect

---

## 🎯 Récapitulatif

```
AVANT                          APRÈS
-----                          -----
❌ Profile incomplet           ✅ Profile complet
❌ Responsabilités non         ✅ Responsabilités acceptées
   acceptées
❌ Impossible de créer         ✅ Création automatique de comptes
   comptes Connect                Connect fonctionnelle
❌ Erreur au clic sur          ✅ Redirection vers onboarding Stripe
   "Configurer"
```

---

## 🚀 Une fois configuré

Votre système Agora fonctionnera en mode **fintech complet** :

1. ✅ Création automatique de comptes Stripe Connect
2. ✅ Onboarding automatique des organisateurs
3. ✅ Wallet alimenté automatiquement à chaque vente
4. ✅ Retraits vers compte bancaire via Stripe Payouts
5. ✅ Commission de 5% prélevée automatiquement

---

**Temps estimé** : 5 minutes
**Difficulté** : Facile (remplir un formulaire)
**Obligatoire** : OUI ⚠️
