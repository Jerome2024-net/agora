# 💰 Système FINTECH Agora - Documentation Complète

## 🎯 Vue d'Ensemble

Agora intègre un **système fintech complet** permettant aux organisateurs de gérer leurs revenus comme un véritable **compte bancaire virtuel** (wallet).

---

## 🏗️ Architecture du Système

```
┌─────────────────────────────────────────────────────────────────┐
│                      PARTICIPANT                                 │
│                                                                  │
│  Achète un billet: 50€ (ticket) + 2.50€ (frais 5%)             │
│                     = 52.50€ TOTAL                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼ Stripe Checkout
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE (Paiement)                            │
│                                                                  │
│  • 52.50€ reçus du participant                                  │
│  • 50€ → Transféré au compte Stripe Connect de l'organisateur  │
│  • 2.50€ → Frais de service gardés par la plateforme Agora     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼ Webhook (checkout.session.completed)
┌─────────────────────────────────────────────────────────────────┐
│                   WALLET ORGANISATEUR                           │
│                   (Compte Virtuel Agora)                        │
│                                                                  │
│  ✅ +50.00€ (Vente billet)                                      │
│     Status: completed                                            │
│     Disponible immédiatement                                     │
│                                                                  │
│  Solde disponible: 50.00€                                       │
│  Solde en attente: 0.00€                                        │
│  Total cumulé: 50.00€                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼ L'organisateur demande un retrait
┌─────────────────────────────────────────────────────────────────┐
│                   RETRAIT BANCAIRE                              │
│                                                                  │
│  • Organisateur demande: 50€                                    │
│  • API: /api/wallet/withdraw                                    │
│  • Stripe Payout créé                                           │
│  • Transfert vers compte bancaire (IBAN)                        │
│  • Délai: 1-2 jours ouvrés                                      │
│                                                                  │
│  Wallet après retrait:                                          │
│  - Solde disponible: 0.00€                                      │
│  - Transaction: -50.00€ (Retrait)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💳 Flux Détaillé

### 1️⃣ Achat de Billet

```typescript
// Participant achète un billet
Prix du ticket: 50.00€
Frais de service (5%): 2.50€
─────────────────────────
TOTAL À PAYER: 52.50€
```

**Stripe Checkout Session** :
```typescript
{
  line_items: [
    {
      name: "Concert - VIP",
      amount: 5000, // 50€ en centimes
      quantity: 1
    },
    {
      name: "💼 Frais de service Agora (5%)",
      amount: 250, // 2.50€ en centimes
      quantity: 1
    }
  ],
  payment_intent_data: {
    application_fee_amount: 250, // Plateforme garde 2.50€
    transfer_data: {
      destination: "acct_organisateur123" // Organisateur reçoit 50€
    }
  }
}
```

### 2️⃣ Alimentation Automatique du Wallet

**Webhook Stripe** (`checkout.session.completed`) :

```typescript
// src/app/api/webhook/route.ts

// Quand le paiement est validé
const totalPrice = 50.00; // Prix du ticket
const serviceFee = 2.50; // 5% de commission
const netAmount = 50.00; // Montant net pour l'organisateur

// Créer la transaction wallet
addWalletTransaction({
  id: "WALLET-1234567890-abc123",
  userId: "organizerId", // ID de l'organisateur
  eventId: "evt_123",
  eventTitle: "Concert Rock",
  type: "sale", // Type: vente
  amount: 50.00, // Montant du ticket
  serviceFee: 2.50, // Commission plateforme
  netAmount: 50.00, // Net = 100% du prix ticket
  status: "completed", // Disponible immédiatement
  date: "2025-11-03T10:00:00Z",
  description: "Vente de 1 billet(s) pour Concert Rock",
  stripePaymentId: "pi_xxxxx",
  participantName: "Jean Dupont"
});

