# 🔗 Système de Partage Social - Agora

## Vue d'ensemble

Le système de partage permet aux utilisateurs de **partager les événements** sur les réseaux sociaux et par d'autres moyens pour augmenter la visibilité.

## 📱 Plateformes Supportées

### Réseaux Sociaux
1. **Facebook** 🔵
   - Partage avec aperçu de l'événement
   - Image, titre et description
   
2. **Twitter (X)** 🐦
   - Tweet avec titre et lien
   - Hashtags automatiques possibles

3. **LinkedIn** 💼
   - Partage professionnel
   - Idéal pour événements d'entreprise

4. **WhatsApp** 💬
   - Partage direct avec contacts
   - Parfait pour événements privés

### Autres Méthodes
5. **Email** 📧
   - Envoi par email avec sujet pré-rempli
   - Inclut titre, description et lien

6. **Copier le lien** 🔗
   - Copie URL dans le presse-papiers
   - Feedback visuel de confirmation

7. **Partage natif** 📤 (Mobile)
   - API Web Share native
   - Menu de partage du système d'exploitation

## 🎨 Emplacement des Boutons

### 1. Page de Détail d'Événement (`/events/[id]`)
- **Position** : En haut à droite, à côté du titre
- **Style** : Bouton indigo "Partager"
- **Visibilité** : Toujours visible

### 2. Cartes d'Événement (Liste)
- **Position** : En bas à droite de la carte
- **Style** : Bouton flottant
- **Visibilité** : Apparaît au survol (`hover`)
- **Interaction** : Ne déclenche pas la navigation

## 🎯 Fonctionnalités

### Menu de Partage Desktop
```
┌─────────────────────────────┐
│  Partager sur              ✕│
├─────────────────────────────┤
│ 🔵  Facebook               │
│ 🐦  Twitter (X)            │
│ 💼  LinkedIn               │
│ 💬  WhatsApp               │
│ 📧  Email                  │
├─────────────────────────────┤
│ 🔗  Copier le lien  ✓      │
└─────────────────────────────┘
```

### Partage Mobile (Web Share API)
- Utilise le menu natif du téléphone
- Accès à toutes les apps installées
- Partage vers SMS, Messenger, etc.
- Détection automatique si disponible

### Feedback Visuel
- **Hover** : Icônes grandissent (scale 1.1)
- **Copie** : Checkmark vert + "Lien copié !"
- **Menu** : Animation smooth d'apparition
- **Couleurs** : Chaque plateforme a sa couleur

## 🛠️ Technique

### Composant ShareButtons

```typescript
interface ShareButtonsProps {
  title: string;        // Titre de l'événement
  description: string;  // Description
  url: string;          // URL relative (ex: /events/1)
  imageUrl?: string;    // Image (future implémentation)
}
```

### URLs de Partage

#### Facebook
```
https://www.facebook.com/sharer/sharer.php?u=URL_ENCODÉE
```

#### Twitter
```
https://twitter.com/intent/tweet?text=TITRE&url=URL
```

#### LinkedIn
```
https://www.linkedin.com/sharing/share-offsite/?url=URL
```

#### WhatsApp
```
https://wa.me/?text=TITRE%20URL
```

#### Email
```
mailto:?subject=TITRE&body=DESCRIPTION%0A%0AURL
```

### Web Share API (Mobile)

```typescript
if (navigator.share) {
  await navigator.share({
    title: 'Titre événement',
    text: 'Description',
    url: 'https://agora.com/events/1'
  });
}
```

### Copie dans le Presse-papiers

```typescript
await navigator.clipboard.writeText(url);
// Affiche confirmation pendant 2 secondes
```

## 🎨 Design

### Couleurs par Plateforme
```css
Facebook:  #1877F2 (bleu)
Twitter:   #1DA1F2 (ciel)
LinkedIn:  #0A66C2 (bleu foncé)
WhatsApp:  #25D366 (vert)
Email:     #6B7280 (gris)
Copie:     #6366F1 (indigo)
```

### États du Bouton
- **Normal** : Indigo 600
- **Hover** : Indigo 700
- **Focus** : Ring indigo
- **Succès** : Vert 500

### Animations
- **Icônes** : Transition scale 0.3s
- **Menu** : Fade in 0.2s
- **Copie** : Pulse + color change

## 📊 Cas d'Usage

### Scénario 1 : Partage sur Facebook (Desktop)
```
1. Utilisateur clique "Partager"
2. Menu s'ouvre avec options
3. Clique sur Facebook
4. Popup Facebook s'ouvre (600x400)
5. Aperçu avec titre + description
6. Partage confirmé
7. Menu se ferme
```

