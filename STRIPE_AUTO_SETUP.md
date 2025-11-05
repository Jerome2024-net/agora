# 🚀 Configuration Automatique Stripe Connect

## Vue d'ensemble

Le système Agora crée **automatiquement** un compte Stripe Connect dès qu'un organisateur s'inscrit sur la plateforme. Aucune action manuelle n'est requise de la part de l'organisateur, sauf compléter l'onboarding Stripe.

---

## 📋 Processus Automatique

### Étape 1 : Inscription d'un Organisateur
```
Utilisateur remplit le formulaire d'inscription
↓
Sélectionne "Organisateur" comme type de compte
↓
Soumet le formulaire
```

### Étape 2 : Création Automatique du Compte Stripe (Backend)
```javascript
// Dans AuthContext.tsx - signup()

if (type === 'organizer') {
  // 🔄 Appel API automatique
  const response = await fetch('/api/stripe/connect', {
    method: 'POST',
    body: JSON.stringify({
      userId: mockUser.id,
      userEmail: email,
      userName: name,
    })
  });

  // ✅ Compte Stripe Connect créé
  // ✅ Account ID sauvegardé dans le profil utilisateur
  // ✅ Flag 'needsStripeOnboarding' activé
}
```

**Résultat** :
- ✅ Compte Stripe Express créé
- ✅ `stripeAccountId` stocké dans le profil
- ✅ `needsStripeOnboarding: true` pour déclencher la redirection

### Étape 3 : Redirection Automatique vers Onboarding
```
Organisateur termine son inscription
↓
Redirecté vers /profile
↓
useEffect détecte needsStripeOnboarding: true
↓
Génération automatique du lien d'onboarding
↓
Redirection vers Stripe (formulaire KYC)
```

```javascript
// Dans profile/page.tsx - useEffect()

if (user?.needsStripeOnboarding && user.stripeAccountId) {
  console.log('🔄 Redirection automatique vers onboarding Stripe...');
  launchStripeOnboarding(user.stripeAccountId);
}
```

### Étape 4 : Onboarding Stripe (Côté Stripe)
L'organisateur complète le formulaire Stripe :
- ✅ Informations personnelles
- ✅ Informations bancaires (IBAN)
- ✅ Vérification d'identité (si nécessaire)
- ✅ Acceptation des CGU Stripe

### Étape 5 : Retour sur Agora
```
Stripe redirige vers /profile?stripe_success=true
↓
Statut du compte vérifié automatiquement
↓
needsStripeOnboarding: false (flag désactivé)
↓
Compte Stripe activé ✅
```

---

## 🔄 Schéma du Flux Complet

```
┌─────────────────────────────────────────────────────────────────┐
│                     INSCRIPTION ORGANISATEUR                     │
│                                                                  │
│  Formulaire → Type: "Organizer" → Submit                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              CRÉATION AUTOMATIQUE COMPTE STRIPE                  │
│                                                                  │
│  • POST /api/stripe/connect                                     │
│  • stripe.accounts.create({ type: 'express', ... })            │
│  • Retour: accountId (ex: acct_xxxxx)                          │
│  • Sauvegarde: user.stripeAccountId = accountId                │
│  • Flag: user.needsStripeOnboarding = true                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              REDIRECTION PAGE PROFIL (/profile)                  │
│                                                                  │
│  useEffect() détecte needsStripeOnboarding                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│         GÉNÉRATION LIEN ONBOARDING (launchStripeOnboarding)     │
│                                                                  │
│  • POST /api/stripe/connect (avec existingAccountId)           │
│  • stripe.accountLinks.create()                                 │
│  • Retour: onboardingUrl                                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              REDIRECTION VERS STRIPE ONBOARDING                  │
│                                                                  │
│  window.location.href = onboardingUrl                           │
│  Formulaire Stripe (informations bancaires, KYC)               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│             RETOUR SUR AGORA (/profile?stripe_success=true)     │
│                                                                  │
│  • Vérification statut: checkStripeAccountStatus()             │
│  • Mise à jour: stripeAccountStatus = 'active'                 │
│  • Flag désactivé: needsStripeOnboarding = false               │
│  • Badge vert affiché: ✅ "Actif"                              │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPTE STRIPE PRÊT ✅                          │
│                                                                  │
│  L'organisateur peut maintenant :                              │
│  • Créer des événements payants                                │
│  • Recevoir les paiements automatiquement                      │
│  • Gérer son wallet                                             │
│  • Faire des retraits                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration Technique

### Variables d'Environnement Requises

```bash
# .env.local