// Le wallet est mis à jour automatiquement :
// walletBalance += 50.00€
// walletTotal += 50.00€
```

### 3️⃣ Affichage du Wallet

**Page Wallet** (`/wallet`) :

```tsx
┌─────────────────────────────────────────────────────────────┐
│  💰 MON PORTEFEUILLE                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │  Disponible   │  │  En attente   │  │  Total        │  │
│  │  50.00€       │  │  0.00€        │  │  50.00€       │  │
│  │  🟢 [Retirer] │  │  ⏳           │  │  💎           │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
│  📊 TRANSACTIONS RÉCENTES                                   │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ + 50.00€   Vente   Concert Rock   03/11/2025       │  │
│  │ + 30.00€   Vente   Festival Jazz  02/11/2025       │  │
│  │ - 80.00€   Retrait Compte bancaire 01/11/2025      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  📥 RETRAITS RÉCENTS                                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ✅ 80.00€  Complété   Reçu le 03/11/2025           │  │
│  │ ⏳ 50.00€  En cours   Arrivée le 05/11/2025        │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4️⃣ Demande de Retrait

**API Retrait** (`/api/wallet/withdraw`) :

```typescript
// L'organisateur clique sur "Retirer"
POST /api/wallet/withdraw
{
  userId: "org_123",
  amount: 50.00
}

// Backend vérifie :
✅ Utilisateur = organisateur
✅ Compte Stripe Connect configuré
✅ Solde suffisant (50€ disponibles)

// Créer le Stripe Payout
const payout = await stripe.payouts.create({
  amount: 5000, // 50€ en centimes
  currency: "eur",
  description: "Retrait Agora - Wallet"
}, {
  stripeAccount: "acct_organisateur123" // Compte Connect
});

// Créer la transaction de retrait
addWalletTransaction({
  type: "withdrawal",
  amount: -50.00, // Montant négatif
  status: "completed",
  stripePaymentId: payout.id
});

// Mettre à jour le solde
// walletBalance -= 50.00€

// Réponse
{
  success: true,
  withdrawal: {
    id: "WITHDRAWAL-1234567890",
    amount: 50.00,
    status: "completed",
    stripePayoutId: "po_xxxxx",
    arrivalDate: "2025-11-05T00:00:00Z" // 1-2 jours ouvrés
  }
}
```

---

## 💰 Modèle Économique

### Répartition des Revenus

| Acteur | Montant | Pourcentage | Description |
|--------|---------|-------------|-------------|
| **Participant** | Paie 52.50€ | 105% | Prix ticket + frais |
| **Organisateur** | Reçoit 50.00€ | 100% | Prix total du ticket |
| **Plateforme Agora** | Garde 2.50€ | 5% | Commission service |

### Exemple Concret

```
🎫 Concert Rock - Ticket VIP

Prix affiché: 50€
Frais de service: 2.50€ (5%)
─────────────────────────
Total participant: 52.50€

💵 Répartition après paiement :
├─ 50.00€ → Wallet Organisateur (100% du prix)
└─ 2.50€ → Commission Agora (frais de service)

💳 Wallet Organisateur :
├─ Solde disponible: +50.00€
├─ Peut retirer immédiatement
└─ Transfert vers IBAN en 1-2 jours
```

---

## 🔄 Types de Transactions Wallet

### 1. Vente (sale)

```json
{
  "type": "sale",
  "amount": 50.00,
  "serviceFee": 2.50,
  "netAmount": 50.00,
  "status": "completed",
  "description": "Vente de 1 billet(s) pour Concert Rock"
}
```

**Effet sur le wallet** :
- ✅ `walletBalance += 50.00€`
- ✅ `walletTotal += 50.00€`
- ✅ Disponible immédiatement

### 2. Retrait (withdrawal)

```json
{
  "type": "withdrawal",
  "amount": -50.00,
  "status": "completed",
  "description": "Retrait vers compte bancaire",
  "stripePayoutId": "po_xxxxx"
}
```

**Effet sur le wallet** :
- ✅ `walletBalance -= 50.00€`
- ✅ Transfert vers IBAN en 1-2 jours

### 3. Remboursement (refund)

```json
{
  "type": "refund",
  "amount": -30.00,
  "status": "completed",
  "description": "Remboursement annulation"
}
```

**Effet sur le wallet** :
- ❌ `walletBalance -= 30.00€`
- ❌ `walletTotal -= 30.00€`

### 4. Frais de service (service_fee)

```json
{
  "type": "service_fee",
  "amount": -2.50,
  "status": "completed",
  "description": "Frais de plateforme"
}
```

**Note** : Les frais de service sont payés par le participant, pas déduits du wallet organisateur.

---

## 🔒 Sécurité

### Validation des Retraits

