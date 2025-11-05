# 💳 Configuration du Paiement Stripe

Ce guide vous explique comment configurer Stripe pour accepter les paiements en ligne sur Agora.

## 📋 Table des matières

1. [Créer un compte Stripe](#1-créer-un-compte-stripe)
2. [Obtenir les clés API](#2-obtenir-les-clés-api)
3. [Configuration locale](#3-configuration-locale)
4. [Tester les paiements](#4-tester-les-paiements)
5. [Webhooks en développement](#5-webhooks-en-développement)
6. [Passer en production](#6-passer-en-production)

---

## 1. Créer un compte Stripe

### Option A : Compte de test (Recommandé pour débuter)

1. Allez sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Créez un compte gratuit
3. Pas besoin d'activer votre compte pour tester !

### Option B : Compte réel

1. Créez un compte sur Stripe
2. Complétez le processus de vérification
3. Activez les paiements

---

## 2. Obtenir les clés API

### En mode TEST (pour le développement)

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Assurez-vous que le mode **"Test"** est activé (toggle en haut à droite)
3. Allez dans **Developers** > **API Keys**
4. Vous verrez deux clés :
   - **Publishable key** : Commence par `pk_test_...`
   - **Secret key** : Commence par `sk_test_...` (cliquez sur "Reveal" pour la voir)

### Obtenir le Webhook Secret

1. Dans le Dashboard Stripe, allez dans **Developers** > **Webhooks**
2. Cliquez sur **Add endpoint**
3. Pour le développement local, vous devrez utiliser **Stripe CLI** (voir section 5)

---

## 3. Configuration locale

### Étape 1 : Créer le fichier `.env.local`

Dans le dossier racine de votre projet Agora, créez/modifiez le fichier `.env.local` :

```bash
# Clés Stripe (Mode TEST)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret_ici

# URL de base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Étape 2 : Remplacer les valeurs

- Remplacez `pk_test_votre_cle_publique_ici` par votre **Publishable key**
- Remplacez `sk_test_votre_cle_secrete_ici` par votre **Secret key**
- Le webhook secret sera ajouté plus tard (section 5)

### Étape 3 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
npm run dev
```

---

## 4. Tester les paiements

### Cartes de test Stripe

En mode TEST, utilisez ces numéros de carte :

#### ✅ Paiement réussi
```
Numéro : 4242 4242 4242 4242
Date : n'importe quelle date future (ex: 12/25)
CVC : n'importe quel 3 chiffres (ex: 123)
Code postal : n'importe lequel (ex: 75001)
```

#### ❌ Paiement refusé
```
Numéro : 4000 0000 0000 0002
```

#### ⚠️ Authentification requise (3D Secure)
```
Numéro : 4000 0027 6000 3184
```

### Test complet

1. Allez sur http://localhost:3000
2. Connectez-vous comme **participant**
3. Choisissez un événement payant
4. Cliquez sur "Réserver"
5. Sélectionnez le nombre de billets
6. Cliquez sur **"Procéder au paiement sécurisé"**
7. Vous serez redirigé vers Stripe Checkout
8. Utilisez la carte `4242 4242 4242 4242`
9. Validez le paiement
10. Vous serez redirigé vers la page de succès avec confettis ! 🎉
11. Vos billets apparaîtront dans "Mes Billets"

---

## 5. Webhooks en développement

Les webhooks permettent à Stripe de notifier votre application quand un paiement est confirmé.

### Installation de Stripe CLI

#### Windows (PowerShell)
```powershell
# Télécharger depuis https://github.com/stripe/stripe-cli/releases/latest
# Ou avec Chocolatey :
choco install stripe-cli
```

#### Mac
```bash
brew install stripe/stripe-cli/stripe
```

#### Linux
```bash
# Télécharger depuis https://github.com/stripe/stripe-cli/releases/latest
```

### Configuration

1. **Authentifier Stripe CLI**
```bash
stripe login
```
Cela ouvrira votre navigateur pour autoriser l'accès.

2. **Lancer le forwarding des webhooks**
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

3. **Copier le webhook secret**
Stripe CLI affichera quelque chose comme :
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

4. **Ajouter le secret dans `.env.local`**
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

5. **Redémarrer le serveur Next.js**
```bash
npm run dev
```

### Tester les webhooks

Avec Stripe CLI en cours d'exécution, effectuez un paiement test. Vous verrez dans le terminal Stripe CLI les événements reçus :

```
2024-01-15 10:30:45  --> checkout.session.completed [evt_xxxxx]
2024-01-15 10:30:45  <--  [200] POST http://localhost:3000/api/webhook [evt_xxxxx]
```

---

## 6. Passer en production

### Étape 1 : Activer votre compte Stripe

1. Complétez les informations de votre entreprise
2. Ajoutez vos informations bancaires
3. Vérifiez votre identité

### Étape 2 : Obtenir les clés de PRODUCTION

1. Dans le Dashboard Stripe, **désactivez** le mode Test (toggle en haut)
2. Allez dans **Developers** > **API Keys**
3. Copiez vos clés de **production** :
   - `pk_live_...` (Publishable key)
   - `sk_live_...` (Secret key)

### Étape 3 : Configurer les webhooks en production

1. Dans **Developers** > **Webhooks**
2. Cliquez sur **Add endpoint**
3. URL : `https://votre-domaine.com/api/webhook`
4. Sélectionnez l'événement : `checkout.session.completed`
5. Copiez le **Signing secret** (`whsec_...`)

### Étape 4 : Variables d'environnement en production

Sur votre plateforme de déploiement (Vercel, Netlify, etc.), configurez :

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_live
STRIPE_SECRET_KEY=sk_live_votre_cle_live
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_live
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
```

---

## 🎯 Résumé des fonctionnalités

### ✅ Ce qui est implémenté

- ✅ Paiement sécurisé par carte bancaire via Stripe Checkout
- ✅ Support des événements gratuits (sans paiement)
- ✅ Support de plusieurs types de billets
- ✅ Page de succès avec confettis et redirection automatique
- ✅ Génération automatique des billets après paiement confirmé
- ✅ QR codes générés pour chaque billet
- ✅ Webhooks pour confirmation asynchrone
- ✅ Gestion des erreurs de paiement
- ✅ Redirection en cas d'annulation
- ✅ État de chargement pendant le paiement
- ✅ Badge "Paiement sécurisé par Stripe"

### 🎨 Expérience utilisateur

1. **Sélection de billets** : L'utilisateur choisit son type et sa quantité
2. **Bouton dynamique** :
   - Événement gratuit → "Confirmer la réservation gratuite"
   - Événement payant → "Procéder au paiement sécurisé" 💳
3. **Redirection Stripe** : Interface de paiement sécurisée
4. **Confirmation visuelle** : Confettis, son, vibration 🎉
5. **Auto-redirection** : Vers "Mes Billets" après 5 secondes
6. **Billets disponibles** : QR codes prêts à scanner

---

## 🔒 Sécurité

- ✅ Les clés secrètes ne sont **jamais** exposées au client
- ✅ Validation des webhooks avec signature Stripe
- ✅ Paiements traités côté serveur uniquement
- ✅ Redirection sécurisée avec session IDs
- ✅ Conformité PCI-DSS (géré par Stripe)

---

## 💰 Tarification Stripe

### Mode Test
- **Gratuit** : Transactions illimitées

### Mode Production
- **2,9% + 0,25€** par transaction réussie européenne
- **Pas de frais mensuels**
- **Pas de frais d'installation**

Pour plus d'infos : [stripe.com/pricing](https://stripe.com/pricing)

---

## 🆘 Dépannage

### "Error: Invalid API Key"
- Vérifiez que votre clé commence par `sk_test_` (mode test) ou `sk_live_` (production)
- Assurez-vous que `.env.local` est bien à la racine du projet
- Redémarrez le serveur après modification de `.env.local`

### "Webhook signature verification failed"
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
- En développement, assurez-vous que `stripe listen` est actif
- Vérifiez que l'URL du webhook est correcte

### Le paiement réussit mais les billets ne sont pas créés
- Vérifiez les logs du webhook : `stripe listen --forward-to localhost:3000/api/webhook`
- Assurez-vous que l'événement `checkout.session.completed` est reçu
- Vérifiez la console du serveur Next.js

### "Cannot redirect to checkout"
- Vérifiez votre `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Assurez-vous que la clé commence par `pk_test_` ou `pk_live_`
- Videz le cache du navigateur et rechargez

---

## 📚 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Cartes de test](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## 🎉 C'est prêt !

Votre système de paiement Stripe est maintenant configuré. Les utilisateurs peuvent :

1. 💳 Payer en ligne de manière sécurisée
2. 🎫 Recevoir leurs billets instantanément
3. 📱 Scanner leurs QR codes à l'entrée
4. 👥 Inviter leurs amis avec des liens personnalisés

**Bon développement ! 🚀**
