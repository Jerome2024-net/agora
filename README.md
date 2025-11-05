# 🎭 Agora - Plateforme d'Événements

Bienvenue sur **Agora**, la plateforme moderne pour créer, découvrir et réserver des événements en toute simplicité.

## ✨ Fonctionnalités

- 👤 **Système de comptes utilisateurs** : Deux types de comptes (Organisateur et Participant)
- 🔐 **Authentification sécurisée** : Inscription et connexion avec photos de profil
- 🎫 **Créer des événements** : Les organisateurs peuvent créer et gérer des événements
- 🎟️ **Billetterie personnalisée** : Création de plusieurs types de billets avec tarifs différenciés
- � **Paiement en ligne** : Intégration Stripe pour paiements sécurisés par carte bancaire
- 🎉 **Événements gratuits** : Support des événements sans frais
- 🔍 **Découvrir des événements** : Explorez une variété d'événements par catégorie
- 📝 **Réserver facilement** : Système de réservation simple et intuitif
- 📊 **Dashboard organisateur** : Statistiques, scanner de billets, gestion des participants
- 🎫 **Mes Billets** : Les participants peuvent visualiser tous leurs billets avec QR codes
- 📸 **Upload d'images** : Les organisateurs et participants peuvent uploader leurs photos
- 🎨 **Design moderne** : Interface élégante style YouTube avec Tailwind CSS
- 📱 **Responsive** : Fonctionne parfaitement sur tous les appareils
- 🔊 **Feedback multi-sensoriel** : Vibration, son et animations lors des actions
- 🔗 **Partage social** : Facebook, X (Twitter), LinkedIn, WhatsApp, Email
- 👥 **Invitation virale** : Système de referral pour inviter des amis avec liens personnalisés

## 👥 Types d'utilisateurs

### 🎭 Organisateur
- Créer des événements avec images personnalisées
- Créer plusieurs types de billets (VIP, Standard, Étudiant, etc.)
- Définir des tarifs différenciés
- Scanner et valider les billets via QR code
- Dashboard avec statistiques (participants, revenus, billets vendus)
- Voir la liste des participants par événement
- Gérer la capacité et les prix

### 🎫 Participant
- Parcourir les événements avec affichage des types de billets
- Choisir parmi différents types de billets
- Réserver des billets en ligne
- Recevoir les billets par email avec QR codes
- Visualiser tous ses billets dans "Mes Billets"
- Télécharger les QR codes pour l'entrée
- Gérer son profil avec photo

## 🚀 Technologies