```typescript
// Vérifications obligatoires
✅ Utilisateur authentifié
✅ Type = organisateur
✅ Compte Stripe Connect configuré
✅ Compte bancaire (IBAN) validé par Stripe
✅ Solde disponible suffisant
✅ Montant > 0€
✅ Pas de retraits en double
```

### Protection des Données

| Donnée | Stockage | Accès |
|--------|----------|-------|
| Solde wallet | Base de données locale | Organisateur uniquement |
| Transactions | Base de données locale | Organisateur uniquement |
| IBAN | Stripe Connect (chiffré) | Jamais exposé à Agora |
| Numéro carte | Stripe Checkout (tokenisé) | Jamais stocké |

---

## 📊 Statuts des Transactions

### Statut "completed" (Terminé)

✅ **Vente** : Paiement validé, fonds disponibles immédiatement  
✅ **Retrait** : Payout créé, en route vers le compte bancaire  
✅ **Remboursement** : Fonds rendus au participant

### Statut "pending" (En attente)

⏳ **Vente** : Paiement en cours de validation (rare)  
⏳ **Retrait** : Demande créée, pas encore traitée

### Statut "failed" (Échec)

❌ **Vente** : Paiement refusé (carte invalide, fonds insuffisants)  
❌ **Retrait** : Payout échoué (compte bancaire invalide)

---

## 🚀 Fonctionnalités FINTECH

### Pour les Organisateurs

✅ **Wallet en temps réel**
- Solde disponible visible instantanément
- Solde en attente (paiements en cours)
- Total cumulé de tous les revenus

✅ **Retraits vers compte bancaire**
- Montant minimum : 1€
- Montant maximum : solde disponible
- Délai : 1-2 jours ouvrés
- Méthode : Stripe Payout (SEPA)

✅ **Historique complet**
- Toutes les ventes
- Tous les retraits
- Tous les remboursements
- Export CSV (future feature)

✅ **Notifications**
- Nouvelle vente → Email + notification
- Retrait effectué → Email + confirmation
- Solde bas → Alerte

### Pour la Plateforme Agora

✅ **Commission automatique**
- 5% de chaque vente
- Prélevée au moment du paiement
- Jamais déduite du wallet organisateur

✅ **Gestion des payouts**
- Automatisée via Stripe
- Pas de validation manuelle
- Traçabilité complète

✅ **Rapports financiers**
- Total des ventes par organisateur
- Total des commissions générées
- Volume de transactions

---

## 📈 Statistiques Wallet

### Métriques Affichées

```tsx
┌─────────────────────────────────────────────────────────┐
│  📊 STATISTIQUES (Période : Ce mois)                    │
├─────────────────────────────────────────────────────────┤
│  Revenus générés:        1,250.00€                      │
│  Nombre de ventes:       25 billets                     │
│  Ticket moyen:           50.00€                         │
│  Retraits effectués:     1,000.00€                      │
│  Solde disponible:       250.00€                        │
│  Taux de conversion:     95%                            │
└─────────────────────────────────────────────────────────┘
```

### Graphiques

- 📈 Évolution du solde (30 derniers jours)
- 📊 Répartition des ventes par événement
- 💰 Historique des retraits

---

## 🔧 Configuration Technique

### Variables d'Environnement

```bash
# .env.local

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_CONNECT_CLIENT_ID=ca_xxxxx

# Commission
PLATFORM_COMMISSION_RATE=0.05 # 5%

# Webhook
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### API Routes

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/wallet/withdraw` | POST | Créer un retrait |
| `/api/wallet/withdraw` | GET | Historique retraits |
| `/api/webhook` | POST | Stripe webhooks |
| `/api/create-checkout-session` | POST | Créer paiement |

### Webhooks Stripe à Configurer

```
https://votre-domaine.com/api/webhook

Events à écouter :
✅ checkout.session.completed (paiement réussi)
✅ payment_intent.succeeded (confirmation paiement)
✅ payout.paid (retrait effectué)
✅ payout.failed (retrait échoué)
```

---

## 🧪 Tests

### Scénario de Test Complet

