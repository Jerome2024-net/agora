# 💰 Système de Wallet - Guide Complet

## 🎯 Vue d'ensemble

Le **Wallet (Portefeuille)** d'Agora permet aux organisateurs de :
- 📊 Suivre leurs revenus en temps réel
- 💰 Gérer leur solde disponible et en attente
- 📜 Consulter l'historique complet des transactions
- 💸 Demander des retraits vers leur compte bancaire
- 📈 Analyser leurs performances financières

---

## ✨ Fonctionnalités principales

### 1. Tableau de bord financier

**Trois métriques clés :**

```
┌──────────────────┐  ┌────────────────────┐  ┌─────────────────┐
│ 💚 Disponible    │  │ 🟠 En attente      │  │ 💜 Total        │
│   1,250.50€      │  │    450.00€         │  │   2,850.75€     │
│ [Retirer]        │  │ Sous 2-3 jours     │  │ Cumulé          │
└──────────────────┘  └────────────────────┘  └─────────────────┘
```

- **Solde disponible** : Argent prêt à être retiré immédiatement
- **Revenus en attente** : Paiements en cours de validation (2-3 jours)
- **Total cumulé** : Somme de tous les revenus depuis le début

### 2. Historique des transactions

- 📋 Liste complète de toutes les opérations
- 🔍 Recherche par événement ou description
- 🔽 Filtres par type (ventes, retraits, remboursements)
- 📅 Tri chronologique
- 💡 Détails complets : montant, frais, statut, date

### 3. Demandes de retrait

- 💳 Retrait vers compte bancaire via Stripe Connect
- ⚡ Traitement rapide (1-2 jours ouvrés)
- 📊 Suivi des statuts en temps réel
- 🔒 Sécurisé et tracé

---

## 🎨 Interface utilisateur

### Page Wallet principale

**URL :** `/wallet`

**Sections :**
1. **En-tête** : Titre et description
2. **Cartes métriques** : 3 cartes colorées (disponible, attente, total)
3. **Retraits récents** : Liste des 3 dernières demandes
4. **Historique** : Tableau complet des transactions

**Actions disponibles :**
- Bouton "Retirer" sur la carte verte
- Filtres et recherche dans l'historique
- Modal de demande de retrait

### Section Wallet dans le profil

**Emplacement :** Page `/profile` pour les organisateurs

**Affichage compact :**
```
┌─────────────────────────────────────────────┐
│  💰 Mon Portefeuille                        │
│                                              │
│  Disponible  │  En attente  │  Total        │
│   1,250.50€  │    450.00€   │  2,850.75€   │
│                                              │
│  [💰 Gérer mon portefeuille]                │
└─────────────────────────────────────────────┘
```

---

## 🔄 Flux de transaction

### Vente de billet

```mermaid
Participant → Stripe → Organisateur

1. Participant achète (50€ + 2,50€ frais)
2. Stripe traite le paiement
3. Transaction créée (50€ en attente)
4. Après 2-3 jours → Transaction validée
5. Solde disponible += 50€
```

### Demande de retrait

```mermaid
Organisateur → Stripe → Banque

1. Organisateur demande 500€
2. Validation du solde (≥ 500€)
3. Demande créée (statut: pending)
4. Stripe traite (statut: processing)
5. Virement effectué (statut: completed)
6. Solde disponible -= 500€
```

---

## 📊 Types de transactions

### 💚 Vente (sale)

**Description :** Revenu d'une vente de billet

**Exemple :**
```typescript
{
  type: 'sale',
  eventTitle: 'Concert Jazz - Standard',
  amount: 50.00,
  serviceFee: 2.50,
  netAmount: 50.00,
  status: 'completed',
  participantName: 'Jean Dupont'
}
```

**Impact :**
- ✅ +50€ au solde disponible (après validation)
- ✅ +50€ au total cumulé
- 🟠 Temporairement en "revenus en attente"

### 💙 Retrait (withdrawal)

**Description :** Virement vers compte bancaire