# Clés Stripe (LIVE ou TEST)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx

# Client ID Stripe Connect (OBLIGATOIRE)
# À récupérer depuis https://dashboard.stripe.com/settings/applications
STRIPE_CONNECT_CLIENT_ID=ca_xxxxx

# Webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# URL de base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Configuration du Dashboard Stripe

#### 1. Activer Stripe Connect
- Aller sur https://dashboard.stripe.com/settings/connect
- Activer Connect
- Accepter les responsabilités de gestion des pertes

#### 2. Compléter le Profil de Plateforme
- URL : https://dashboard.stripe.com/settings/connect/platform-profile
- Remplir :
  - Nom de la plateforme : **"Agora"**
  - Type d'entreprise
  - Adresse
  - Description des activités

#### 3. Récupérer le Client ID
- URL : https://dashboard.stripe.com/settings/applications
- Copier le **Client ID** (commence par `ca_`)
- Le coller dans `.env.local`

#### 4. Configurer les URLs de Redirection
Dans le Dashboard Stripe Connect :
- **Redirect URL** : `http://localhost:3000/profile`
- **Refresh URL** : `http://localhost:3000/profile?stripe_refresh=true`
- **Return URL** : `http://localhost:3000/profile?stripe_success=true`

---

## 🧪 Test du Processus

### Test en Développement

1. **Créer un compte organisateur** :
   ```
   - Aller sur /auth
   - Choisir "Organisateur"
   - Remplir le formulaire
   - Soumettre
   ```

2. **Observer les logs dans la console** :
   ```
   🔄 Création automatique du compte Stripe Connect...
   ✅ Compte Stripe Connect créé automatiquement: acct_xxxxx
   ```

3. **Vérifier la redirection automatique** :
   ```
   - Page /profile se charge
   - useEffect() détecte needsStripeOnboarding
   - 🔄 Redirection automatique vers onboarding Stripe...
   - Formulaire Stripe apparaît
   ```

4. **Compléter l'onboarding Stripe** :
   ```
   - Remplir informations
   - Soumettre
   - Retour sur /profile?stripe_success=true
   ```

5. **Vérifier le statut** :
   ```
   - Badge vert : ✅ "Actif"
   - Section Wallet visible
   - Bouton "Créer un événement" actif
   ```

### Test avec Mode Test Stripe

Pour tester sans utiliser de vraies coordonnées bancaires :

```bash
# Utiliser les clés de test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_CONNECT_CLIENT_ID=ca_xxxxx (même en test)
```

