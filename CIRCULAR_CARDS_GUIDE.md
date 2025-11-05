# 🔵 EventCard Circulaires - Vue Map

## ✨ Nouveau Design

Les **EventCard** prennent maintenant une **forme circulaire** dans la vue MAP pour correspondre au style carte interactive !

---

## 🎨 Structure de la Carte Circulaire

### 1. Cercle Principal (128x128px)
```tsx
<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
```

**Éléments** :
- **Image** : Photo de l'événement (cover, zoom au hover)
- **Overlay gradient** : Dégradé noir en bas (pour contraste texte)
- **Bordure blanche** : 4px pour faire ressortir le cercle
- **Ombre portée** : shadow-2xl pour effet profondeur

### 2. Badge Catégorie (Top Right)
Position : `absolute top-2 right-2`

```tsx
<div className="bg-white/90 backdrop-blur-sm rounded-full w-8 h-8">
  <span className="text-lg">{emoji}</span>
</div>
```

**Icônes par catégorie** :
- 🎵 Musique
- 🍽️ Gastronomie
- 💻 Technologie
- ⚽ Sport
- 🎨 Art
- 📚 Culture
- 🎯 Autres

### 3. Prix (Bottom)
Position : `absolute bottom-0`

```tsx
<div className="bg-gradient-to-t from-black/90 to-transparent p-2">
  <p className="text-white font-bold text-sm">{prix}</p>
</div>
```

**Formats de prix** :
- "Gratuit" (prix = 0)
- "25€" (prix unique)
- "20€ - 75€" (plusieurs tarifs)

---

## 🏷️ Badges Informatifs

### Badge Titre
```tsx
<div className="mt-2 bg-white rounded-full px-4 py-2 shadow-lg border-2 border-indigo-200">
  <h3 className="text-sm font-bold truncate">{titre}</h3>
</div>
```
- Largeur max : 200px
- Texte tronqué si trop long
- Hover : texte devient indigo

### Badge Date
```tsx
<div className="mt-1 bg-indigo-50 rounded-full px-3 py-1">
  <p className="text-xs text-indigo-600">
    <Calendar /> 15 nov
  </p>
</div>
```
- Format court : "15 nov"
- Icône calendrier
- Couleur indigo

### Badge Localisation
```tsx
<div className="mt-1 bg-purple-50 rounded-full px-3 py-1">
  <p className="text-xs text-purple-600">
    <MapPin /> Paris
  </p>
</div>
```
- Première partie de la localisation uniquement
- Exemple : "Théâtre Municipal, Paris" → "Théâtre Municipal"
- Icône pin
- Couleur purple

### Badge Places
```tsx
<div className={`px-3 py-1 rounded-full text-xs font-bold ${
  availableSpots === 0 ? 'bg-red-100 text-red-600' :
  availableSpots < 10 ? 'bg-orange-100 text-orange-600' :
  'bg-green-100 text-green-600'
}`}>
  {availableSpots > 0 ? `${availableSpots} places` : 'Complet'}
</div>
```

**Couleurs selon disponibilité** :
- 🟢 **Vert** : ≥ 10 places
- 🟠 **Orange** : 1-9 places (presque complet)
- 🔴 **Rouge** : 0 places (complet)

---

## 🎭 Animations & Interactions

### Hover sur Cercle
```css
group-hover:scale-110 transition-transform duration-300
```
- Cercle grossit de 10%
- Transition smooth 300ms

### Hover sur Image
```css
group-hover:scale-110 transition-transform duration-500
```
- Image zoome de 10%
- Transition plus lente (500ms) pour effet parallaxe

### Hover sur Titre
```css
group-hover:text-indigo-600 transition-colors
```
- Texte devient indigo
- Indication de cliquabilité

---

## 📐 Layout dans la Vue Map

### Grid Responsive
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
```

**Breakpoints** :
- **Mobile** (< 640px) : 2 colonnes
- **Small** (640px+) : 3 colonnes
- **Medium** (768px+) : 4 colonnes
- **Large** (1024px+) : 5 colonnes
- **XL** (1280px+) : 6 colonnes

**Espacement** : 32px (gap-8) entre les cartes

### Centrage
```tsx
<div className="flex justify-center">
  <EventCard event={event} viewMode="map" />
</div>
```
Chaque carte est centrée dans sa cellule de grille

---

## 🎨 Palette de Couleurs

| Élément | Couleur | Classe |
|---------|---------|--------|
| Bordure cercle | Blanc | `border-white` |
| Badge titre fond | Blanc | `bg-white` |
| Badge titre bordure | Indigo | `border-indigo-200` |
| Badge date fond | Indigo clair | `bg-indigo-50` |
| Badge date texte | Indigo | `text-indigo-600` |
| Badge localisation fond | Purple clair | `bg-purple-50` |
| Badge localisation texte | Purple | `text-purple-600` |
| Places - Vert | Vert clair | `bg-green-100 text-green-600` |
| Places - Orange | Orange clair | `bg-orange-100 text-orange-600` |
| Places - Rouge | Rouge clair | `bg-red-100 text-red-600` |

---

## 📏 Dimensions

### Cercle Principal
- Diamètre : **128px** (w-32 h-32)
- Bordure : **4px** blanche
- Diamètre total : **136px**

### Badges
- **Titre** : max-width 200px
- **Date** : max-width 180px
- **Localisation** : max-width 180px
- **Places** : width auto (contenu)

### Espacement Vertical
```
Cercle (128px)
  ↓ 8px (mt-2)
