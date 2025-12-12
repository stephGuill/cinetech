# 🎬 Guide : Ajouter une vidéo de bandes-annonces à la bannière

## ✅ Ce qui a été fait

Le code HTML et CSS est maintenant configuré pour afficher une vidéo en arrière-plan avec :
- ✅ Lecture automatique (`autoplay`)
- ✅ En boucle infinie (`loop`)
- ✅ Sans son (`muted` - obligatoire pour autoplay)
- ✅ Compatible mobile (`playsinline`)
- ✅ Overlay sombre pour lisibilité du texte

## 📋 Ce qu'il vous reste à faire

### Option 1 : Vidéo depuis YouTube (RECOMMANDÉ)

#### Étape 1 : Trouver une vidéo de compilation
Cherchez sur YouTube des vidéos comme :
- "Movie Trailers Compilation"
- "Best Movies Compilation"
- "Cinema Opening Sequence"
- "Film Montage"

**Exemples de recherches :**
- https://www.youtube.com/results?search_query=movie+trailers+compilation
- https://www.youtube.com/results?search_query=cinema+montage
- https://www.youtube.com/results?search_query=best+movies+scenes

#### Étape 2 : Télécharger la vidéo

**Option A : Via un site en ligne (facile)**
1. Copiez l'URL de la vidéo YouTube
2. Allez sur https://y2mate.com ou https://ssyoutube.com
3. Collez l'URL
4. Choisissez la qualité **720p MP4** (équilibre qualité/poids)
5. Téléchargez

**Option B : Via VLC (logiciel gratuit)**
1. Ouvrez VLC Media Player
2. Menu : Média > Ouvrir un flux réseau
3. Collez l'URL YouTube
4. Menu : Outils > Informations sur les codecs
5. Copiez l'URL dans "Emplacement"
6. Téléchargez via cette URL

#### Étape 3 : Optimiser la vidéo

**Pourquoi optimiser ?**
- Les vidéos YouTube sont lourdes (100+ MB)
- Temps de chargement long
- Consommation de bande passante

**Outil recommandé : HandBrake (gratuit)**
1. Téléchargez HandBrake : https://handbrake.fr/
2. Ouvrez votre vidéo
3. **Paramètres recommandés :**
   - **Preset :** "Fast 720p30" ou "Web > Gmail Medium 5 Minutes 720p30"
   - **Format :** MP4
   - **Codec vidéo :** H.264
   - **Framerate :** 30 fps
   - **Qualité :** Constant Quality 22-25
   - **Durée :** 20-30 secondes (extraire un segment court)
4. Démarrez l'encodage
5. **Objectif :** Vidéo finale < 10 MB

**Alternative : Outil en ligne**
- https://www.freeconvert.com/video-compressor
- Uploadez votre vidéo
- Compressez à ~5-10 MB
- Téléchargez

---

### Option 2 : Créer votre propre montage (AVANCÉ)

#### Logiciels gratuits :

**DaVinci Resolve (professionnel, gratuit)**
1. Téléchargez : https://www.blackmagicdesign.com/products/davinciresolve
2. Importez plusieurs extraits de bandes-annonces
3. Créez un montage de 20-30 secondes
4. Exportez en MP4 H.264 720p

**Shotcut (simple et gratuit)**
1. Téléchargez : https://shotcut.org/
2. Importez vos clips
3. Montez et exportez

---

### Option 3 : Vidéos gratuites et libres de droits

#### Sites avec vidéos gratuites :

**Pexels Videos** (RECOMMANDÉ)
- URL : https://www.pexels.com/videos/
- Recherches suggérées :
  - "cinema" : https://www.pexels.com/search/videos/cinema/
  - "movie theater" : https://www.pexels.com/search/videos/movie%20theater/
  - "popcorn" : https://www.pexels.com/search/videos/popcorn/
  - "film reel" : https://www.pexels.com/search/videos/film%20reel/

**Pixabay Videos**
- URL : https://pixabay.com/videos/
- Recherches : "cinema", "movie", "film"

**Videvo**
- URL : https://www.videvo.net/
- Section "Entertainment"

---

## 📁 Installation finale

Une fois votre vidéo prête :

### 1. Renommer le fichier
```
Nom EXACT requis : hero-video.mp4
```

