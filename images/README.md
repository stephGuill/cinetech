# 📁 Dossier Images - Cinetech

## 🎯 Objectif

Ce dossier contient les images et animations de votre application Cinetech, notamment le **GIF animé de la bannière hero** sur la page d'accueil.

## 📄 Fichiers Présents

### Documentation
- **README.md** (ce fichier) - Vue d'ensemble
- **INSTRUCTIONS_GIF.md** - Guide complet pour ajouter un GIF
- **INSTRUCTIONS_VIDEO_ALTERNATIVE.md** - Guide pour utiliser une vidéo HTML5
- **GIFS_RECOMMANDES.md** - Liens vers des GIFs gratuits
- **placeholder-info.txt** - Info sur le placeholder

### Images à ajouter
- **hero-animation.gif** ⚠️ **À AJOUTER** - Votre GIF animé pour la bannière

## 🚀 Démarrage Rapide

### Étape 1 : Trouver un GIF
Consultez `GIFS_RECOMMANDES.md` pour des liens directs

### Étape 2 : Télécharger
- Format : GIF
- Dimensions : 1920x1080px (recommandé)
- Taille : < 5 MB (idéal)

### Étape 3 : Placer le fichier
Renommez votre GIF en `hero-animation.gif` et placez-le ici

### Étape 4 : Tester
Ouvrez `index.html` et admirez ! 🎬

## 📚 Guides Disponibles

### Pour les GIFs
👉 Lisez `INSTRUCTIONS_GIF.md`
- Comment trouver des GIFs
- Optimisation
- Personnalisation CSS

### Pour les Vidéos
👉 Lisez `INSTRUCTIONS_VIDEO_ALTERNATIVE.md`
- Pourquoi utiliser une vidéo
- Comment convertir
- Code HTML nécessaire

### Liens Directs
👉 Lisez `GIFS_RECOMMANDES.md`
- Sites de GIFs gratuits
- Mots-clés de recherche
- Outils de conversion

## 🎨 État Actuel

### ✅ Ce qui est déjà fait
- CSS configuré pour afficher le GIF
- Dégradé animé comme fallback (temporaire)
- Overlay sombre pour lisibilité du texte
- Design responsive pour tous les écrans
- Styles optimisés

### ⏳ Ce qu'il reste à faire
- Ajouter votre GIF `hero-animation.gif`
- (Optionnel) Ajuster l'opacité de l'overlay
- (Optionnel) Modifier la hauteur de la bannière

## 💡 Vous n'avez pas encore de GIF ?

**Pas de problème !** 

Un **dégradé animé CSS** s'affiche automatiquement en attendant.
Votre site est déjà beau et fonctionnel ! 🌟

Prenez le temps de trouver ou créer le GIF parfait.

## 🔧 Personnalisation

### Changer la hauteur de la bannière
Fichier : `css/style.css`
Ligne : ~408
```css
.hero {
    min-height: 400px;  /* Modifiez cette valeur */
}
```

### Ajuster l'opacité de l'overlay
Fichier : `css/style.css`
Ligne : ~437
```css
.hero::before {
    background-color: rgba(0, 0, 0, 0.5);  /* 0.5 = 50% */
}
```

## 📱 Responsive

Le GIF s'adapte automatiquement :
- **Desktop** : Pleine résolution, hauteur 400px
- **Tablette** : Adapté, hauteur 300px
- **Mobile** : Adapté, hauteur 300px

## 🌐 Compatibilité

✅ Chrome, Firefox, Safari, Edge, Opera
✅ Windows, Mac, Linux
✅ iOS, Android

## 🎯 Checklist

Avant de considérer la bannière terminée :

- [ ] GIF ajouté et nommé correctement
- [ ] Taille du fichier acceptable (< 10 MB)
- [ ] Animation fluide et agréable
- [ ] Texte lisible sur l'animation
- [ ] Responsive testé (mobile/tablette/desktop)
- [ ] Performance acceptable (chargement rapide)

## 📞 Besoin d'Aide ?

1. **Consultez** les guides dans ce dossier
2. **Testez** le dégradé animé (déjà actif)
3. **Vérifiez** la console du navigateur (F12)
4. **Lisez** `GUIDE_BANNIERE_HERO.md` à la racine

## 🎬 Résultat Final

Une fois votre GIF en place, vous aurez :
- ✨ Une bannière animée impressionnante
- 📱 Un design responsive
- 🚀 De bonnes performances
- 💯 Une expérience utilisateur moderne

---

**Bon courage et amusez-vous bien ! 🎉**