```bash
# 1. Créer un organisateur
POST /auth/signup
{
  "type": "organizer",
  "name": "Test Organizer",
  "email": "org@test.com"
}

# 2. Connecter Stripe Connect
# → Aller dans /profile
# → Cliquer "Connecter Stripe"
# → Compléter l'onboarding

# 3. Créer un événement
POST /api/events
{
  "title": "Concert Test",
  "price": 50.00
}

# 4. Acheter un billet (en tant que participant)
POST /api/create-checkout-session
{
  "eventId": "evt_123",
  "tickets": [{ "price": 50, "quantity": 1 }]
}
# → Payer avec carte test: 4242 4242 4242 4242

# 5. Vérifier le wallet (automatique via webhook)
GET /wallet
# Attendu:
# - Solde disponible: 50.00€
# - Transaction: +50.00€ (vente)

# 6. Effectuer un retrait
POST /api/wallet/withdraw
{
  "userId": "org_123",
  "amount": 50.00
}
# Attendu:
# - Stripe Payout créé
# - Solde: 0.00€
# - Transaction: -50.00€ (retrait)

# 7. Vérifier le compte bancaire (1-2 jours)
# → 50€ reçus sur l'IBAN
```

### Cartes de Test Stripe

```
✅ Paiement réussi:      4242 4242 4242 4242
❌ Paiement refusé:      4000 0000 0000 0002
⚠️ 3D Secure requis:    4000 0027 6000 3184
```

---

## 🆘 Dépannage

### Problème : Wallet ne s'alimente pas

**Causes possibles** :
- ❌ Webhook non configuré
- ❌ STRIPE_WEBHOOK_SECRET invalide
- ❌ Événement `checkout.session.completed` non écouté

**Solution** :
```bash
# 1. Vérifier les webhooks Stripe
https://dashboard.stripe.com/webhooks

# 2. Tester le webhook en local
stripe listen --forward-to localhost:3000/api/webhook

# 3. Vérifier les logs
# → Terminal Next.js
# → Dashboard Stripe → Logs
```

### Problème : Retrait échoue

**Causes possibles** :
- ❌ Compte Stripe Connect non configuré
- ❌ IBAN invalide
- ❌ Solde insuffisant

**Solution** :
```typescript
// Vérifier le compte Connect
GET https://dashboard.stripe.com/connect/accounts/acct_xxxxx

// Vérifier l'external account (IBAN)
// → Settings → Payouts → Bank account
```

### Problème : Commission incorrecte

**Causes possibles** :
- ❌ PLATFORM_COMMISSION_RATE mal configuré
- ❌ Calcul incorrect dans le code

**Solution** :
```bash
# Vérifier .env.local
cat .env.local | grep PLATFORM_COMMISSION_RATE
# Doit être: 0.05 (pour 5%)

# Vérifier le calcul
const serviceFee = totalPrice * 0.05; // 5%
```

---

## 📚 Ressources

### Documentation Stripe

- [Stripe Connect](https://stripe.com/docs/connect)
- [Stripe Payouts](https://stripe.com/docs/payouts)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Application Fees](https://stripe.com/docs/connect/charges#application-fees)

### Code Source

- `src/app/api/webhook/route.ts` - Alimentation automatique du wallet
- `src/app/api/wallet/withdraw/route.ts` - Gestion des retraits
- `src/app/wallet/page.tsx` - Interface utilisateur
- `src/lib/data.ts` - Logique wallet (transactions)

---

## 🎉 Résumé

### Ce que Vous Avez

✅ **Système FINTECH complet** intégré à votre plateforme  
✅ **Wallet virtuel** pour chaque organisateur  
✅ **Alimentation automatique** à chaque vente  
✅ **Retraits vers compte bancaire** en 1-2 jours  
✅ **Commission de 5%** prélevée automatiquement  
✅ **Interface intuitive** avec historique complet  
✅ **Sécurité** : Stripe Connect + validation complète  

### Comment Ça Marche

1. **Participant achète** → 52.50€ (50€ + 5%)
2. **Stripe transfère** → 50€ à l'organisateur
3. **Wallet alimenté** → +50€ automatiquement (webhook)
4. **Organisateur retire** → 50€ vers son IBAN
5. **Fonds reçus** → 1-2 jours ouvrés

**Votre plateforme Agora est maintenant une vraie FINTECH ! 🚀💰**

---

**Version** : 3.0.0  
**Date** : Novembre 2025  
**Type** : Système FINTECH intégré  
**Status** : ✅ Opérationnel
