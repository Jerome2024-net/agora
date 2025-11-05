# 🎫 Système de Vérification des Billets - Agora

## Vue d'ensemble

Le système de vérification permet aux **organisateurs** de valider les billets des participants à l'entrée de leurs événements.

## 🔐 Accès

**URL :** `/dashboard`  
**Rôle requis :** Organisateur uniquement

## 📊 Fonctionnalités

### 1. **Statistiques Globales**

Tableau de bord avec :
- 📈 Nombre total d'événements créés
- 👥 Nombre total de participants
- 💰 Revenus totaux générés

### 2. **Scanner de Billets en Temps Réel**

#### Méthodes de validation :
- **Saisie manuelle** : Taper le code du billet
- **Scanner QR USB/Bluetooth** : Se comporte comme un clavier
- **Appuyer sur Entrée** pour valider

#### Feedback immédiat :
- ✅ **Billet valide** : 
  - Message vert avec vibration de succès
  - Son de confirmation
  - Affichage des infos du participant
  
- ❌ **Billet invalide** :
  - Billet introuvable
  - Déjà utilisé (avec date/heure)
  - Annulé
  - Vibration d'erreur

#### Informations affichées :
```
✅ Billet validé avec succès !
Participant : Jean Dupont
Email : jean@example.com
Type : Standard (35€)
```

### 3. **Gestion des Événements**

Pour chaque événement créé :
- **Titre** et localisation
- **Date** de l'événement
- **Jauge** : participants/capacité avec barre de progression
- **Revenus** générés
- **Billets valides** (non utilisés)
- **Billets utilisés** (déjà scannés)

#### Actions disponibles :
- 🔍 **Voir les billets** : Ouvre le modal détaillé

### 4. **Modal de Gestion des Billets**

#### Statistiques en temps réel :
- 📊 Total de billets
- ✅ Billets valides
- 🎫 Billets utilisés
- ❌ Billets annulés

#### Filtrage et recherche :
- 🔍 **Recherche** par nom, email ou code
- 🎯 **Filtres** : Tous / Valides / Utilisés / Annulés
- 📥 **Export CSV** de tous les billets

#### Affichage des billets :
Chaque billet affiche :
- **QR Code visuel** (80x80px)
- **Nom du participant**
- **Email**
- **Type de billet** + Prix
- **ID unique** (format : `timestamp-numéro`)
- **Date d'achat**
- **Statut** : Valide / Utilisé / Annulé
- **Date de validation** (si utilisé)

### 5. **Export des Données**

Format CSV avec colonnes :
```csv
ID Billet, Nom, Email, Type, Prix, Statut, Date Achat, Date Utilisation
1730554876123-1, Jean Dupont, jean@example.com, Standard, 35, valid, 02/11/2025 10:30, 
```

## 🎨 Design et UX

### Codes couleur par statut :
- 🟢 **Valide** : Vert (bg-green-50, border-green-500)
- 🔵 **Utilisé** : Gris/Bleu (bg-gray-50, border-gray-200)
- 🔴 **Annulé** : Rouge (bg-red-50, border-red-500)

