# 🧪 Guide de Test - Frais de Service

## 🎯 Ce qui a changé

**AVANT (système de commission) :**
- Organisateur fixe : 100€
- Participant paie : 100€
- Commission 5% : -5€
- Organisateur reçoit : **95€** ❌

**MAINTENANT (frais de service) :**
- Organisateur fixe : 100€
- Frais de service 5% : +5€
- Participant paie : **105€**
- Organisateur reçoit : **100€** ✅
- Plateforme reçoit : **5€** ✅

---

## 📋 Scénarios de test

### Test 1 : Événement payant avec Stripe Connect

#### Prérequis
1. Compte organisateur avec Stripe Connect activé
2. Compte participant

#### Étapes

**En tant qu'organisateur :**
1. ✅ Connectez-vous comme organisateur
2. ✅ Allez dans "Mon Profil"
3. ✅ Connectez votre compte Stripe (si pas déjà fait)
4. ✅ Créez un événement payant (ex: 50€)

**En tant que participant :**
1. ✅ Déconnectez-vous
2. ✅ Connectez-vous comme participant
3. ✅ Trouvez l'événement créé
4. ✅ Cliquez sur "Réserver maintenant"
5. ✅ Remplissez le formulaire

**Vérification du récapitulatif :**
```
┌────────────────────────────────────┐
│  1 billet × 50€           50,00 €  │
│  💼 Frais de service (5%) +2,50 €  │
│  ─────────────────────────────────  │
│  Total                    52,50 €  │
└────────────────────────────────────┘
```

6. ✅ Cliquez sur "Procéder au paiement sécurisé"
7. ✅ Vérifiez dans Stripe Checkout :
   - Ligne 1 : "Événement - Standard" → 50,00€
   - Ligne 2 : "💼 Frais de service Agora (5%)" → 2,50€
   - **Total : 52,50€**

8. ✅ Payez avec carte test : `4242 4242 4242 4242`

**Vérification côté organisateur :**
9. ✅ Reconnectez-vous comme organisateur
10. ✅ Allez dans "Mon Profil"
11. ✅ Cliquez sur "Voir mon dashboard Stripe"
12. ✅ Vérifiez :
    - **Vous avez reçu : 50,00€** ✅
    - Application fee (plateforme) : 2,50€

**Console logs à vérifier :**
```
💰 Paiement Connect avec frais de service:
  - Prix des tickets: 50.00€
  - Frais de service (5%): 2.50€
  - Total participant paie: 52.50€
  - Organisateur reçoit: 50.00€ (100% du prix des tickets)
  - Plateforme reçoit: 2.50€
```

---

### Test 2 : Événement gratuit

#### Étapes
1. ✅ Créez un événement gratuit (0€)
2. ✅ Réservez en tant que participant
3. ✅ Vérifiez le récapitulatif :
   ```
   ┌────────────────────────────────────┐
   │  1 billet × 0€            0,00 €   │
   │  Total                    0,00 €   │
   └────────────────────────────────────┘
   ```
4. ✅ Pas de frais de service affichés
5. ✅ Réservation instantanée (pas de paiement)

---

### Test 3 : Billets multiples

#### Étapes
1. ✅ Événement à 30€
2. ✅ Réservez 3 billets
3. ✅ Vérifiez le récapitulatif :
   ```
   ┌────────────────────────────────────┐
   │  3 billets × 30€          90,00 €  │
   │  💼 Frais de service (5%) +4,50 €  │
   │  ─────────────────────────────────  │
   │  Total                    94,50 €  │
   └────────────────────────────────────┘
   ```
4. ✅ Total participant : **94,50€**
5. ✅ Organisateur reçoit : **90€**
6. ✅ Plateforme reçoit : **4,50€**

---

### Test 4 : Types de billets différents

#### Étapes
1. ✅ Créez un événement avec plusieurs types :
   - VIP : 100€
   - Standard : 50€
   - Étudiant : 30€

2. ✅ Réservez 1 billet VIP
3. ✅ Vérifiez :
   ```
   ┌────────────────────────────────────┐
   │  1 billet × 100€         100,00 €  │
   │  💼 Frais de service (5%) +5,00 €  │
   │  ─────────────────────────────────  │
   │  Total                   105,00 €  │
   └────────────────────────────────────┘
   ```