Badge Titre
  ↓ 4px (mt-1)
Badge Date
  ↓ 4px (mt-1)
Badge Localisation
  ↓ 4px (mt-1)
Badge Places
```

**Hauteur totale approximative** : ~210px

---

## 🔧 Code Principal

### Fonction getCategoryIcon()
```typescript
const getCategoryIcon = () => {
  switch(event.category) {
    case 'Musique': return '🎵';
    case 'Gastronomie': return '🍽️';
    case 'Technologie': return '💻';
    case 'Sport': return '⚽';
    case 'Art': return '🎨';
    case 'Culture': return '📚';
    default: return '🎯';
  }
};
```

### Extraction Ville
```typescript
{event.location.split(',')[0]}
```
Prend seulement la première partie avant la virgule

---

## 🎯 Avantages du Design Circulaire

### UX
✅ **Cohérent** avec le thème carte/map
✅ **Compact** : Plus d'événements visibles
✅ **Hiérarchie claire** : Image → Titre → Infos
✅ **Scan rapide** : Informations essentielles visibles

### UI
✅ **Esthétique** : Forme élégante et moderne
✅ **Harmonieux** : S'intègre au fond de carte
✅ **Ludique** : Rappelle les pins/marqueurs
✅ **Professionnel** : Design soigné

### Performance
✅ **Léger** : Pas de JS complexe
✅ **CSS pur** : Animations GPU
✅ **Rapide** : Render instantané
✅ **Responsive** : S'adapte à tous écrans

---

## 📱 Responsive

### Mobile (< 640px)
- 2 colonnes de cartes
- Largeur ~150px par carte
- Badges réduits si besoin
- Texte tronqué

### Tablet (640px - 1024px)
- 3-4 colonnes
- Espacement confortable
- Tous les badges visibles

### Desktop (> 1024px)
- 5-6 colonnes
- Mise en page aérée
- Hover effects pleinement visibles

---

## 🚀 Utilisation

### Activation
1. Aller sur la page d'accueil
2. Cliquer sur l'icône 🗺️ (Map)
3. Les cartes circulaires s'affichent automatiquement

### Navigation
- Cliquer sur n'importe quel élément de la carte (cercle, badge)
- Redirection vers `/events/{id}`

---

## 🔄 Comparaison des Modes

| Aspect | Grid | List | **Map (Circulaire)** |
|--------|------|------|----------------------|
| Forme | Rectangle | Rectangle | **Cercle** |
| Image | Rectangulaire | Rectangulaire | **Circulaire** |
| Layout | Vertical | Horizontal | **Vertical compact** |
| Infos | Complètes | Complètes | **Essentielles** |
| Badges | Rectangulaires | Rectangulaires | **Circulaires** |
| Hauteur | ~400px | ~200px | **~210px** |
| Par ligne | 4 max | 1 | **6 max** |
| Hover | Scale + shadow | Shadow | **Scale cercle + zoom image** |

---

## 💡 Améliorations Futures Possibles

### Animations
- [ ] **Apparition séquentielle** : Cartes apparaissent une par une
- [ ] **Rotation légère** au hover
- [ ] **Pulse** sur badge places (si < 10)
- [ ] **Flip** : Retourner la carte pour voir description complète

### Interactions
- [ ] **Click badge catégorie** : Filtrer par catégorie
- [ ] **Click badge localisation** : Filtrer par ville
- [ ] **Drag & drop** : Réorganiser les cartes
- [ ] **Favoris** : Cœur dans le coin

### Affichage
- [ ] **Cluster** : Regrouper événements similaires
- [ ] **Connexions** : Lignes entre événements liés
- [ ] **3D tilt** : Effet de profondeur au hover
- [ ] **Variantes couleur** : Selon catégorie

---

## 🎨 Exemple de Rendu

```
    ┌─────────────┐
    │   🎵        │  ← Badge catégorie
    │             │
    │   IMAGE     │  ← Photo circulaire
    │             │
    │   25€       │  ← Prix en bas
    └─────────────┘
         (─)         ← Badge titre blanc
         [□]         ← Badge date indigo
         [□]         ← Badge localisation purple
         [◯]         ← Badge places (coloré)
```

---

## ✅ Checklist de Qualité

- [x] Image circulaire avec bordure blanche
- [x] Badge catégorie avec emoji
- [x] Prix visible en bas du cercle
- [x] Titre dans badge arrondi
- [x] Date avec icône calendrier
- [x] Localisation avec icône pin
- [x] Places avec code couleur
- [x] Hover scale sur cercle
- [x] Hover zoom sur image
- [x] Hover color sur titre
- [x] Layout responsive (2-6 colonnes)
- [x] Truncate sur textes longs
- [x] Ombres pour profondeur
- [x] Transitions smooth
- [x] Link vers détails événement

---

**Version** : 1.0  
**Date** : Novembre 2025  
**Status** : ✅ Production Ready  
**Style** : Map-style circulaire moderne
