# Spécification : Système de Tags pour les Notes

## 1. Description Générale
Implémentation d'un système de tags pour les notes permettant aux utilisateurs de catégoriser leur contenu avec des tags existants ou d'en créer de nouveaux.

## 2. Stockage des Données

### 2.1 Structure de la Base de Données
```javascript
// Collection : tags
{
  id: string,
  name: string,
  color: string,        // Couleur associée au tag (optionnel)
  createdAt: DateTime,
  usageCount: number    // Nombre d'utilisations du tag
}

// Dans les notes (structure existante à modifier)
{
  // ... autres champs existants ...
  tags: [
    {
      id: string,      // Référence vers la collection tags
      name: string     // Dénormalisation pour performance
    }
  ]
}
```

## 3. Composants Frontend à Créer/Modifier

### 3.1 Nouveau Composant : TagSelector
- Champ de saisie avec autocomplétion
- Liste déroulante des tags existants
- Option "Créer nouveau tag"
- Affichage des tags sélectionnés avec option de suppression

### 3.2 Nouveau Composant : TagDisplay
- Affichage compact des tags dans les notes
- Style visuel distinctif (pills/badges)
- Gestion des couleurs

### 3.3 Modification du PostBlock
- Intégration du TagSelector
- Mise à jour du formulaire de création de note
- Gestion de la soumission avec tags

### 3.4 Modification de ActivityBlock
- Intégration du TagDisplay
- Adaptation du layout pour inclure les tags

## 4. API Backend à Implémenter