### 2. Placer dans le dossier
```
c:\wamp64\www\cinetech\images\hero-video.mp4
```

### 3. Tester
1. Ouvrez `index.html` dans votre navigateur
2. La vidéo devrait se lancer automatiquement
3. Vérifiez qu'elle boucle correctement

---

## ⚙️ Paramètres techniques recommandés

Pour une vidéo optimale sur le web :

| Paramètre | Valeur recommandée | Pourquoi |
|-----------|-------------------|----------|
| **Format** | MP4 (H.264) | Compatible tous navigateurs |
| **Résolution** | 1280x720 (720p) | Équilibre qualité/poids |
| **Durée** | 20-30 secondes | Boucle fluide |
| **FPS** | 30 fps | Fluidité suffisante |
| **Bitrate** | 2-3 Mbps | Qualité correcte, poids raisonnable |
| **Poids** | 5-10 MB max | Chargement rapide |
| **Audio** | Supprimer | Non utilisé (muted) |

---

## 🎨 Personnalisation CSS (optionnel)

### Ajuster l'overlay sombre

Dans `css/style.css`, ligne ~475 :
```css
.hero::before {
    background-color: rgba(0, 0, 0, 0.6);
    /* Changer 0.6 par :
       - 0.4 : Plus clair (vidéo + visible)
       - 0.7 : Plus sombre (texte + lisible)
    */
}
```

### Assombrir légèrement la vidéo

Dans `css/style.css`, ligne ~445 :
```css
.hero-video {
    filter: brightness(0.7);
    /* Décommenter cette ligne pour assombrir la vidéo
       Valeurs : 0.5 (sombre) à 1.0 (normal)
    */
}
```

### Modifier la hauteur de la bannière

Dans `css/style.css`, ligne ~410 :
```css
.hero {
    min-height: 500px;
    /* Changer selon vos préférences :
       - 400px : Bannière compacte
       - 600px : Bannière imposante
       - 100vh : Plein écran
    */
}
```

---

## 🔧 Dépannage

### La vidéo ne se lance pas automatiquement
- ✅ Vérifiez que l'attribut `muted` est présent
- ✅ Certains navigateurs bloquent autoplay, l'utilisateur doit interagir d'abord

### La vidéo ne boucle pas
- ✅ Vérifiez l'attribut `loop` dans le HTML

### Vidéo déformée ou coupée
- ✅ Vérifiez le CSS `object-fit: cover`
- ✅ Utilisez une vidéo 16:9 (landscape)

### Vidéo trop lourde / chargement lent
- ✅ Re-compressez avec HandBrake
- ✅ Objectif : < 10 MB

### La vidéo ne s'affiche pas sur mobile
- ✅ Vérifiez l'attribut `playsinline`
- ✅ Certains mobiles économisent la data et bloquent les vidéos

---

## 📚 Ressources utiles

- **HandBrake** (compression vidéo) : https://handbrake.fr/
- **Y2Mate** (télécharger YouTube) : https://y2mate.com/
- **Pexels Videos** (vidéos gratuites) : https://www.pexels.com/videos/
- **Pixabay Videos** : https://pixabay.com/videos/
- **Videvo** : https://www.videvo.net/

---

## 💡 Conseils créatifs

**Idées de montages :**
- ✨ Compilation de 5-6 bandes-annonces iconiques
- 🎭 Alternance films / séries
- 🎬 Scènes d'ouverture de films célèbres
- 🍿 Ambiance cinéma (salle, pop-corn, écran)

**Transitions :**
- Utilisez des fondus (dissolve) entre les clips
- Durée par clip : 3-5 secondes
- Évitez les coupures brusques

**Musique :**
- ⚠️ Pas nécessaire (vidéo en `muted`)
- Si vous voulez de la musique, utilisez un son libre de droits
- Attention aux droits d'auteur !

---

## ✅ Checklist finale

- [ ] Vidéo téléchargée et compressée
- [ ] Format : MP4 H.264
- [ ] Poids : < 10 MB
- [ ] Durée : 20-30 secondes
- [ ] Nom : `hero-video.mp4`
- [ ] Placé dans : `c:\wamp64\www\cinetech\images\`
- [ ] Testé dans le navigateur
- [ ] Fonctionne en boucle
- [ ] Texte lisible par-dessus

---

**Bon montage ! 🎬**
