
# Fonctionnalité : Géolocalisation des Notes

## Description de la fonctionnalité
La fonctionnalité permet de créer des notes avec une portée géographique limitée, basée sur la position de l'auteur.

### Principes clés
1. **Localisation automatique des notes**
   - Utiliser automatiquement la position (vcard:hasGeo) du profil de l'auteur
   - Cette position devient le point central de diffusion de la note

2. **Paramétrage du rayon de diffusion**
   - Ajouter un champ "rayon de diffusion" dans le formulaire de création de note
   - Valeur par défaut : 10 km
   - L'utilisateur peut modifier cette valeur

3. **Visibilité géographique**
   - Une note n'est visible que par les utilisateurs dont la position (vcard:hasGeo) est dans le rayon défini
   - Si un utilisateur est hors du rayon, il ne voit pas la note

4. **Affichage des informations géographiques**
   - Afficher le nom de la commune d'où la note est émise
   - Afficher le rayon de visibilité choisi

## Todo List d'implémentation

## Phase 1 : Préparation et Analyse

### 1.1 Écriture des Features Initiales

Before testing be sur to have the following users with their associated note:
 | username | latitude  | longitude | city      | test'note | radius of test'note |
       | far    | 48.8566  | 2.3522   | Paris     | "This is a geographic note from Paris" | 15km|
      | nearby    | 48.779751 |  -0.377332  | 61210 Sainte-Honorine-la-Guillaume, France| "This is a geographic note from Sainte-Honorine-la-Guillaume" | 15km |
     | test    | 48.812375  | -0.341743   | 61210 La Forêt-Auvray, France| "This is a geographic note from La Forêt-Auvray" | 20km |

```gherkin:frontend/features/geographic_scope.feature
Feature: Creating Geolocated Notes
  As a registred user with a defined location
  I want to create notes with geographic scope
  In order to share locally relevant content

  Background:
    Given I am logged in as "registredUser"
    And I have a location defined in my profile
    And I am on the note creation page

  Scenario: Creating a note with default radius
    When I fill in "Content" with "My local note"
    And I submit the form
    Then I should see "Note sent successfully"
    And I should see my note "My local note" with the name of my city and a default radius at 10 kilometers

  Scenario: Customizing the broadcast radius
    When I fill in "Content" with "Note with custom radius"
    And I set the broadcast radius to 5 kilometers
    And I submit the form
    Then I should see "Note sent successfully"
    And I should see my note "Note with custom radius" with the name of my city and the custom radius``

# this step should be improved
  Scenario: Visibility based on radius
    And I should see "This is a geographic note from Sainte-Honorine-la-Guillaume" from nearby in my feed
    And I should cannot see "This is a geographic note from Sainte-Honorine-la-Guillaume" from far in my feed

```

### 1.3 Implémentation des Steps de Base
- [x] Implémentation des Steps

## Phase 2 : Développement du Backend
<!-- J'ai préféré commencer par le front. Une mauvaise pratique ? -->

### 2.1 Modèle de Données
- [ ] Étendre le modèle Note avec les propriétés géographiques
- [ ] Implémenter la validation des données géographiques

### 2.2 Services
- [ ] Créer le service de géocodage (commune ↔ coordonnées)
- [ ] Créer le service de calcul de distance
- [ ] Implémenter le filtrage géographique des notes

### 2.3 API
- [ ] Étendre les mutations de création/modification de notes
- [ ] Ajouter les filtres géographiques aux requêtes
- [ ] Implémenter la récupération des données de localisation

## Phase 3 : Développement du Frontend

### 3.1 Composants React
<!-- - [ ] Créer le composant de sélection du rayon
- [ ] Modifier le formulaire de création de note -->
<!-- - [ ] Créer les composants d'affichage des informations géographiques -->

### 3.2 Intégration
- [ ] Intégrer les nouveaux champs dans le formulaire
<!-- - [ ] Ajouter l'affichage des informations géographiques -->
- [ ] Implémenter le filtrage côté client

### 3.3 UI/UX
- [ ] Ajouter les indicateurs visuels de portée
- [ ] Implémenter les messages d'erreur
- [ ] Optimiser l'expérience utilisateur

<!-- ## Phase 4 : Tests et Validation

### 4.1 Tests Unitaires
```javascript:frontend/src/__tests__/services/geolocation.test.js
- [ ] Tests des calculs de distance
- [ ] Tests de validation des coordonnées
- [ ] Tests de conversion des formats
```

### 4.2 Tests d'Intégration
```javascript:frontend/src/__tests__/integration/geolocation.test.js
- [ ] Tests du flux complet de création de note
- [ ] Tests du filtrage géographique
- [ ] Tests de performance
```

## Phase 5 : Documentation et Finalisation

### 5.1 Documentation
- [ ] Documenter les nouveaux composants
- [ ] Documenter l'API géographique
- [ ] Mettre à jour la documentation utilisateur

### 5.2 Optimisation
- [ ] Optimiser les requêtes géographiques
- [ ] Mettre en place le caching des données
- [ ] Optimiser les performances mobiles -->
