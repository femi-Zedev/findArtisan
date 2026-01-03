# Guide de Déploiement en Production - FindArtisan

Ce guide détaille toutes les étapes nécessaires pour déployer les récents changements (migration MinIO → Cloudflare R2) en production.

---

## ⚡ Résumé Rapide

### Étapes Essentielles

1. **Cloudflare R2** :
   - ✅ Créer/Configurer le bucket
   - ✅ Activer Public Development URL
   - ✅ Créer R2 API Token
   - ✅ Configurer CORS avec vos domaines de production

2. **Variables d'Environnement Backend** :
   ```bash
   CF_ACCESS_KEY_ID=...
   CF_ACCESS_SECRET=...
   CF_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   CF_REGION=us-east-1
   CF_BUCKET=findartisan
   CF_PUBLIC_ACCESS_URL=https://pub-<hash>.r2.dev
   ```

3. **Variables d'Environnement Frontend** :
   ```bash
   NEXT_PUBLIC_API_URL=https://api.findartisan.com/api
   NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL=https://pub-<hash>.r2.dev
   ```

4. **Déploiement** :
   - Déployer backend avec nouvelles variables
   - Déployer frontend avec nouvelles variables
   - Tester upload et affichage d'images

### ⚠️ Points Critiques

- **CORS** : Doit être configuré sur R2 avec les bons domaines
- **Public Development URL** : Doit être activé pour que CORS fonctionne
- **Variables d'environnement** : Doivent être configurées AVANT le déploiement
- **next.config.ts** : Ne doit pas contenir de fallback hardcodé en production

---

## 📋 Table des Matières

