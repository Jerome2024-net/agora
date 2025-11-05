# 🔧 Guide de Dépannage : "Configurer maintenant" ne marche pas

## 🔴 Problème

Sur `/wallet`, vous cliquez sur **"Configurer maintenant"** mais ça ne fonctionne pas.

## ✅ Solution Simple (5 minutes)

### 📍 Vous êtes ici

```
/wallet → "Configurer maintenant" → ❌ Ne marche pas
```

### 🎯 Voici pourquoi

Stripe a besoin que vous **complétiez d'abord votre profil de plateforme** avant de créer des comptes Connect.

---

## 🚀 Étapes à Suivre (Dans l'ordre)

### 1️⃣ Ouvrez le Dashboard Stripe

Cliquez sur ce lien : **https://dashboard.stripe.com/settings/connect/platform-profile**

(Ou depuis la page `/wallet`, cliquez sur le nouveau bouton **"Ouvrir Stripe Dashboard"**)

### 2️⃣ Remplissez TOUT le formulaire

- **Nom de la plateforme** : Agora
- **Type de business** : Marketplace / Events
- **Adresse** : Votre adresse complète
- **Informations légales** : Nom de l'entreprise, SIRET, etc.

### 3️⃣ ⚠️ ÉTAPE CRITIQUE : Acceptez les Responsabilités

**Vous DEVEZ cocher ces cases** :

- ✅ Gestion des pertes (Loss management)
- ✅ Protection contre la fraude
- ✅ Litiges et remboursements

**Sans ces cases cochées, Stripe refusera de créer des comptes Connect.**

### 4️⃣ Enregistrez

Cliquez sur **"Save"** ou **"Enregistrer"** en bas du formulaire.

### 5️⃣ Retournez sur Agora

1. Retournez sur votre application (localhost:3000)
2. Allez sur `/wallet`
3. Cliquez maintenant sur **"Configurer Stripe Connect"**
4. ✅ **Ça devrait marcher !**

---

## 📋 Checklist

Avant de cliquer sur "Configurer maintenant" :

- [ ] Profil de plateforme Stripe complété
- [ ] Responsabilités acceptées (TOUTES les cases cochées)
- [ ] Profil enregistré (bouton Save cliqué)
- [ ] `.env.local` contient `STRIPE_SECRET_KEY`
- [ ] `.env.local` contient `STRIPE_CONNECT_CLIENT_ID` (optionnel au début)
- [ ] Serveur Next.js redémarré (`npm run dev`)

---

## 🔍 Comment Savoir si c'est Configuré ?

### ✅ Profil OK

Sur https://dashboard.stripe.com/settings/connect/platform-profile :
- Tous les champs ont des valeurs
- Les coches vertes ✅ apparaissent
- Statut : "Complete" ou "Active"

### ❌ Profil Incomplet

Sur https://dashboard.stripe.com/settings/connect/platform-profile :
- Champs vides
- Pas de coches vertes
- Messages d'erreur en rouge
- Bouton "Complete profile" visible

---

## 🐛 Erreurs Courantes

### Erreur Console : "Please review responsibilities"

```
StripeInvalidRequestError: Please review the responsibilities of managing 
losses for connected accounts at https://dashboard.stripe.com/...
```

**Cause** : Profil de plateforme non complété
**Solution** : Suivre les étapes 1-4 ci-dessus

### Le bouton redirige vers /profile mais rien ne se passe

**Cause** : Profil Stripe incomplet, donc la création automatique échoue
**Solution** : Compléter le profil Stripe (étapes 1-4)

### Erreur : "Client ID missing"

**Cause** : `STRIPE_CONNECT_CLIENT_ID` manquant dans `.env.local`
**Solution** : 
1. Allez sur https://dashboard.stripe.com/settings/applications
2. Copiez le Client ID (commence par `ca_`)
3. Ajoutez dans `.env.local` : `STRIPE_CONNECT_CLIENT_ID=ca_xxxxx`
4. Redémarrez le serveur

---

## 🎯 Résultat Attendu

Après configuration :

```
AVANT
-----
1. Clic sur "Configurer maintenant"
2. Redirection vers /profile
3. ❌ Erreur en console
4. Rien ne se passe

APRÈS
-----
1. Clic sur "Configurer Stripe Connect"
2. Redirection vers /profile
3. ✅ Compte Stripe Connect créé automatiquement
4. Redirection vers Stripe Onboarding
5. Formulaire Stripe (IBAN, identité, etc.)
6. Retour vers Agora
7. ✅ Wallet fonctionnel !
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **STRIPE_PLATFORM_PROFILE_SETUP.md** : Guide complet de configuration
- **FINTECH_WALLET_SYSTEM.md** : Explication du système wallet
- **QUICK_START_AUTO_STRIPE.md** : Guide de démarrage rapide

---

## 💡 Conseil Pro

Une fois le profil configuré, **vous n'aurez plus jamais à le refaire**. Tous les futurs organisateurs auront automatiquement leur compte Stripe Connect créé !

---

## 🆘 Besoin d'Aide ?

Si le problème persiste après avoir suivi toutes ces étapes :

1. Vérifiez les logs du terminal (`npm run dev`)
2. Cherchez les erreurs avec "Stripe" ou "Connect"
3. Vérifiez que votre compte Stripe est bien en mode Test
4. Contactez le support Stripe si nécessaire

---

**Temps total** : 5 minutes
**Niveau de difficulté** : ⭐ Facile (formulaire à remplir)
**Obligatoire** : ✅ OUI
