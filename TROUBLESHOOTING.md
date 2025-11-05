# 🔧 Résolution des problèmes de déploiement GitHub Pages

## ✅ Problème résolu : Build Next.js échoue sur GitHub Actions

### Symptôme
- ❌ Le workflow "Deploy to GitHub Pages" échoue à l'étape "Build with Next.js"
- ✅ Le build local fonctionne parfaitement (`npm run build`)

### Cause
Le fichier `.env.local` existe en local mais pas sur GitHub (car il est dans `.gitignore`). GitHub Actions n'a donc pas les variables d'environnement nécessaires.

### Solution
Créer un fichier `.env.local` temporaire dans le workflow avec les variables nécessaires :

```yaml
- name: Create .env.local for build
  run: echo "NEXT_PUBLIC_BASE_URL=https://jerome2024-net.github.io/agora" > .env.local
```

### Fichiers modifiés
1. `.github/workflows/deploy.yml` - Ajout de l'étape de création .env.local
2. `.env.example` - Fichier d'exemple pour documentation

---

## 🔍 Autres problèmes potentiels

### 1. Erreur : "Page /events/[id] is missing generateStaticParams()"

**Symptôme** :
```
Error: Page "/events/[id]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.
```

**Solution** : ✅ Déjà corrigé
- Suppression du dossier `src/app/events/[id]`
- Les routes dynamiques ne sont pas supportées avec `output: 'export'`

### 2. Erreur : "useSearchParams() should be wrapped in a suspense boundary"

**Symptôme** :
```
⨯ useSearchParams() should be wrapped in a suspense boundary at page "/".
```

**Solution** : ✅ Déjà corrigé
- Création de `src/components/SearchParamsProvider.tsx`
- Wrapping avec `<Suspense>` dans les pages concernées :
  - `src/app/page.tsx`
  - `src/app/payment/cancel/page.tsx`
  - `src/app/profile/page.tsx`

### 3. Erreur : basePath case sensitivity

**Symptôme** :
- Le site affiche une erreur 404
- Le workflow réussit mais le site ne s'affiche pas

**Solution** : ✅ Déjà corrigé
- `next.config.js` : `basePath: '/agora'` (minuscules)
- Correspondance avec le nom du repository : `agora` (minuscules)

### 4. Erreur : Jekyll traite les fichiers

**Symptôme** :
- Les fichiers commençant par `_` ne sont pas servis
- Le CSS/JS ne se charge pas correctement

**Solution** : ✅ Déjà corrigé
- Ajout de `.nojekyll` à la racine
- Ajout automatique dans le workflow

### 5. Erreur : GitHub Pages non activé

**Symptôme** :
- Le workflow réussit mais le site ne se déploie pas
- URL retourne 404

**Solution** :
1. Aller sur https://github.com/Jerome2024-net/agora/settings/pages
2. Sous "Source", sélectionner **"GitHub Actions"**
3. Sauvegarder

### 6. Erreur : Cache npm corrompu

**Symptôme** :
- Erreurs d'installation de dépendances
- Build échoue avec des erreurs étranges

**Solution** : ✅ Déjà corrigé
- Cache npm désactivé dans le workflow
- Utilisation de `npm ci` (clean install)

---

## ✅ Checklist de vérification

Avant de pusher vers GitHub, vérifier :

- [ ] Le build local fonctionne : `npm run build`
- [ ] Le dossier `out` est créé avec le contenu
- [ ] `next.config.js` a `output: 'export'`
- [ ] `basePath` correspond au nom du repository (minuscules)
- [ ] `.nojekyll` existe à la racine
- [ ] Aucune route dynamique (`[id]`) dans `src/app`
- [ ] `useSearchParams()` est wrappé dans `<Suspense>`
- [ ] `.env.local` est créé dans le workflow

Après le push :

- [ ] GitHub Pages activé avec source "GitHub Actions"
- [ ] Workflow "Deploy to GitHub Pages" réussit (✅)
- [ ] Site accessible sur https://jerome2024-net.github.io/agora/

---

## 🚀 Commandes utiles

### Build local
```bash
# Clean build
Remove-Item -Recurse -Force .next, out
npm run build

# Vérifier le dossier out
dir out
```

### Git
```bash
# Status
git status

# Voir les commits récents
git log --oneline -5

# Forcer un rebuild
git commit --allow-empty -m "Trigger rebuild"
git push
```

### Debugging
```bash
# Tester localement le site statique
npx serve out

# Ouvrir dans le navigateur
http://localhost:3000
```

---

## 📞 Ressources

- **Repository** : https://github.com/Jerome2024-net/agora
- **Actions** : https://github.com/Jerome2024-net/agora/actions
- **Settings Pages** : https://github.com/Jerome2024-net/agora/settings/pages
- **Site** : https://jerome2024-net.github.io/agora/

- **Next.js Static Export** : https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- **GitHub Pages** : https://docs.github.com/pages
- **GitHub Actions** : https://docs.github.com/actions

---

## 🎯 État actuel

✅ Tous les problèmes sont résolus !

Le site devrait maintenant se déployer correctement à chaque push sur la branche `main`.

**Dernière mise à jour** : 5 novembre 2025, 18:00
