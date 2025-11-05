# DÉPLOIEMENT GITHUB PAGES - MODE D'EMPLOI

## 📋 Prérequis

Votre projet Agora est maintenant configuré pour être déployé sur GitHub Pages !

## 🚀 Étapes de Déploiement

### 1. Initialiser le repository Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit - Agora platform ready for deployment"
```

### 2. Créer un repository sur GitHub

1. Allez sur https://github.com/new
2. Nommez votre repository `Agora`
3. Ne créez pas de README (vous en avez déjà un)
4. Cliquez sur "Create repository"

### 3. Lier votre projet local au repository GitHub

```bash
git remote add origin https://github.com/VOTRE_USERNAME/Agora.git
git branch -M main
git push -u origin main
```

### 4. Activer GitHub Pages

1. Allez dans **Settings** de votre repository
2. Dans le menu de gauche, cliquez sur **Pages**
3. Dans **Source**, sélectionnez **GitHub Actions**
4. C'est tout ! Le déploiement se fera automatiquement

### 5. Vérifier le déploiement

Après quelques minutes, votre site sera accessible à :
```
https://VOTRE_USERNAME.github.io/Agora/
```

## 📁 Fichiers créés pour le déploiement

### `.github/workflows/deploy.yml`
Workflow GitHub Actions qui :
- Build votre projet Next.js
- Exporte en HTML statique
- Déploie sur GitHub Pages

### `next.config.js` (modifié)
Configuration pour :
- Export statique (`output: 'export'`)
- Images non optimisées (nécessaire pour l'export statique)
- BasePath et assetPrefix pour GitHub Pages

### `package.json` (modifié)
Ajout des scripts :
- `npm run export` - Build et export
- `npm run deploy` - Export avec .nojekyll

## ⚙️ Configuration Next.js

Le projet utilise maintenant :
```javascript
{
  output: 'export',           // Export statique
  images: { unoptimized: true },  // Images non optimisées
  basePath: '/Agora',         // Sous-dossier GitHub Pages
  assetPrefix: '/Agora/'      // Préfixe pour les assets
}
```

## 🔧 Important : Limitations de l'export statique

### ❌ Ne fonctionnent PAS avec l'export statique :
- Routes API (`/api/*`)
- Server-side rendering (SSR)
- Incremental Static Regeneration (ISR)
- Middleware
- Image Optimization

### ✅ Fonctionnent parfaitement :
- Pages statiques
- Client-side rendering
- React hooks
- Composants interactifs
- Styles Tailwind
- Navigation client-side

## 🎯 Solution pour Stripe (À implémenter plus tard)

Pour activer les paiements Stripe en production, vous aurez besoin de :

1. **Backend séparé** (Node.js, Vercel, Netlify Functions, etc.)
2. **Ou** migrer vers un hébergement qui supporte les routes API :
   - Vercel (recommandé pour Next.js)
   - Netlify
   - AWS Amplify

Pour l'instant, le site est déployé en **version démo/vitrine** sans les fonctionnalités de paiement.

## 📝 Prochaines étapes

1. ✅ Déploiement sur GitHub Pages (vitrine)
2. ⏳ Configuration backend pour Stripe
3. ⏳ Déploiement production complet sur Vercel

## 🔄 Redéploiement automatique

À chaque `git push` sur la branche `main`, GitHub Actions :
1. Build le projet
2. Exporte en statique
3. Déploie automatiquement

```bash
# Pour mettre à jour votre site :
git add .
git commit -m "Update site"
git push
```

## 🐛 Dépannage

### Le site ne s'affiche pas ?
- Vérifiez que GitHub Pages est activé (Settings > Pages)
- Attendez 2-5 minutes après le premier déploiement
- Vérifiez les logs dans Actions

### Les images ne s'affichent pas ?
- Vérifiez le chemin (doit inclure `/Agora/`)
- Les images Unsplash externes fonctionnent toujours

### Erreur 404 ?
- Le basePath est configuré sur `/Agora`
- URL correcte : `https://USERNAME.github.io/Agora/`
- Pas : `https://USERNAME.github.io/`

## 📧 Contact

Pour toute question : contact@agora-platform.com

---

🎉 **Bonne chance avec votre déploiement !**
