# 🚨 ERREUR : "Erreur lors de la connexion à Stripe"

## ❌ Le Problème

Quand vous cliquez sur **"Connecter Stripe"**, vous voyez : 
```
Erreur lors de la connexion à Stripe. Veuillez réessayer.
```

## ✅ La Solution (5 minutes)

Stripe refuse de créer des comptes Connect car **votre profil de plateforme n'est pas complété**.

### 📋 ÉTAPES À SUIVRE

#### 1️⃣ Ouvrez votre Dashboard Stripe

Cliquez sur ce lien : **https://dashboard.stripe.com/settings/connect/platform-profile**

#### 2️⃣ Remplissez TOUT le formulaire

Vous devez remplir :
- ✅ Nom de la plateforme : "Agora"
- ✅ Type de business
- ✅ Adresse complète de votre entreprise
- ✅ Informations légales (SIRET si vous avez)
- ✅ Description de votre plateforme

#### 3️⃣ ⚠️ ÉTAPE CRITIQUE : Acceptez les responsabilités

**VOUS DEVEZ COCHER TOUTES CES CASES** :

- [ ] ✅ **Gestion des pertes** (Loss management)
- [ ] ✅ **Protection contre la fraude**
- [ ] ✅ **Litiges et remboursements**

**Sans ces cases cochées, Stripe refuse de créer des comptes Connect !**

#### 4️⃣ Enregistrez

Cliquez sur **"Save"** ou **"Enregistrer"** en bas du formulaire.

#### 5️⃣ Réessayez sur Agora

1. Retournez sur votre application Agora
2. Allez sur `/profile`
3. Cliquez à nouveau sur **"Connecter Stripe"**
4. ✅ **Ça devrait maintenant fonctionner !**

---

## 🎯 Ce que vous verrez après

### AVANT (ce que vous voyez maintenant)
```
❌ Erreur lors de la connexion à Stripe. Veuillez réessayer.
```

### APRÈS (ce qui devrait se passer)
```
✅ Redirection vers Stripe Onboarding
→ Formulaire Stripe pour ajouter IBAN, identité, etc.
→ Retour vers Agora
→ "Compte Stripe connecté avec succès !"
```

---

## 🔍 Comment vérifier que c'est bien configuré ?

Allez sur : https://dashboard.stripe.com/settings/connect/platform-profile

Vous devriez voir :
- ✅ Tous les champs remplis
- ✅ Des coches vertes ✅ partout
- ✅ Statut : "Complete" ou "Active"

---

## 🆘 Le message d'erreur a changé !

Maintenant, quand vous cliquez sur "Connecter Stripe", vous verrez un message plus détaillé :

```
⚠️ Configuration Stripe requise

Avant de créer des comptes Connect, vous devez compléter votre profil 
de plateforme Stripe :

1. Allez sur : https://dashboard.stripe.com/settings/connect/platform-profile
2. Remplissez TOUTES les informations
3. Acceptez les responsabilités de gestion des pertes ✅
4. Enregistrez
5. Revenez ici et réessayez
```

---

## 💡 Pourquoi cette erreur ?

Stripe exige que toutes les plateformes (comme Agora) qui créent des comptes Connect pour d'autres personnes (les organisateurs) **acceptent officiellement les responsabilités légales**.

C'est une protection pour :
- Vous (la plateforme)
- Les organisateurs
- Les participants
- Stripe

---

## ⏱️ Temps nécessaire

- ⏱️ **5 minutes** pour compléter le profil
- ✅ **À faire une seule fois**
- 🚀 **Après, tout fonctionne automatiquement**

---

## 📚 Liens Utiles

- **Dashboard Stripe** : https://dashboard.stripe.com
- **Platform Profile** : https://dashboard.stripe.com/settings/connect/platform-profile
- **Documentation Stripe Connect** : https://stripe.com/docs/connect

---

**Suivez ces étapes et tout fonctionnera ! 🎉**
