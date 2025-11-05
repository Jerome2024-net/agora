# 🎯 Guide de l'Organisateur - Agora

## Comment votre photo de profil est utilisée

### ✅ Configuration du profil

1. **Créer un compte Organisateur**
   - Allez sur `/auth`
   - Sélectionnez "Organisateur"
   - Créez votre compte

2. **Ajouter votre photo de profil**
   - Allez sur `/profile`
   - Uploadez votre photo de profil
   - La photo sera automatiquement liée à tous vos événements

### 🎫 Créer un événement

1. **Accéder à la création**
   - Connectez-vous en tant qu'Organisateur
   - Cliquez sur "Créer un événement" dans la navigation
   - Ou allez directement sur `/create`

2. **Votre identité automatique**
   - ✅ Votre nom est **pré-rempli** automatiquement
   - ✅ Votre photo de profil est **automatiquement attachée** à l'événement
   - ✅ Les participants verront votre photo sur la liste des événements et la page de détail

3. **Remplir les informations**
   - Titre de l'événement
   - Description
   - Date et heure
   - Lieu
   - Catégorie
   - Capacité
   - Prix (ou types de billets personnalisés)
   - Image de l'événement

### 📸 Où votre photo apparaît

Votre photo de profil sera visible pour les participants :

1. **Sur la liste des événements** (EventCard)
   - Petite photo ronde (24x24px) à côté de votre nom
   - Visible dans chaque carte d'événement

2. **Sur la page de détail** 
   - Grande photo (48x48px) avec effet ombre
   - Section "Organisateur" bien mise en valeur

3. **Fallback intelligent**
   - Si vous n'avez pas de photo : affichage de votre initiale dans un cercle coloré
   - Message dans le formulaire de création pour vous encourager à ajouter une photo

## 🔄 Flux complet

```
1. Créer compte Organisateur
   ↓
2. Ajouter photo de profil (/profile)
   ↓
3. Créer événement (/create)
   ↓
4. Photo automatiquement liée à l'événement
   ↓
5. Participants voient votre photo sur tous les événements que vous créez
```

## 💡 Conseils

- **Ajoutez une photo professionnelle** pour augmenter la confiance des participants
- **Mettez à jour votre photo** dans `/profile` - elle sera visible sur tous vos événements
- **Votre nom peut être différent** du nom de votre profil (ex: "Association XYZ" au lieu de "Jean Dupont")

## 🛠️ Technique

### Structure de données

```typescript
Event {
  organizer: string,        // Nom affiché
  organizerId: string,      // ID de l'utilisateur
  organizerImage?: string   // Photo de profil de l'utilisateur
}
```

### Fonction d'ajout d'événement

```typescript
import { addEvent } from '@/lib/data';

const newEvent: Event = {
  // ... autres champs
  organizer: user.name,
  organizerId: user.id,
  organizerImage: user.profileImage  // ✅ Photo automatique
};

addEvent(newEvent);
```

## 🎨 Design

- **Format** : Images rondes avec bordure indigo
- **Tailles** : 24px (liste) / 48px (détail)
- **Fallback** : Initiale dans un cercle avec dégradé indigo/violet
- **Style** : Moderne, cohérent avec l'identité visuelle d'Agora