- **Next.js 14** - Framework React avec App Router et Server Components
- **TypeScript** - Typage statique pour un code plus robuste
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes modernes et élégantes
- **Stripe** - Plateforme de paiement en ligne sécurisée
- **Context API** - Gestion d'état pour l'authentification
- **QR Code API** - Génération de QR codes pour les billets
- **Web Vibration API** - Feedback haptique sur mobile
- **Web Share API** - Partage natif sur mobile

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:3000 dans votre navigateur
```

## 🎯 Structure du projet

```
agora/
├── src/
│   ├── app/              # Pages Next.js
│   │   ├── page.tsx      # Page d'accueil (style YouTube)
│   │   ├── auth/         # Authentification avec choix de type
│   │   ├── events/       # Détails des événements et réservation
│   │   ├── create/       # Création d'événements avec types de billets
│   │   ├── dashboard/    # Dashboard organisateur avec scanner
│   │   ├── tickets/      # Billets du participant avec QR codes
│   │   ├── profile/      # Profil utilisateur avec photo
│   │   └── api/          # Routes API (envoi d'emails)
│   ├── components/       # Composants réutilisables
│   │   ├── EventCard.tsx # Carte d'événement avec types de billets
│   │   └── NavBar.tsx    # Navigation dynamique selon le type d'utilisateur
│   ├── contexts/         # Contextes React
│   │   └── AuthContext.tsx # Gestion de l'authentification
│   ├── lib/              # Utilitaires et données
│   │   ├── data.ts       # Gestion des événements, réservations, billets
│   │   └── emailService.ts # Service d'envoi d'emails
│   └── types/            # Types TypeScript
│       └── index.ts      # Event, Ticket, TicketType, User, etc.
├── public/               # Fichiers statiques
├── EMAIL_SETUP_GUIDE.md  # Guide de configuration des emails
└── package.json
```

## 🎨 Catégories d'événements

- 🎵 **Musique** - Concerts, festivals
- 🍽️ **Gastronomie** - Ateliers culinaires, dégustations
- 💻 **Technologie** - Conférences, hackathons
- ⚽ **Sport** - Marathons, compétitions
- 🎨 **Art** - Expositions, vernissages
- 📚 **Culture** - Festivals, projections

## 🔐 Utilisation

### Première connexion

1. Cliquez sur "Connexion" dans la barre de navigation
2. Choisissez votre type de compte :
   - **Participant** : Pour réserver des événements
   - **Organisateur** : Pour créer des événements
3. Créez votre compte avec email et mot de passe

### Créer un événement (Organisateur)

1. Connectez-vous en tant qu'organisateur
2. Cliquez sur "Créer" ou "Dashboard" dans la navigation
3. Remplissez les informations de l'événement
4. **Créez vos types de billets** :
   - Standard, VIP, Étudiant, etc.
   - Définissez le prix et la quantité pour chaque type
   - Ajoutez des descriptions (optionnel)
5. Uploadez une image d'illustration
6. Publiez votre événement !

### Réserver un événement (Participant)

1. Connectez-vous en tant que participant
2. Parcourez les événements sur la page d'accueil
3. Filtrez par catégorie ou utilisez la recherche
4. Cliquez sur un événement qui vous intéresse
5. **Choisissez votre type de billet** (si plusieurs disponibles)
6. Indiquez le nombre de billets souhaités
7. **Pour les événements payants** :
   - Cliquez sur "Procéder au paiement sécurisé" 💳
   - Vous serez redirigé vers Stripe Checkout
   - Entrez vos informations de carte
   - Confirmez le paiement
8. **Pour les événements gratuits** :
   - Cliquez sur "Confirmer la réservation gratuite"
   - Vos billets sont créés instantanément
9. Confettis et son de confirmation ! 🎉
10. Retrouvez vos billets dans "Mes Billets"

### Scanner les billets (Organisateur)

1. Allez dans votre Dashboard
2. Utilisez le scanner de billets
3. Entrez le code du billet ou scannez le QR code
4. Validez l'entrée du participant

## 📧 Configuration des Emails

Pour activer l'envoi réel d'emails en production, consultez le guide détaillé :
👉 **[EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)**

**En développement** : Les emails sont simulés et affichés dans la console.

**Options disponibles** :
- SendGrid (Recommandé - 100 emails/jour gratuits)
- Resend (Moderne et simple)
- SMTP (Gmail, Outlook, etc.)
- AWS SES (Pour grande échelle)

## 🌟 Fonctionnalités Principales

### 💰 Modèle de Frais de Service

Agora utilise un modèle transparent de **frais de service additionnels** :

```
┌──────────────────────────────────────────────┐
│  Billet (prix organisateur):     100,00 €    │
│  Frais de service (5%):           +5,00 €    │
│  ─────────────────────────────────────────    │
│  Total participant paie:          105,00 €   │
│                                               │
│  ✅ Organisateur reçoit:          100,00 €   │
│  ✅ Plateforme reçoit:              5,00 €   │
└──────────────────────────────────────────────┘
```

**Avantages :**
- ✅ Organisateurs reçoivent **100% du prix fixé**
- ✅ Transparence totale pour les participants
- ✅ Paiements automatiques via Stripe Connect
- ✅ Pas de frais cachés

---

### ✅ Implémentées
- ✅ Système de billetterie avec types personnalisés
- ✅ **Paiement en ligne par carte bancaire** (Stripe Checkout)
- ✅ **Stripe Connect** - Marketplace avec paiements directs aux organisateurs
- ✅ **Frais de service transparents** (5% additionnels payés par l'acheteur)
- ✅ **Support des événements gratuits**
- ✅ Génération automatique de QR codes
- ✅ Dashboard organisateur complet
- ✅ Scanner de billets
- ✅ Visualisation des billets participant
- ✅ Upload de photos (événements et profils)
- ✅ Authentification avec deux types de comptes
- ✅ Interface style YouTube responsive
- ✅ Recherche et filtres par catégorie
- ✅ Statistiques en temps réel
- ✅ **Feedback multi-sensoriel** (vibration + son + animations)
- ✅ **Partage social** (Facebook, X, LinkedIn, WhatsApp, Email)
- ✅ **Système d'invitation virale** avec liens personnalisés
- ✅ **Page de succès** avec confettis et redirection automatique

### 🚧 Améliorations futures

- [ ] PayPal comme alternative à Stripe
- [ ] Export PDF des billets
- [ ] Système de notation et commentaires
- [ ] Notifications push
- [ ] Carte interactive des événements
- [ ] Export de calendrier (ICS)
- [ ] Filtres avancés par prix, date, localisation
- [ ] Mode sombre
- [ ] Analytics de referral détaillées
- [ ] Programme de récompenses pour les ambassadeurs

## 📝 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Créé avec ❤️ pour la communauté