### Scénario 2 : Partage WhatsApp (Mobile)
```
1. Utilisateur clique "Partager"
2. Menu natif s'ouvre
3. Sélectionne WhatsApp
4. App WhatsApp s'ouvre
5. Message pré-rempli avec lien
6. Choisit contact ou groupe
7. Envoie
```

### Scénario 3 : Copie de Lien
```
1. Clique "Copier le lien"
2. URL copiée dans presse-papiers
3. Icône devient ✓ verte
4. Texte "Lien copié !"
5. Après 2s, retour normal
6. Peut coller dans n'importe quelle app
```

### Scénario 4 : Partage depuis Liste
```
1. Survol de la carte d'événement
2. Bouton "Partager" apparaît
3. Clique sur le bouton
4. Event propagation stoppée (pas de navigation)
5. Menu s'ouvre
6. Partage sans quitter la liste
```

## 🔐 Sécurité et Confidentialité

### Encodage des URLs
- Tous les paramètres sont **encodés**
- Protection contre les injections
- URLs valides pour tous les navigateurs

### Aucune Donnée Collectée
- Pas de tracking des partages
- Pas d'analytics de partage
- Respect de la vie privée

### Permissions
- **Clipboard** : Demandée automatiquement
- **Web Share** : Pas de permission requise
- **Popups** : Peuvent être bloquées par le navigateur

## 📱 Compatibilité

### Navigateurs Desktop
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Navigateurs Mobile
- ✅ Chrome Mobile (Web Share)
- ✅ Safari iOS (Web Share)
- ✅ Samsung Internet (Web Share)
- ✅ Firefox Mobile

### Fonctionnalités
- ✅ Facebook : Tous
- ✅ Twitter : Tous
- ✅ LinkedIn : Tous
- ✅ WhatsApp : Tous
- ✅ Email : Tous
- ✅ Clipboard : Chrome 63+, Firefox 53+, Safari 13.1+
- ✅ Web Share : Chrome Mobile 89+, Safari 12.1+

## 💡 Optimisations Futures

### Meta Tags Open Graph
Ajouter dans `layout.tsx` :
```typescript
<meta property="og:title" content={event.title} />
<meta property="og:description" content={event.description} />
<meta property="og:image" content={event.imageUrl} />
<meta property="og:url" content={eventUrl} />
<meta property="og:type" content="event" />
```

### Twitter Cards
```typescript
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={event.title} />
<meta name="twitter:description" content={event.description} />
<meta name="twitter:image" content={event.imageUrl} />
```

### Statistiques de Partage
```typescript
// Track partages
analytics.track('event_shared', {
  eventId: event.id,
  platform: 'facebook',
  timestamp: Date.now()
});
```

### Boutons Additionnels
- 📱 **Telegram** : `https://t.me/share/url?url=${url}&text=${text}`
- 🎵 **TikTok** : Via Web Share API
- 📧 **Messenger** : `fb-messenger://share?link=${url}`
- 📌 **Pinterest** : `https://pinterest.com/pin/create/button/?url=${url}`

## 🎯 Métriques de Succès

### KPIs Potentiels
1. **Taux de partage** : % d'utilisateurs qui partagent
2. **Plateforme préférée** : Quelle plateforme est la plus utilisée
3. **Taux de conversion** : Partages → Réservations
4. **Viralité** : Croissance organique via partages

### A/B Testing
- Position du bouton (top vs bottom)
- Style du bouton (texte vs icône)
- Menu déroulant vs modal
- Récompenses pour partage (gamification)

## 🚀 Utilisation

### Dans le Code

```tsx
import ShareButtons from '@/components/ShareButtons';

<ShareButtons
  title="Concert Jazz au Clair de Lune"
  description="Soirée jazz exceptionnelle..."
  url="/events/1"
  imageUrl="https://..."
/>
```

### Props Requises
- `title` : Titre à partager
- `description` : Description courte
- `url` : URL relative de la page

### Props Optionnelles
- `imageUrl` : Image pour meta tags (future)

## 🎨 Personnalisation

### Modifier les Couleurs
```tsx
// Dans ShareButtons.tsx
bg-blue-600 → bg-votreCouleur
```

### Ajouter une Plateforme
```tsx
const shareLinks = {
  ...shareLinks,
  telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
};
```

### Changer le Style du Menu
```tsx
className="absolute top-full mt-2 right-0"
// Changer en:
className="absolute bottom-full mb-2 left-0"
```

## 📖 Ressources

### Documentation
- [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard)
- [Open Graph](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

### Outils de Test
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

**Le système de partage est maintenant opérationnel ! 🎉**  
Les utilisateurs peuvent partager les événements sur toutes les principales plateformes sociales.