**Coordonnées bancaires de test** (pour l'onboarding) :
- IBAN : `FR14 2004 1010 0505 0001 3M02 606`
- Nom : `Test User`
- Date de naissance : `01/01/1990`

---

## 🛡️ Sécurité et Gestion des Erreurs

### Gestion des Erreurs

#### Si la création du compte échoue lors de l'inscription :
```javascript
try {
  // Création compte Stripe
} catch (error) {
  console.error('❌ Erreur création automatique Stripe:', error);
  // L'inscription continue même si Stripe échoue
  // L'utilisateur pourra réessayer plus tard
}
```

#### Si l'onboarding échoue :
```javascript
// Flag needsStripeOnboarding reste à true
// L'utilisateur pourra cliquer sur "Compléter mon compte" dans /profile
```

#### Si l'utilisateur ferme l'onboarding :
```
- Stripe redirige vers refresh_url
- Alert : "Veuillez terminer la configuration de votre compte Stripe"
- L'utilisateur peut cliquer sur "Compléter mon compte"
```

### Limitations et Restrictions

**Avant que l'onboarding soit complété** :
- ❌ Impossible de créer des événements payants
- ❌ Wallet non accessible
- ⚠️ Badge orange : "En attente"

**Après l'onboarding** :
- ✅ Tous les paiements sont traités automatiquement
- ✅ Transferts automatiques vers le compte bancaire
- ✅ Wallet et statistiques accessibles

---

## 📊 Statuts du Compte Stripe

| Statut | Badge | Description | Actions possibles |
|--------|-------|-------------|-------------------|
| `not_connected` | ⚪ Non connecté | Compte Stripe jamais créé | Créer compte (auto) |
| `pending` | 🟠 En attente | Compte créé, onboarding incomplet | Compléter onboarding |
| `active` | 🟢 Actif | Compte validé et opérationnel | Créer événements |
| `restricted` | 🔴 Restreint | Informations manquantes | Compléter infos |

---

## 🔧 Dépannage

### Problème : "Neither apiKey nor config.authenticator provided"
**Solution** :
```bash
# Vérifier que STRIPE_SECRET_KEY est défini dans .env.local
STRIPE_SECRET_KEY=sk_live_xxxxx
```

### Problème : "Please review the responsibilities of managing losses"
**Solution** :
1. Aller sur https://dashboard.stripe.com/settings/connect/platform-profile
2. Accepter les responsabilités
3. Compléter le profil de plateforme

### Problème : L'onboarding ne se lance pas automatiquement
**Solution** :
1. Vérifier les logs : `console.log()` dans useEffect
2. Vérifier que `user.needsStripeOnboarding === true`
3. Vérifier que `user.stripeAccountId` existe
4. Redémarrer le serveur : `npm run dev`

### Problème : "Invalid Client ID"
**Solution** :
```bash
# Vérifier que le Client ID commence par ca_
STRIPE_CONNECT_CLIENT_ID=ca_xxxxx (PAS "votre_client_id_connect")
```

---

## 📈 Avantages du Processus Automatique

### Pour les Organisateurs
- ✅ **Aucune friction** : inscription et configuration en une seule fois
- ✅ **Pas de manipulation manuelle** : tout est guidé
- ✅ **Prêt en quelques minutes** : création + onboarding = ~5 min
- ✅ **Transparent** : l'organisateur comprend chaque étape

### Pour la Plateforme
- ✅ **Taux de conversion élevé** : moins d'abandons
- ✅ **Moins de support** : processus automatisé
- ✅ **Scalable** : peut gérer des milliers d'organisateurs
- ✅ **Conforme** : toutes les vérifications KYC sont faites par Stripe

---

## 🚀 Prochaines Améliorations

### Court Terme
- [ ] Email de bienvenue avec lien vers onboarding si pas complété
- [ ] Notifications dans l'app pour compléter l'onboarding
- [ ] Page d'attente pendant la création du compte Stripe

### Moyen Terme
- [ ] Webhook pour détecter automatiquement la complétion de l'onboarding
- [ ] Dashboard admin pour voir les comptes en attente
- [ ] Rappels automatiques après X jours si onboarding incomplet

### Long Terme
- [ ] Support multi-pays (actuellement FR uniquement)
- [ ] Options de compte Standard (au lieu d'Express)
- [ ] Intégration avec d'autres processeurs de paiement

---

## 📚 Ressources

### Documentation Stripe
- [Stripe Connect](https://stripe.com/docs/connect)
- [Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Account Onboarding](https://stripe.com/docs/connect/onboarding)
- [Account Links](https://stripe.com/docs/api/account_links)

### Support
- Dashboard Stripe : https://dashboard.stripe.com
- Support Stripe : https://support.stripe.com
- Documentation Agora : Voir `README.md`

---

**Version** : 1.0.0  
**Dernière mise à jour** : Novembre 2025  
**Auteur** : Équipe Agora