**Exemple :**
```typescript
{
  type: 'withdrawal',
  description: 'Retrait vers compte bancaire',
  amount: 500.00,
  netAmount: -500.00,
  status: 'completed'
}
```

**Impact :**
- ❌ -500€ du solde disponible
- ⚪ Aucun impact sur le total cumulé

### 💔 Remboursement (refund)

**Description :** Annulation et remboursement d'un billet

**Exemple :**
```typescript
{
  type: 'refund',
  eventTitle: 'Concert annulé',
  amount: 50.00,
  netAmount: -50.00,
  status: 'completed'
}
```

**Impact :**
- ❌ -50€ du solde disponible
- ❌ -50€ du total cumulé

---

## 🎮 Guide d'utilisation

### Accéder au Wallet

**Méthode 1 : Navigation**
1. Connectez-vous en tant qu'organisateur
2. Cliquez sur **"Wallet"** 💰 dans la barre de navigation
3. Page Wallet s'affiche

**Méthode 2 : Profil**
1. Allez dans **"Mon Profil"**
2. Scrollez jusqu'à la section **"Mon Portefeuille"**
3. Cliquez sur **"Gérer mon portefeuille"**

### Consulter le solde

**Solde disponible (vert)** 💚
- Montant que vous pouvez retirer maintenant
- Déjà validé par Stripe
- Prêt pour un virement

**En attente (orange)** 🟠
- Paiements récents (< 3 jours)
- En cours de validation
- Sera disponible sous 2-3 jours

**Total (violet)** 💜
- Cumul de tous les revenus
- Historique complet
- Utile pour déclarations fiscales

### Voir l'historique

**Utiliser les filtres :**
1. Menu déroulant **"Filtre"**
   - Tous
   - Ventes
   - Retraits
   - Remboursements

2. Barre de recherche 🔍
   - Tapez le nom d'un événement
   - Ou un mot-clé de la description
   - Filtrage en temps réel

**Lire une transaction :**
```
┌────────────────────────────────────────────────┐
│ ↘️ Concert Jazz - Standard             ✅ Complété │
│    2 billets vendus                   +100.00€ │
│    Acheteur: Jean Dupont                       │
│    Frais de service: 5.00€                     │
│    📅 15 nov 2025, 14:30                       │
└────────────────────────────────────────────────┘
```

### Demander un retrait

**Étapes :**

1. **Cliquer sur "Retirer"**
   - Sur la carte verte "Disponible"
   - Modal s'ouvre

2. **Entrer le montant**
   - Minimum : 10€
   - Maximum : Solde disponible
   - Format: 0.00

3. **Vérifier les informations**
   - Solde disponible affiché
   - Délai : 1-2 jours ouvrés
   - Méthode : Stripe Connect

4. **Confirmer**
   - Bouton **"Confirmer"**
   - Demande créée
   - Notification affichée

5. **Suivre le statut**
   - Section "Demandes de retrait récentes"
   - Statuts :
     - 🟠 **En attente** : Créé
     - 🔵 **En cours** : Traitement Stripe
     - ✅ **Complété** : Viré
     - ❌ **Échoué** : Erreur

---

## 🔧 Configuration technique

### Prérequis

**Pour utiliser le Wallet :**
1. ✅ Compte organisateur actif
2. ✅ Stripe Connect configuré et vérifié
3. ✅ Compte bancaire validé dans Stripe
4. ✅ Au moins une vente réalisée

**Vérification :**
```
/profile → Section "Paiements Stripe Connect"
Statut doit être : ✅ Actif
```

### Structure des données

**Types TypeScript :**

```typescript
// Wallet dans User
interface User {
  walletBalance?: number;    // Disponible
  walletPending?: number;    // En attente
  walletTotal?: number;      // Total
}

// Transaction
interface WalletTransaction {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  type: 'sale' | 'refund' | 'withdrawal';
  amount: number;
  serviceFee?: number;
  netAmount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  description: string;
  participantName?: string;
}

// Retrait
interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  method: 'stripe_payout';
}
```

### API disponibles

**Fonctions data layer :**