4. ✅ Réservez 2 billets Étudiant
5. ✅ Vérifiez :
   ```
   ┌────────────────────────────────────┐
   │  2 billets × 30€          60,00 €  │
   │  💼 Frais de service (5%) +3,00 €  │
   │  ─────────────────────────────────  │
   │  Total                    63,00 €  │
   └────────────────────────────────────┘
   ```

---

### Test 5 : Organisateur sans Stripe Connect

#### Étapes
1. ✅ Créez un nouveau compte organisateur
2. ✅ **NE PAS** connecter Stripe
3. ✅ Créez un événement payant (40€)
4. ✅ Essayez de réserver
5. ✅ Vérifiez :
   - Pas de frais de service affichés
   - Paiement standard Stripe (non Connect)
   - Console : "⚠️ Organisateur sans compte Stripe Connect"

---

## 🔍 Points de vérification

### Interface utilisateur

#### Page de profil (organisateur)
✅ Texte mis à jour :
```
✅ Recevez 100% du prix de vos tickets directement sur votre compte
✅ Frais de service 5% payés par les participants (en plus du prix)
```

#### Page événement (formulaire de réservation)
✅ Récapitulatif détaillé avec :
- Prix des billets
- Frais de service (avec icône ?)
- Total en gros et gras

#### Stripe Checkout
✅ Deux lignes séparées :
1. Prix des billets (ce que l'organisateur reçoit)
2. Frais de service Agora (ce que la plateforme reçoit)

### Backend (console logs)

```bash
💰 Paiement Connect avec frais de service:
  - Prix des tickets: X.XX€
  - Frais de service (5%): X.XX€
  - Total participant paie: X.XX€
  - Organisateur reçoit: X.XX€ (100% du prix des tickets)
  - Plateforme reçoit: X.XX€
```

### Stripe Dashboard

#### Dashboard organisateur
✅ **Balance** = Prix des tickets (100%)
✅ Pas de déduction visible côté organisateur

#### Dashboard plateforme
✅ **Application fees** = Frais de service collectés
✅ Détail par transaction

---

## 📊 Exemples de calculs

### Exemple 1
```
Prix ticket:          50,00 €
Quantité:             × 2
Sous-total:           100,00 €
Frais service (5%):   + 5,00 €
────────────────────────────
Total participant:    105,00 €

Organisateur reçoit:  100,00 €
Plateforme reçoit:    5,00 €
```

### Exemple 2
```
Prix ticket:          75,00 €
Quantité:             × 1
Sous-total:           75,00 €
Frais service (5%):   + 3,75 €
────────────────────────────
Total participant:    78,75 €

Organisateur reçoit:  75,00 €
Plateforme reçoit:    3,75 €
```

### Exemple 3
```
Prix ticket:          0,00 €
Quantité:             × 5
Sous-total:           0,00 €
Frais service (5%):   0,00 €
────────────────────────────
Total participant:    0,00 €

Organisateur reçoit:  0,00 €
Plateforme reçoit:    0,00 €
```

---

## 🐛 Points d'attention

### ⚠️ Organisateur sans Stripe Connect
- Les frais de service ne doivent **pas** s'appliquer
- Afficher uniquement le prix des tickets
- Log : "Organisateur sans compte Stripe Connect"

### ⚠️ Événements gratuits
- Frais de service = 0€
- Pas de ligne "frais de service" dans le récapitulatif
- Réservation immédiate (pas de Stripe)

### ⚠️ Arrondis
- Utiliser `.toFixed(2)` pour l'affichage
- Stripe reçoit les montants en centimes (× 100)
- Exemple : 52,50€ → 5250 centimes

---

## ✅ Checklist de validation

- [ ] Prix des billets = ce que l'organisateur a fixé
- [ ] Frais de service = 5% du prix des billets
- [ ] Total = Prix billets + Frais de service
- [ ] Organisateur reçoit 100% du prix des billets
- [ ] Plateforme reçoit 100% des frais de service
- [ ] Événements gratuits = 0€ partout (pas de frais)
- [ ] Interface claire et transparente
- [ ] Console logs détaillés et corrects
- [ ] Dashboard Stripe organisateur montre le bon montant
- [ ] Dashboard plateforme montre les application fees

---

## 🎉 Résultat attendu

**Pour un ticket à 100€ :**
```
Avant:
Participant paie: 100€
Organisateur reçoit: 95€ ❌

Maintenant:
Participant paie: 105€
Organisateur reçoit: 100€ ✅
Plateforme gagne: 5€ ✅
```

**Tout le monde est gagnant ! 🚀**
