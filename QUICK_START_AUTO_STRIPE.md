# ⚡ Guide Rapide - Configuration Stripe Connect Automatique

## 🎯 En Bref

Votre plateforme Agora crée maintenant **automatiquement** un compte Stripe Connect pour chaque organisateur dès son inscription. Plus besoin de cliquer sur un bouton !

---

## 🚦 Avant de Commencer

### Vous devez ABSOLUMENT configurer :

1. **Profil de Plateforme Stripe** (2 min)
2. **Client ID Stripe Connect** (1 min)

**Sans cela, le système ne fonctionnera pas !** ⚠️

---

## 📋 Configuration (3 minutes)

### Étape 1 : Activer Stripe Connect

1. Ouvrez votre Dashboard Stripe :
   ```
   https://dashboard.stripe.com/settings/connect/platform-profile
   ```

2. Complétez les informations :
   - ✅ Nom de la plateforme : **"Agora"**
   - ✅ Type d'entreprise : Individual / Company
   - ✅ Adresse de l'entreprise
   - ✅ Description : "Plateforme de gestion d'événements"

3. **Acceptez les responsabilités** de gestion des pertes

4. Sauvegardez ✅

### Étape 2 : Récupérer le Client ID

1. Allez sur :
   ```
   https://dashboard.stripe.com/settings/applications
   ```

2. Copiez le **Client ID** (commence par `ca_`)

3. Collez-le dans `.env.local` :
   ```bash
   STRIPE_CONNECT_CLIENT_ID=ca_VOTRE_CLIENT_ID_ICI
   ```

### Étape 3 : Vérifier les Variables d'Environnement

Ouvrez `.env.local` et vérifiez que vous avez :

```bash
# Clés Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx

# Client ID Connect (CRITIQUE !)
STRIPE_CONNECT_CLIENT_ID=ca_xxxxx  # 👈 Remplacer par votre vrai ID

# Webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# URL de base
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Étape 4 : Redémarrer le Serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

---

## ✅ Test du Système

### Test Complet (5 minutes)

1. **Ouvrez votre navigateur** :
   ```
   http://localhost:3000/auth
   ```

2. **Créez un compte organisateur** :
   - Type : **Organisateur** 🎭
   - Nom : Test User
   - Email : test@example.com
   - Mot de passe : 12345678

3. **Cliquez sur "S'inscrire"**

4. **Observez la console du navigateur (F12)** :
   ```
   🔄 Création automatique du compte Stripe Connect...
   ✅ Compte Stripe Connect créé automatiquement: acct_xxxxx
   ```

5. **Vous êtes redirigé vers `/profile`**

6. **Redirection automatique vers Stripe** (2-3 secondes) :
   ```
   🔄 Redirection automatique vers onboarding Stripe...
   ```

7. **Le formulaire Stripe s'ouvre automatiquement** ✅

8. **Remplissez le formulaire Stripe** (mode test) :
   - IBAN : `FR14 2004 1010 0505 0001 3M02 606`
   - Nom : Test User
   - Date de naissance : 01/01/1990

9. **Soumettez le formulaire**

10. **Retour sur Agora** :
    - Badge vert : **"✅ Actif"**
    - Message de succès affiché
    - Section Wallet visible
    - Prêt à créer des événements ! 🎉

---

## 🔍 Vérifications

### ✅ Checklist de Fonctionnement

Cochez chaque élément après test :

- [ ] Profil de plateforme Stripe complété
- [ ] Client ID ajouté dans `.env.local`
- [ ] Serveur redémarré avec nouvelles variables
- [ ] Inscription organisateur → Compte Stripe créé (console log)
- [ ] Redirection automatique vers Stripe onboarding
- [ ] Formulaire Stripe affiché
- [ ] Retour sur `/profile?stripe_success=true`
- [ ] Badge "Actif" affiché
- [ ] Wallet visible dans le profil
- [ ] Aucune erreur dans la console

### 🐛 Si Quelque Chose Ne Marche Pas

#### Erreur : "Neither apiKey nor config.authenticator provided"
**Solution** :
```bash
# Vérifiez que STRIPE_SECRET_KEY est défini
cat .env.local | grep STRIPE_SECRET_KEY
```

#### Erreur : "Please review the responsibilities of managing losses"
**Solution** :
1. Allez sur https://dashboard.stripe.com/settings/connect/platform-profile
2. Complétez TOUTES les informations
3. Acceptez les responsabilités

#### La redirection automatique ne fonctionne pas
**Solution** :
```bash
# Vérifiez la console du navigateur (F12)
# Vous devriez voir :
# 🔄 Création automatique du compte Stripe Connect...
# ✅ Compte Stripe Connect créé automatiquement: acct_xxxxx
# 🔄 Redirection automatique vers onboarding Stripe...

# Si vous ne voyez rien, vérifiez que :
1. Le Client ID est dans .env.local
2. Le serveur a été redémarré
3. Vous créez un compte "Organisateur" (pas Participant)
```

#### Client ID invalide
**Solution** :
```bash
# Le Client ID doit commencer par ca_
# CORRECT : ca_Nxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# INCORRECT : votre_client_id_connect
```

---

## 🎯 Résultat Final

### Ce qui se passe maintenant :

```
Organisateur s'inscrit
    ↓ (0 secondes)
Compte Stripe créé automatiquement
    ↓ (2 secondes)
Redirection vers /profile
    ↓ (1 seconde)
Redirection vers Stripe onboarding
    ↓ (4 minutes - utilisateur remplit)
Formulaire Stripe complété
    ↓ (0 secondes)
Retour sur Agora → Compte actif ✅
```

**Total : ~5 minutes, 1 seule action (remplir formulaire Stripe)**

### Ce que l'organisateur voit :

1. ✅ S'inscrit sur Agora (1 min)
2. ✅ Automatiquement redirigé vers Stripe (transparent)
3. ✅ Remplit le formulaire Stripe (4 min)
4. ✅ Retour sur Agora → Prêt à créer des événements !

**Aucun bouton à cliquer. Aucune configuration manuelle. Tout est automatique !** 🎉

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `STRIPE_AUTO_SETUP.md` - Guide technique complet
- `CHANGELOG_AUTO_STRIPE.md` - Liste de tous les changements
- `STRIPE_CONNECT_SETUP.md` - Configuration Stripe Connect

---

## 🆘 Support

### Si vous êtes bloqué :

1. **Vérifiez les logs de la console** (F12 dans le navigateur)
2. **Vérifiez les logs du terminal** (serveur Next.js)
3. **Consultez le Dashboard Stripe** : https://dashboard.stripe.com/logs

### Problèmes courants :

| Symptôme | Solution |
|----------|----------|
| Pas de redirection vers Stripe | Vérifier Client ID + redémarrer serveur |
| Erreur 400 Stripe API | Compléter profil de plateforme |
| Compte créé mais pas actif | L'organisateur doit terminer l'onboarding |
| Badge reste "En attente" | Attendre 1-2 min ou rafraîchir la page |

---

## 🎉 Félicitations !

Votre système de configuration automatique Stripe Connect est maintenant opérationnel ! 

**Les organisateurs peuvent s'inscrire et commencer à recevoir des paiements en moins de 5 minutes.** ⚡

---

**Version** : 2.0.0  
**Mise à jour** : Novembre 2025  
**Temps de setup** : 3 minutes  
**Temps de test** : 5 minutes  
**Total** : **8 minutes pour un système complet** ✅