### Feedback sensoriel :
- **Vibration haptique** (mobile) :
  - Succès : `[100, 50, 100, 50, 300]` (pattern joyeux)
  - Erreur : `[200, 100, 200]` (pattern d'alerte)
- **Son** : Bip de succès (30% volume)
- **Animation** : Pulse sur les messages de validation

## 🔄 Flux de Vérification

```
1. Organisateur sur /dashboard
   ↓
2. Scanner activé (focus auto sur input)
   ↓
3. Participant présente son QR code
   ↓
4. Scanner lit le code → saisie automatique
   ↓
5. Entrée → Validation
   ↓
6. Feedback immédiat (visuel + son + vibration)
   ↓
7. Statut du billet mis à jour
   ↓
8. Prêt pour le prochain scan
```

## 💡 Cas d'usage

### Scénario 1 : Entrée d'événement
```
Organisateur : Scanner prêt
Participant : Montre QR code sur téléphone
Scanner : Lit le code → 1730554876123-1
Système : ✅ Validé ! Jean Dupont - Standard
Participant : Peut entrer
```

### Scénario 2 : Billet déjà utilisé
```
Participant : Tente d'entrer 2x avec même billet
Système : ⚠️ Déjà utilisé le 02/11/2025 14:30
Organisateur : Refuse l'entrée
```

### Scénario 3 : Vérification manuelle
```
Problème : QR code illisible
Organisateur : Saisie manuelle de l'ID
Participant : Dicte "1730554876123-1"
Système : ✅ Validé !
```

## 🛠️ Technique

### Structure de données

```typescript
Ticket {
  id: string              // Unique ID
  eventId: string         // Événement lié
  userName: string        // Nom du participant
  userEmail: string       // Email
  ticketType: string      // Type de billet
  ticketPrice: number     // Prix payé
  qrCode: string          // URL du QR code
  status: 'valid' | 'used' | 'cancelled'
  purchaseDate: string    // ISO date
  usedDate?: string       // ISO date (si utilisé)
}
```

### Fonction de validation

```typescript
validateTicket(ticketId: string): boolean {
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket && ticket.status === 'valid') {
    ticket.status = 'used';
    ticket.usedDate = new Date().toISOString();
    return true;
  }
  return false;
}
```

### Recherche tous les tickets

```typescript
getTicketsByEventId('all'): Ticket[]  // Tous les tickets
getTicketsByEventId(eventId): Ticket[] // Tickets d'un événement
```

## 📱 Compatibilité

### Scanners recommandés :
- **USB** : Honeywell, Zebra, Symbol
- **Bluetooth** : Tera, Inateck, TaoTronics
- **Mobile** : Tout scanner compatible HID (Human Interface Device)

### Configuration scanner :
1. Mode **HID** (clavier)
2. **Enter** après chaque scan
3. Pas de préfixe/suffixe nécessaire

### Navigateurs supportés :
- ✅ Chrome/Edge (vibration + audio)
- ✅ Firefox (vibration + audio)
- ✅ Safari (audio uniquement)
- ✅ Mobile : Chrome, Safari, Samsung Internet

## 🎯 Bonnes Pratiques

### Pour l'organisateur :
1. **Tester** le scanner avant l'événement
2. **Charger** la page /dashboard en avance
3. **Internet** requis pour la validation
4. **Backup** : Avoir la liste imprimée (export CSV)

### Pour la sécurité :
- Chaque billet ne peut être validé **qu'une seule fois**
- **Date et heure** de validation enregistrées
- **Traçabilité** complète de chaque billet
- **Export** des données pour comptabilité

### Optimisations :
- Focus automatique sur le champ de saisie
- Effacement automatique après validation
- Messages auto-effacés après 5 secondes
- Pas de rechargement de page

## 🚀 Évolutions Futures

Possibilités d'amélioration :
- 📸 Scanner QR avec caméra intégrée (WebRTC)
- 📶 Mode hors-ligne avec synchronisation
- 📊 Statistiques en temps réel par graphiques
- 📧 Notifications aux participants lors de l'entrée
- 🎟️ Impression de billets sur place
- 🔔 Alertes pour capacité atteinte

## 🆘 Dépannage

### Le scanner ne fonctionne pas :
1. Vérifier que le scanner est en mode HID/clavier
2. Tester dans un éditeur de texte (doit écrire)
3. Configurer pour ajouter "Enter" après scan
4. Vérifier les drivers USB/Bluetooth

### Le billet n'est pas reconnu :
1. Vérifier que le code est complet
2. S'assurer qu'il contient le tiret (ex: `123-1`)
3. Pas d'espaces avant/après
4. Code sensible à la casse (mais normalement pas d'impact)

### Erreurs fréquentes :
- "Billet introuvable" → Code incorrect ou système non synchronisé
- "Déjà utilisé" → Tentative de réutilisation
- "Annulé" → Réservation annulée par le participant
