# Alternative : Utiliser une vidéo HTML5 au lieu d'un GIF

## 🎥 Pourquoi une vidéo plutôt qu'un GIF ?

**Avantages de la vidéo (MP4/WebM) :**
- ✅ **Fichier beaucoup plus léger** (une vidéo de 1 MB = GIF de 10 MB)
- ✅ **Meilleure qualité visuelle** (compression plus efficace)
- ✅ **Chargement plus rapide** de la page
- ✅ **Support des résolutions HD/4K**
- ✅ **Pas de scintillement** comme certains GIFs

## 📝 Instructions pour utiliser une vidéo

### Étape 1 : Préparer votre vidéo

Formats recommandés :
- **MP4 (H.264)** - Compatible avec tous les navigateurs
- **WebM** - Plus léger, bon support moderne
- **OGV** - Fallback pour anciens navigateurs (optionnel)

### Étape 2 : Placer la vidéo

Placez votre fichier vidéo dans ce dossier avec le nom :
- `hero-animation.mp4` (obligatoire)
- `hero-animation.webm` (optionnel, pour encore mieux)

### Étape 3 : Modifier index.html

Remplacez la section hero actuelle par ce code :

```html
<!-- Section hero avec vidéo en arrière-plan -->
<section class="hero hero-video">
    <!-- Vidéo en arrière-plan -->
    <video autoplay muted loop playsinline class="hero-video-bg">
        <source src="images/hero-animation.mp4" type="video/mp4">
        <source src="images/hero-animation.webm" type="video/webm">
        Votre navigateur ne supporte pas la balise vidéo.
    </video>
    
    <!-- Overlay sombre -->
    <div class="hero-overlay"></div>
    
    <!-- Contenu texte -->
    <div class="container">
        <h2>Bienvenue sur Cinetech</h2>
        <p>Découvrez les meilleurs films et séries du moment</p>
    </div>
</section>
```

### Étape 4 : Modifier le CSS (style.css)

Remplacez les styles `.hero` existants par :

```css
/* ===== HERO SECTION AVEC VIDÉO ===== */
.hero-video {
    /* Position relative pour les éléments enfants */
    position: relative;
    
    /* Hauteur minimale */
    min-height: 400px;
    
    /* Flexbox pour centrer le contenu */
    display: flex;
    align-items: center;
    justify-content: center;
    
    /* Centre le texte */
    text-align: center;
    
    /* Cache tout ce qui dépasse */
    overflow: hidden;
}

/* Vidéo en arrière-plan */
.hero-video-bg {
    /* Position absolue pour couvrir toute la section */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    /* Dimensions minimales pour couvrir la zone */
    min-width: 100%;
    min-height: 100%;
    
    /* Dimensions flexibles */
    width: auto;
    height: auto;
    
    /* En arrière-plan (z-index bas) */
    z-index: 0;
    
    /* Couvre toute la zone sans déformation */
    object-fit: cover;
}

/* Overlay sombre sur la vidéo */
.hero-overlay {
    /* Position absolue pour couvrir toute la section */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    /* Overlay noir semi-transparent */
    background-color: rgba(0, 0, 0, 0.5);
    
    /* Au-dessus de la vidéo mais sous le texte */
    z-index: 1;
}

/* Container et texte au-dessus */
.hero-video .container {
    position: relative;
    z-index: 2;
}

/* Titre avec ombre */
.hero-video h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ffffff;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
    font-weight: bold;
}

/* Sous-titre avec ombre */
.hero-video p {
    font-size: 1.3rem;
    color: #ffffff;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
}

/* Responsive : ajuster hauteur sur mobile */
@media (max-width: 768px) {
    .hero-video {
        min-height: 300px;
    }
    
    .hero-video h2 {
        font-size: 2rem;
    }
    
    .hero-video p {
        font-size: 1rem;
    }
}
```

## 🎬 Où trouver ou créer une vidéo

### Sites de vidéos gratuites
- **Pexels Videos** (pexels.com/videos) - Vidéos HD gratuites
- **Pixabay Videos** (pixabay.com/videos) - Libres de droits
- **Coverr** (coverr.co) - Vidéos spéciales pour sites web
- **Videvo** (videvo.net) - Clips vidéo gratuits

### Mots-clés de recherche
- "cinema montage"
- "movie theater"
- "film reel"
- "popcorn cinema"
- "netflix intro"

### Créer votre propre vidéo
1. **Compilez des extraits** de films/séries (attention aux droits !)
2. Utilisez **DaVinci Resolve** (gratuit) ou **Adobe Premiere**
3. Exportez en MP4 (H.264) à 1920x1080px, 30 fps
4. Compressez avec **HandBrake** pour réduire la taille

## ⚙️ Optimiser la vidéo

### Réduire la taille du fichier

Utilisez **HandBrake** (gratuit) :
1. Ouvrez votre vidéo
2. Preset : "Web" ou "Fast 1080p30"
3. Qualité : RF 23-28 (plus le nombre est élevé, plus c'est compressé)
4. Framerate : 30 fps (suffisant pour le web)
5. Dimensions : 1920x1080 ou 1280x720
6. Encoder

### Créer une version WebM (optionnel)

Utilisez **CloudConvert.com** :
1. Uploadez votre MP4
2. Convertissez en WebM
3. Téléchargez les deux versions

## 📊 Comparaison GIF vs Vidéo

| Critère | GIF | Vidéo MP4 | Gagnant |
|---------|-----|-----------|---------|
| Taille fichier | 10-50 MB | 1-5 MB | 🏆 Vidéo |
| Qualité | Moyenne | Excellente | 🏆 Vidéo |
| Compatibilité | Excellente | Très bonne | GIF |
| Performance | Lente | Rapide | 🏆 Vidéo |
| Facilité | Très facile | Facile | GIF |

## ✅ Recommandation finale

**Utilisez une vidéo MP4** si :
- Vous cherchez la meilleure qualité
- Vous voulez un chargement rapide
- Votre animation dure plus de 5 secondes

**Utilisez un GIF** si :
- Vous voulez la solution la plus simple
- Votre animation est courte (< 5 secondes)
- Vous privilégiez la compatibilité maximale

## 🎯 Configuration optimale recommandée

**Format** : MP4 (H.264)
**Résolution** : 1920x1080 (Full HD)
**Framerate** : 30 fps
**Durée** : 10-15 secondes (en boucle)
**Taille fichier** : 2-5 MB
**Bitrate** : 3-5 Mbps

## 🔧 Dépannage

### La vidéo ne se lit pas
- Vérifiez que le fichier est bien nommé `hero-animation.mp4`
- Vérifiez qu'il est dans le dossier `images/`
- Assurez-vous que le format est MP4 (H.264)

### La vidéo est trop lourde
- Utilisez HandBrake pour compresser
- Réduisez la résolution à 1280x720
- Augmentez la compression (RF 26-28)

### La vidéo ne boucle pas
- Vérifiez que l'attribut `loop` est présent dans la balise `<video>`

### La vidéo a du son
- Assurez-vous que l'attribut `muted` est présent
- Les navigateurs bloquent l'autoplay avec son

## 📱 Performance mobile

La vidéo se charge automatiquement sur mobile.
Pour économiser les données mobiles, vous pouvez ajouter un GIF léger comme fallback :

```css
@media (max-width: 768px) {
    .hero-video-bg {
        display: none; /* Cache la vidéo sur mobile */
    }
    
    .hero-video {
        background-image: url('../images/hero-mobile.gif');
        background-size: cover;
        background-position: center;
    }
}
```