1. [Prérequis](#1-prérequis)
2. [Configuration Cloudflare R2](#2-configuration-cloudflare-r2)
3. [Variables d'Environnement Backend](#3-variables-denvironnement-backend)
4. [Variables d'Environnement Frontend](#4-variables-denvironnement-frontend)
5. [Configuration CORS](#5-configuration-cors)
6. [Configuration Next.js](#6-configuration-nextjs)
7. [Vérifications Pré-Déploiement](#7-vérifications-pré-déploiement)
8. [Étapes de Déploiement](#8-étapes-de-déploiement)
9. [Tests Post-Déploiement](#9-tests-post-déploiement)
10. [Dépannage](#10-dépannage)
11. [Migration des Images Existantes](#12-migration-des-images-existantes-si-applicable)
12. [Checklist Finale](#13-checklist-finale)
13. [Support et Documentation](#14-support-et-documentation)

---

## 1. Prérequis

### 1.1 Comptes et Services Requis

- ✅ **Cloudflare Account** avec R2 activé
- ✅ **Bucket R2** créé (nom: `findartisan` ou votre nom de bucket)
- ✅ **API Token R2** avec permissions de lecture/écriture
- ✅ **Public Development URL** activé sur le bucket R2
- ✅ **Accès SSH** ou accès au serveur de production
- ✅ **Variables d'environnement** configurées sur votre plateforme de déploiement

### 1.2 Informations à Collecter

Avant de commencer, collectez ces informations depuis Cloudflare Dashboard :

1. **Account ID** : Cloudflare Dashboard → Overview → Account ID (en bas à droite)
2. **Bucket Name** : R2 → Votre Bucket → Nom (ex: `findartisan`)
3. **Public Development URL** : R2 → Votre Bucket → Settings → Public Development URL
   - Format: `https://pub-<hash>.r2.dev`
4. **R2 API Token** :
   - Cloudflare Dashboard → R2 → Manage R2 API Tokens
   - Créer un nouveau token avec permissions `Object Read & Write`
   - **Access Key ID** et **Secret Access Key**

---

## 2. Configuration Cloudflare R2

### 2.1 Créer/Configurer le Bucket

1. **Aller dans Cloudflare Dashboard → R2 → Create bucket**
2. **Nom du bucket** : `findartisan` (ou votre nom préféré)
3. **Location** : Choisir la région la plus proche de vos utilisateurs
4. **Créer le bucket**

### 2.2 Activer Public Development URL

**CRITICAL** : Cette étape est obligatoire pour que CORS fonctionne.

1. **Aller dans** : R2 → Votre Bucket → **Settings**
2. **Section "Public Development URL"**
3. **Cliquer sur "Enable"** si ce n'est pas déjà fait
4. **Copier l'URL** générée (format: `https://pub-<hash>.r2.dev`)
   - Cette URL sera utilisée dans `CF_PUBLIC_ACCESS_URL`

### 2.3 Créer R2 API Token

1. **Aller dans** : Cloudflare Dashboard → R2 → **Manage R2 API Tokens**
2. **Cliquer sur "Create API token"**
3. **Configuration** :
   - **Token name** : `findartisan-production` (ou votre nom)
   - **Permissions** : `Object Read & Write`
   - **TTL** : `No expiration` (ou une date lointaine)
   - **Allow List** : Sélectionner votre bucket `findartisan`
4. **Créer le token**
5. **Copier immédiatement** :
   - `Access Key ID`
   - `Secret Access Key`
   - ⚠️ **Ces clés ne seront plus visibles après fermeture de la fenêtre**

---

## 3. Variables d'Environnement Backend

### 3.1 Variables Requises

Ajoutez ces variables dans votre plateforme de déploiement backend (Vercel, Railway, Render, etc.) ou dans votre fichier `.env` sur le serveur :

```bash
# ============================================
# Cloudflare R2 Configuration
# ============================================

# R2 API Credentials (depuis R2 API Token)
CF_ACCESS_KEY_ID=your_access_key_id_here
CF_ACCESS_SECRET=your_secret_access_key_here

# R2 Endpoint (remplacer <ACCOUNT_ID> par votre Account ID)
CF_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# R2 Region (toujours us-east-1 pour compatibilité S3)
CF_REGION=us-east-1

# R2 Bucket Name
CF_BUCKET=findartisan

# R2 Public Development URL (format: https://pub-<hash>.r2.dev)
CF_PUBLIC_ACCESS_URL=https://pub-<hash>.r2.dev
```

### 3.2 Exemple de Configuration

```bash
# Exemple avec des valeurs réelles
CF_ACCESS_KEY_ID=a1b2c3d4e5f6g7h8i9j0
CF_ACCESS_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
CF_ENDPOINT=https://98b63df6e3fd324b71eeb3d8d55a6485.r2.cloudflarestorage.com
CF_REGION=us-east-1
CF_BUCKET=findartisan
CF_PUBLIC_ACCESS_URL=https://pub-e251308ffa3948dbaeec64b5d550d1db.r2.dev
```

### 3.3 Variables à Supprimer (Anciennes MinIO)

Si vous avez encore ces variables, **supprimez-les** :

```bash
# ❌ À SUPPRIMER (anciennes variables MinIO)
MINIO_ENDPOINT=...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
MINIO_BUCKET=...
MINIO_USE_SSL=...
```

---

## 4. Variables d'Environnement Frontend

### 4.1 Variables Requises

Ajoutez ces variables dans votre plateforme de déploiement frontend :

```bash
# ============================================
# API Configuration
# ============================================

# URL de l'API Strapi en production
NEXT_PUBLIC_API_URL=https://api.findartisan.com/api

# ============================================
# Cloudflare R2 Configuration
# ============================================

# R2 Public Development URL (pour Next.js Image optimization)
NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL=https://pub-<hash>.r2.dev
```

### 4.2 Exemple de Configuration

```bash
# Exemple avec des valeurs réelles
NEXT_PUBLIC_API_URL=https://api.findartisan.com/api
NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL=https://pub-e251308ffa3948dbaeec64b5d550d1db.r2.dev
```

### 4.3 Variables Optionnelles

Si vous utilisez NextAuth ou d'autres services :

```bash
# NextAuth Configuration (si applicable)
NEXTAUTH_URL=https://findartisan.com
NEXTAUTH_SECRET=your_secret_here

# Google OAuth (si applicable)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 5. Configuration CORS

### 5.1 Configurer CORS sur Cloudflare R2

**CRITICAL** : Sans cette configuration, les images ne se chargeront pas dans le navigateur.

1. **Aller dans** : Cloudflare Dashboard → R2 → Votre Bucket → **Settings**
2. **Section "CORS Policy"**
3. **Cliquer sur "Add CORS policy"**
4. **Coller cette configuration JSON** :

```json
[
  {
    "AllowedOrigins": [
      "https://findartisan.com",
      "https://www.findartisan.com"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

**Remplacez** `https://findartisan.com` et `https://www.findartisan.com` par vos **vrais domaines de production**.

### 5.2 Configuration pour Développement + Production

Si vous voulez permettre les deux environnements :

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://findartisan.com",
      "https://www.findartisan.com"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 5.3 Vérifier la Configuration CORS

Après avoir sauvegardé, attendez **30 secondes** pour la propagation, puis testez :

```bash
# Tester avec curl
curl -H "Origin: https://findartisan.com" \
  -I "https://pub-<hash>.r2.dev/1/test-image.png"
```

Vous devriez voir dans les headers :
```
Access-Control-Allow-Origin: https://findartisan.com
Access-Control-Allow-Methods: GET, HEAD
```

---

## 6. Configuration Next.js

### 6.1 Mettre à Jour next.config.ts

**✅ DÉJÀ FAIT** : Le fallback hardcodé a été retiré dans la version actuelle.

Le fichier `frontend/next.config.ts` utilise maintenant uniquement la variable d'environnement `NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL`.

**Vérification** : Assurez-vous que votre version de `next.config.ts` ne contient **pas** de fallback hardcodé comme :
```typescript
// ❌ À NE PAS AVOIR EN PRODUCTION
{
  protocol: 'https' as const,
  hostname: 'pub-e251308ffa3948dbaeec64b5d550d1db.r2.dev', // Hardcodé
  pathname: '/**',
}
```

Si vous voyez encore ce fallback, supprimez-le avant le déploiement.

### 6.2 Vérifier la Configuration

Assurez-vous que `NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL` est bien défini avant de build :

```bash
# Dans votre CI/CD ou avant le build
echo $NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL
```

---

## 7. Vérifications Pré-Déploiement

### 7.1 Checklist Backend

- [ ] Toutes les variables d'environnement R2 sont configurées
- [ ] `CF_ENDPOINT` utilise le bon Account ID
- [ ] `CF_BUCKET` correspond au nom du bucket R2
- [ ] `CF_PUBLIC_ACCESS_URL` est l'URL complète du Public Development URL
- [ ] Les anciennes variables MinIO sont supprimées
- [ ] Le package `strapi-provider-cloudflare-r2@^0.3.0` est installé
- [ ] Le package `@avorati/strapi-provider-upload-minio` est supprimé (si présent)

### 7.2 Checklist Frontend

- [ ] `NEXT_PUBLIC_API_URL` pointe vers l'API de production
- [ ] `NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL` est configuré
- [ ] `next.config.ts` ne contient plus de fallback hardcodé
- [ ] Le composant `FallbackImage` n'utilise plus `unoptimized` (déjà fait)

### 7.3 Checklist Cloudflare R2

- [ ] Le bucket R2 est créé
- [ ] Public Development URL est activé
- [ ] CORS policy est configurée avec les bons domaines
- [ ] R2 API Token est créé avec les bonnes permissions
- [ ] Les credentials sont sauvegardés de manière sécurisée

### 7.4 Test Local (Optionnel mais Recommandé)

Avant de déployer en production, testez localement avec les variables de production :

```bash
# Backend
cd backend
# Copier les variables de production dans .env.local
yarn develop

# Frontend (dans un autre terminal)
cd frontend
# Copier les variables de production dans .env.local
yarn dev
```

Testez :
- [ ] Upload d'une image dans Strapi
- [ ] Affichage d'une image sur le frontend
- [ ] Pas d'erreurs CORS dans la console

---

## 8. Étapes de Déploiement

### 8.1 Déploiement Backend (Strapi)

#### Option A : Plateforme de Déploiement (Vercel, Railway, Render, etc.)

1. **Aller dans** votre dashboard de déploiement
2. **Variables d'environnement** → Ajouter toutes les variables R2 (section 3.1)
3. **Déclencher un nouveau déploiement**
4. **Vérifier les logs** pour s'assurer qu'il n'y a pas d'erreurs

#### Option B : Serveur VPS/Dedicated

```bash
# 1. Se connecter au serveur
ssh user@your-server.com

# 2. Aller dans le dossier du projet
cd /path/to/findartisan/backend

# 3. Mettre à jour le code
git pull origin main

# 4. Installer les dépendances
yarn install

# 5. Vérifier les variables d'environnement
cat .env | grep CF_

# 6. Redémarrer Strapi
pm2 restart strapi
# ou
systemctl restart strapi
```

### 8.2 Déploiement Frontend (Next.js)

#### Option A : Vercel (Recommandé pour Next.js)

1. **Aller dans** Vercel Dashboard → Votre Projet
2. **Settings → Environment Variables**
3. **Ajouter** :
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL`
4. **Redeploy** le projet

#### Option B : Autre Plateforme

1. **Configurer les variables d'environnement** (section 4.1)
2. **Déclencher un nouveau build**
3. **Vérifier que le build réussit**

#### Option C : Serveur VPS/Dedicated

```bash
# 1. Se connecter au serveur
ssh user@your-server.com

# 2. Aller dans le dossier du projet
cd /path/to/findartisan/frontend

# 3. Mettre à jour le code
git pull origin main

# 4. Installer les dépendances
yarn install

# 5. Build pour production
yarn build

# 6. Redémarrer Next.js
pm2 restart nextjs
# ou
systemctl restart nextjs
```

---

## 9. Tests Post-Déploiement

### 9.1 Tests Backend

1. **Tester l'upload d'une image** :
   - Aller dans Strapi Admin → Media Library
   - Uploader une image
   - Vérifier que l'image est uploadée dans R2
   - Vérifier que l'URL de l'image utilise `pub-*.r2.dev`

2. **Vérifier les logs** :
   ```bash
   # Si vous avez accès aux logs
   tail -f /var/log/strapi/error.log
   ```

3. **Tester l'API** :
   ```bash
   curl https://api.findartisan.com/api/artisans
   ```

### 9.2 Tests Frontend

1. **Tester l'affichage des images** :
   - Aller sur la page d'accueil
   - Vérifier que les images des artisans s'affichent
   - Ouvrir la console du navigateur (F12)
   - Vérifier qu'il n'y a **pas d'erreurs CORS**

2. **Tester l'upload** (si vous avez un formulaire) :
   - Uploader une nouvelle image
   - Vérifier qu'elle s'affiche correctement

3. **Tester la recherche** :
   - Rechercher un artisan
   - Vérifier que les images s'affichent dans les résultats

### 9.3 Vérification CORS

Ouvrir la console du navigateur et vérifier :

```javascript
// Dans la console du navigateur
fetch('https://pub-<hash>.r2.dev/1/test-image.png', {
  method: 'HEAD',
  headers: {
    'Origin': 'https://findartisan.com'
  }
})
.then(res => {
  console.log('CORS Headers:', res.headers.get('Access-Control-Allow-Origin'));
})
.catch(err => console.error('CORS Error:', err));
```

Vous devriez voir : `CORS Headers: https://findartisan.com`

---

## 10. Dépannage

### 10.1 Erreurs CORS

**Symptôme** : Images ne se chargent pas, erreur CORS dans la console.

**Solutions** :
1. Vérifier que CORS est configuré sur R2 (section 5.1)
2. Vérifier que les domaines dans CORS correspondent exactement (pas de trailing slash)
3. Attendre 30 secondes après modification CORS
4. Vider le cache du navigateur
5. Vérifier que Public Development URL est activé

**Voir** : `backend/CORS_TROUBLESHOOTING.md` pour plus de détails.

### 10.2 Images ne s'affichent pas

**Symptôme** : Images uploadées mais ne s'affichent pas.

**Solutions** :
1. Vérifier que `NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL` est configuré
2. Vérifier que `next.config.ts` contient le bon hostname
3. Vérifier que les URLs d'images utilisent `pub-*.r2.dev` (pas l'endpoint S3)
4. Vérifier les logs Next.js pour des erreurs d'image

### 10.3 Erreurs d'Upload dans Strapi

**Symptôme** : Erreur lors de l'upload d'images dans Strapi.

**Solutions** :
1. Vérifier que toutes les variables R2 sont configurées
2. Vérifier que `CF_ENDPOINT` utilise le bon Account ID
3. Vérifier que `CF_BUCKET` correspond au nom du bucket
4. Vérifier les permissions du R2 API Token
5. Vérifier les logs Strapi pour des erreurs détaillées

### 10.4 Erreurs de Build Next.js

**Symptôme** : Build échoue avec erreur d'image.

**Solutions** :
1. Vérifier que `NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL` est défini
2. Vérifier que `next.config.ts` n'a pas d'erreurs de syntaxe
3. Vérifier que le hostname extrait est valide

### 10.5 Vérifier les Variables d'Environnement

```bash
# Backend (sur le serveur)
cd backend
node -e "console.log(process.env.CF_BUCKET)"
node -e "console.log(process.env.CF_PUBLIC_ACCESS_URL)"

# Frontend (dans le build)
# Les variables NEXT_PUBLIC_* sont injectées au build time
# Vérifier dans Vercel/plateforme de déploiement
```

---

## 11. Rollback (En Cas de Problème)

Si quelque chose ne fonctionne pas, vous pouvez rollback :

### 11.1 Rollback Backend

1. **Revenir à l'ancienne version** du code (avant migration R2)
2. **Restaurer les variables MinIO** (si vous les avez sauvegardées)
3. **Redeploy**

### 11.2 Rollback Frontend

1. **Revenir à l'ancienne version** du code
2. **Redeploy**

**Note** : Les images déjà uploadées dans R2 resteront dans R2, mais ne seront plus accessibles si vous rollback vers MinIO.

---

## 12. Migration des Images Existantes (Si Applicable)

Si vous avez des images existantes sur MinIO ou un autre stockage, vous devrez les migrer vers R2.

### 12.1 Option 1 : Migration Manuelle (Petit Volume)

1. **Télécharger toutes les images** depuis l'ancien stockage
2. **Uploader dans Strapi** → Media Library
3. Les images seront automatiquement uploadées dans R2

### 12.2 Option 2 : Migration Automatique (Grand Volume)

Créez un script de migration :

```javascript
// backend/scripts/migrate-images-to-r2.js
// Script pour migrer les images depuis MinIO vers R2
// À adapter selon votre ancien stockage
```

**Note** : Cette migration peut prendre du temps selon le volume d'images.

### 12.3 Mise à Jour des URLs dans la Base de Données

Après migration, les URLs des images dans Strapi pointeront automatiquement vers R2. Aucune modification manuelle nécessaire si vous utilisez Strapi Media Library.

---

## 13. Checklist Finale

Avant de considérer le déploiement terminé :

- [ ] Backend déployé avec succès
- [ ] Frontend déployé avec succès
- [ ] Toutes les variables d'environnement configurées
- [ ] CORS configuré sur R2
- [ ] Test d'upload d'image réussi
- [ ] Test d'affichage d'image réussi
- [ ] Pas d'erreurs CORS dans la console
- [ ] Les anciennes images (si migration) sont accessibles
- [ ] Performance acceptable (images se chargent rapidement)

---

## 14. Support et Documentation

- **CORS Troubleshooting** : `backend/CORS_TROUBLESHOOTING.md`
- **Backend README** : `backend/README.md`
- **Cloudflare R2 Docs** : https://developers.cloudflare.com/r2/
- **Strapi Upload Provider** : https://www.npmjs.com/package/strapi-provider-cloudflare-r2

---

## 📝 Notes Importantes

1. **Sécurité** : 
   - Ne jamais commiter les credentials R2 dans le code
   - Utiliser des variables d'environnement sécurisées
   - Limiter les permissions du R2 API Token au strict nécessaire

2. **CORS** : 
   - Les changements CORS peuvent prendre jusqu'à 30 secondes pour se propager
   - Toujours tester après modification CORS
   - Utiliser des domaines spécifiques en production (éviter `*`)

3. **Public URL** : 
   - Le Public Development URL est nécessaire pour CORS
   - Vous pouvez aussi configurer un Custom Domain pour une meilleure performance
   - Le Custom Domain nécessite une configuration DNS supplémentaire

4. **Coûts** : 
   - R2 a des limites de bande passante gratuite (10 GB/mois sortie)
   - Vérifiez votre usage régulièrement
   - Configurez des alertes de budget si nécessaire

5. **Backup** : 
   - Assurez-vous d'avoir un backup des images avant migration
   - R2 offre une durabilité élevée, mais un backup supplémentaire est recommandé

6. **Performance** : 
   - Next.js Image Optimization réduit la taille des images automatiquement
   - Les images sont servies via le CDN de Next.js (ou votre CDN)
   - Cela améliore les temps de chargement

7. **Monitoring** : 
   - Surveillez les logs Strapi pour des erreurs d'upload
   - Surveillez les erreurs CORS dans les logs frontend
   - Configurez des alertes pour les erreurs critiques

---

**Dernière mise à jour** : Après migration MinIO → Cloudflare R2
**Version** : 1.0.0
