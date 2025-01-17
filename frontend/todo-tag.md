# Spécification : Système de Tags pour les Notes

## 1. Description Générale
Implémentation d'un système de tags pour les notes permettant aux utilisateurs de catégoriser leur contenu avec des tags existants ou d'en créer de nouveaux.

## 2. Stockage des Données

### 2.1 Structure de la Base de Données
```javascript
// Collection : tags (skos:Concept)
{
  type: "skos:Concept",
  "skos:prefLabel": string,     // Nom du tag
  "schema:color": string,       // Couleur associée au tag
}

// Dans les notes
{
  // ... autres champs existants ...
  tag: {
    type: "skos:Concept",
    "skos:prefLabel": string,   // Nom du tag
    "schema:color": string      // Couleur du tag
  }
}
```

### 2.2 Contexte JSON-LD
Le contexte est défini globalement dans core.service.js :
```javascript
{
  "@context": {
    "@vocab": "http://www.w3.org/ns/activitystreams#",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "schema": "http://schema.org/",
    "color": {
      "@id": "schema:color",
      "@type": "http://www.w3.org/2001/XMLSchema#string"
    },
    "prefLabel": {
      "@id": "skos:prefLabel",
      "@type": "http://www.w3.org/2001/XMLSchema#string"
    }
  }
}
```

## Ce qu'il reste à faire

### 1. Gestion des Tags comme Ressources Indépendantes

#### État Actuel
- Les tags sont actuellement créés comme des objets intégrés directement dans les notes
- Exemple de structure actuelle d'un tag dans une note :
```json
"tag": {
  "type": "skos:Concept",
  "schema:color": "#F44336",
  "skos:prefLabel": "monTag"
}
```
- Problèmes :
  - Pas d'identifiant unique (URI) pour les tags
  - Impossibilité de réutiliser les tags existants
  - Recherche et indexation difficiles
  - Duplication des données

#### Objectif
Transformer les tags en ressources indépendantes stockées dans le container `/taxonomy`.

#### Implémentation Requise

1. **Backend (Container Taxonomy)**
   - [x] Service taxonomy configuré sur `/taxonomy`
   - [ ] ...

2. **Frontend (TagSelector)**
   - [ ] Modification du composant pour interroger le container `/taxonomy`
   - [ ] Implémentation de l'autocomplétion avec les tags existants
   - [ ] Création automatique des nouveaux tags dans `/taxonomy`
   - [ ] Récupération des URIs des tags pour les références

3. **Modification du PostBlock**
   - [ ] Adaptation du formatage des tags pour utiliser les URIs
   - [ ] Structure attendue dans la note :
```json
"tag": {
  "type": "skos:Concept",
  "id": "http://localhost:3004/taxonomy/[id-unique]",
  "@context": "http://localhost:3004/.well-known/context.jsonld"
}
```

4. **Fonctionnalités de Recherche**
   - [ ] Création d'index pour les tags