```typescript
// Transactions
addWalletTransaction(transaction): WalletTransaction
getWalletTransactions(userId): WalletTransaction[]

// Solde
getWalletBalance(userId): { balance, pending, total }

// Retraits
createWithdrawalRequest(request): WithdrawalRequest
getWithdrawalRequests(userId): WithdrawalRequest[]
updateWithdrawalStatus(id, status): boolean
```

---

## 🔒 Sécurité

### Authentification
- ✅ Connexion requise
- ✅ Vérification du type d'utilisateur (organizer only)
- ✅ Redirection automatique si non autorisé

### Protection des données
- ✅ Isolation par userId
- ✅ Aucun accès cross-user
- ✅ Validation côté serveur

### Retraits sécurisés
- ✅ Vérification du solde avant création
- ✅ Montant max = solde disponible
- ✅ Stripe Connect requis
- ✅ Compte bancaire vérifié par Stripe
- ✅ Traçabilité complète (ID Stripe)

---

## 💡 Bonnes pratiques

### Pour les organisateurs

**1. Surveillez vos revenus**
- Consultez le Wallet quotidiennement
- Vérifiez chaque nouvelle vente
- Identifiez les événements performants

**2. Planifiez vos retraits**
- Ne retirez pas trop souvent
- Groupez les virements (économisez du temps)
- Gardez une réserve pour les remboursements potentiels

**3. Utilisez l'historique**
- Filtrez par événement
- Calculez vos revenus mensuels
- Exportez pour la comptabilité (à venir)

**4. Maintenez Stripe actif**
- Vérifiez régulièrement le statut
- Mettez à jour vos informations bancaires
- Gardez votre compte en règle

### Pour la plateforme

**1. Monitoring**
- Suivez le volume de transactions
- Alertes sur les retraits échoués
- Vérifiez les délais de traitement

**2. Support**
- Aidez les organisateurs bloqués
- Résolvez les problèmes de retrait
- Expliquez les frais et délais

---

## 📈 Statistiques et métriques

### Métriques clés

**Revenu moyen par événement :**
```
Total cumulé ÷ Nombre d'événements
Exemple: 2,850€ ÷ 5 = 570€/événement
```

**Taux de conversion :**
```
Revenus réels ÷ Revenus potentiels
Exemple: 2,850€ ÷ 3,500€ = 81%
```

**Fréquence de retrait :**
```
Nombre de retraits ÷ Période
Exemple: 4 retraits en 30 jours
```

---

## 🚀 Feuille de route

### Version actuelle (v1.0)
- ✅ Suivi des revenus en temps réel
- ✅ Historique des transactions
- ✅ Demandes de retrait
- ✅ Filtres et recherche
- ✅ Interface intuitive

### Prochainement (v1.1)
- [ ] Graphiques de revenus (courbes)
- [ ] Export CSV/PDF
- [ ] Notifications email
- [ ] Retraits automatiques

### Futur (v2.0)
- [ ] Multi-devises
- [ ] Prévisions de revenus
- [ ] Intégration comptable
- [ ] Programme de récompenses

---

## 📞 Support

### Questions fréquentes

**Q: Mon solde est à 0€ après une vente ?**
R: Normal ! Les revenus sont d'abord en "attente" (2-3 jours). Ils passeront ensuite en "disponible".

**Q: Je ne peux pas retirer mon argent ?**
R: Vérifiez que :
1. Stripe Connect est actif
2. Votre solde disponible > 10€
3. Votre compte bancaire est vérifié

**Q: Combien de temps pour recevoir un retrait ?**
R: 1-2 jours ouvrés via Stripe Connect (virement SEPA)

**Q: Y a-t-il des frais sur les retraits ?**
R: Non, les retraits via Stripe Connect sont gratuits.

**Q: Puis-je annuler un retrait ?**
R: Seulement si le statut est "En attente". Une fois "En cours", c'est trop tard.

### Contacter le support

- 📧 **Email :** support@agora.com
- 💬 **Chat :** Disponible 7j/7 dans l'app
- 📚 **Documentation :** agora.com/docs/wallet

---

**Le Wallet Agora : Vos revenus, transparents et sécurisés ! 💰✨**
