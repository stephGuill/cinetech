# Instructions pour ajouter le GIF animé Hero

## 📁 Emplacement du fichier
Placez votre fichier GIF dans ce dossier avec le nom : **`hero-animation.gif`**

## 🎬 Caractéristiques recommandées pour le GIF

### Dimensions
- **Largeur recommandée** : 1920px (Full HD) ou 1280px minimum
- **Hauteur recommandée** : 400-600px
- **Ratio** : Format panoramique (16:9 ou 21:9)

### Contenu
- Séquences de films et séries populaires
- Transitions rapides (2-3 secondes par séquence)
- Durée totale : 10-15 secondes (puis boucle)
- Qualité : Bonne résolution mais optimisée pour le web

### Optimisation
- **Taille du fichier** : Idéalement < 5 MB (max 10 MB)
- **Nombre de frames** : 50-100 frames pour fluidité
- **Couleurs** : Optimisées (256 couleurs max pour GIF)

## 🔍 Où trouver ou créer le GIF

### Option 1 : Sites de GIF gratuits
- **Giphy.com** - Chercher "movies montage" ou "cinema scenes"
- **Tenor.com** - GIFs de films populaires
- **Pixabay.com** - GIFs libres de droits

### Option 2 : Créer votre propre GIF
Utilisez des outils comme :
- **Photoshop** - Importez des séquences vidéo et exportez en GIF
- **EZGIF.com** - Outil en ligne pour créer des GIFs à partir de vidéos
- **Canva.com** - Créez des animations avec leur éditeur

### Option 3 : Vidéo à GIF
Si vous avez des extraits vidéo de films/séries :
1. Utilisez **EZGIF.com/video-to-gif**
2. Uploadez votre vidéo (MP4, AVI, etc.)
3. Sélectionnez le segment à convertir
4. Ajustez la taille et le FPS
5. Téléchargez le GIF

## 📝 Instructions d'installation

1. **Téléchargez ou créez** votre GIF d'animation
2. **Renommez** le fichier en `hero-animation.gif`
3. **Placez** le fichier dans ce dossier : `c:\wamp64\www\cinetech\images\`
4. **Rafraîchissez** la page index.html dans votre navigateur
5. **Ajustez** si nécessaire (voir section suivante)

## ⚙️ Personnalisation du CSS

Le fichier `css/style.css` contient les styles de la bannière hero.
Vous pouvez ajuster :

### Hauteur de la bannière
```css
.hero {
    min-height: 400px;  /* Changez 400px selon vos préférences */
}
```

### Opacité de l'overlay sombre
```css
.hero::before {
    background-color: rgba(0, 0, 0, 0.5);  /* 0.5 = 50% d'opacité */
    /* Valeurs recommandées : 0.3 (clair) à 0.7 (sombre) */
}
```

### Effet parallaxe (défilement)
Décommentez cette ligne pour que le GIF reste fixe lors du scroll :
```css
.hero {
    background-attachment: fixed;  /* Retirez le /* */ pour activer */
}
```

### Taille du texte
```css
.hero h2 {
    font-size: 3rem;  /* Ajustez la taille du titre */
}

.hero p {
    font-size: 1.3rem;  /* Ajustez la taille du sous-titre */
}
```

## 🎨 Exemples de recherche pour trouver un GIF

Sur **Giphy** ou **Tenor**, cherchez :
- "movie montage"
- "cinema reel"
- "film strip animation"
- "blockbuster movies"
- "netflix shows"
- "popcorn cinema"

## ⚠️ Notes importantes

- **Droits d'auteur** : Assurez-vous d'utiliser des GIFs libres de droits ou du contenu que vous avez le droit d'utiliser
- **Performance** : Un GIF trop lourd peut ralentir le chargement de la page
- **Responsive** : Le GIF s'adaptera automatiquement aux différentes tailles d'écran grâce à `background-size: cover`

## 🔄 Alternative : Utiliser une vidéo MP4

Si votre GIF est trop lourd, vous pouvez utiliser une vidéo MP4 à la place (plus léger et meilleure qualité).
Voir le fichier `INSTRUCTIONS_VIDEO_ALTERNATIVE.md` pour plus de détails.

## 📧 Besoin d'aide ?

Si le GIF ne s'affiche pas :
1. Vérifiez que le nom du fichier est exactement `hero-animation.gif`
2. Vérifiez que le fichier est bien dans le dossier `images/`
3. Videz le cache de votre navigateur (Ctrl + F5)
4. Vérifiez la console du navigateur (F12) pour les erreurs
