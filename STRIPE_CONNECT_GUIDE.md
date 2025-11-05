# 🔗 Stripe Connect - Marketplace Guide

## 🎯 Pourquoi Stripe Connect ?

**Agora est une MARKETPLACE** où :
- Les **organisateurs** créent des événements et reçoivent l'argent
- La **plateforme** prend une commission
- Les **participants** paient en ligne

Stripe Connect permet de :
✅ Gérer les paiements entre acheteurs et vendeurs
✅ Prélever une commission automatiquement
✅ Distribuer l'argent aux organisateurs
✅ Gérer la comptabilité et la conformité

---

## 📋 Architecture Stripe Connect

### Trois types de comptes :

1. **Compte Plateforme** (Agora) - Vous
2. **Comptes Connectés** (Organisateurs) - Vendeurs
3. **Clients** (Participants) - Acheteurs

### Flux de paiement :

```
Participant (100€) 
    ↓
Stripe Checkout
    ↓
Plateforme (5€ commission)
    ↓
Organisateur (95€)
```

---

## 🚀 Implémentation complète

Je vais créer un système où :

1. **Organisateurs se connectent à Stripe** via OAuth
2. **Commission automatique** sur chaque vente
3. **Transfert automatique** aux organisateurs
4. **Dashboard** pour suivre les revenus
5. **Onboarding complet** avec vérification KYC

---

## 🎨 Fonctionnalités à implémenter :

### Phase 1 : Configuration de base
- [ ] Créer l'application Stripe Connect
- [ ] Configurer les webhooks Connect
- [ ] Ajouter le flux OAuth pour les organisateurs

### Phase 2 : Onboarding organisateurs
- [ ] Bouton "Connecter Stripe" dans le profil
- [ ] Redirection vers Stripe Connect OAuth
- [ ] Sauvegarder le `connected_account_id`
- [ ] Vérifier le statut du compte

### Phase 3 : Paiements avec commission
- [ ] Modifier le checkout pour utiliser le compte connecté
- [ ] Définir la commission (ex: 5%)
- [ ] Transfert automatique après paiement

### Phase 4 : Dashboard
- [ ] Afficher les revenus de l'organisateur
- [ ] Historique des paiements
- [ ] Bouton pour accéder au Stripe Dashboard

---

## ⚙️ Configuration requise

### Variables d'environnement :

```bash
# Clés Stripe (existantes)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Nouveau pour Connect
STRIPE_CONNECT_CLIENT_ID=ca_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 💰 Structure de commission

### Option 1 : Application Fee (Recommandée)
```typescript
// La plateforme prend 5% sur chaque transaction
applicationFeeAmount: Math.round(totalPrice * 100 * 0.05)
```

### Option 2 : Pourcentage personnalisé
```typescript
// Commission variable selon le type d'événement
const commission = event.isPremium ? 0.10 : 0.05;
```

---

## 📊 Avantages de Stripe Connect

✅ **Conformité légale** - Stripe gère la KYC/AML
✅ **Paiements instantanés** - Organisateurs payés rapidement
✅ **Gestion des taxes** - Calcul automatique
✅ **Multi-devises** - Support international
✅ **Dashboard organisateur** - Accès direct à Stripe
✅ **Remboursements** - Gestion automatique
✅ **Rapports** - Export comptable

---

## 🔐 Sécurité

- ✅ Les organisateurs ne voient jamais les infos de carte
- ✅ La plateforme ne touche jamais l'argent directement
- ✅ Conformité PCI-DSS automatique
- ✅ Vérification d'identité obligatoire

---

## 💡 Exemple de tarification

### Pour un billet à 100€ :

**Sans Stripe Connect (actuellement)** :
- Participant paie : 100€
- Plateforme reçoit : 97,10€ (après frais Stripe 2,9%)
- Organisateur reçoit : 97,10€
- Commission plateforme : 0€ ❌

**Avec Stripe Connect (recommandé)** :
- Participant paie : 100€
- Frais Stripe : 2,90€
- Commission plateforme : 5€ ✅
- Organisateur reçoit : 92,10€
- **VOUS gagnez 5€ par transaction !** 💰

---

## 🎯 Dois-je implémenter maintenant ?

**OUI si :**
- ✅ Vous voulez monétiser votre plateforme
- ✅ Vous avez plusieurs organisateurs
- ✅ Vous voulez une vraie marketplace

**NON si :**
- ❌ Vous testez juste le concept
- ❌ Vous avez un seul organisateur
- ❌ Vous ne voulez pas de commission

---

## ⏱️ Temps d'implémentation estimé

- **Configuration Stripe Connect** : 15 minutes
- **Flux OAuth organisateurs** : 1 heure
- **Modification des paiements** : 30 minutes
- **Dashboard revenus** : 1 heure
- **Tests complets** : 30 minutes

**TOTAL : ~3-4 heures** pour une marketplace complète

---

## 🚦 Voulez-vous que je l'implémente ?

Répondez **"OUI IMPLEMENTE STRIPE CONNECT"** et je vais :

1. ✅ Créer le système d'onboarding pour les organisateurs
2. ✅ Modifier les paiements pour utiliser Connect
3. ✅ Ajouter la gestion des commissions
4. ✅ Créer le dashboard de revenus
5. ✅ Mettre à jour la base de données (User avec stripeAccountId)
6. ✅ Créer toutes les routes API nécessaires
7. ✅ Ajouter les pages de configuration
8. ✅ Tester le flux complet

**Ou dites-moi si vous préférez d'abord tester le système actuel !**
