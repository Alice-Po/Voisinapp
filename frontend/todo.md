# Todo List : Fusion Inbox/Outbox en Home Feed

## 1. Préparation et Analyse
- [x] Identifier tous les fichiers qui font référence à inbox/outbox
  - Components: Inbox.jsx, Outbox.jsx, UnifiedFeed.jsx, PostBlock.jsx
  - Routes: /inbox, /outbox dans App.jsx
  - Tests: notes_steps.js, authentication_steps.js, geographical_steps.js
  - Traductions: en.js, fr.js (my_inbox, my_outbox)
- [x] Lister toutes les routes actuelles
  - / -> HomePage
  - /inbox -> Inbox
  - /outbox -> Outbox
  - /home -> UnifiedFeed (nouvelle route)
- [x] Vérifier les dépendances entre composants
  - PostBlock utilise useOutbox
  - Inbox/Outbox utilisent useCollection
  - UnifiedFeed combine les deux collections
- [x] Faire une sauvegarde du code actuel (branche git)

## 2. Création du nouveau composant Home
- [x] Créer le fichier `frontend/src/pages/MainPage/Home.jsx`
  - Composant créé avec gestion des collections inbox et outbox
  - Utilisation de useCollection pour les deux flux
  - Test ID ajouté: data-testid="unified-feed"
- [x] Implémenter la logique de fusion des feeds
  - Combinaison des activités inbox et outbox
  - Tri par date avec useMemo pour la performance
- [x] Ajouter la gestion des erreurs
  - Gestion des erreurs pour inbox et outbox
  - Affichage des messages d'erreur
  - Logging des erreurs dans la console
- [x] Ajouter les indicateurs de chargement
  - CircularProgress pour le chargement initial
  - État de chargement pour LoadMore
  - Gestion des états de chargement combinés
- [x] Implémenter le tri par date
  - Tri par date de publication (object.published || published)
  - Ordre décroissant (plus récent en premier)
  - Optimisation avec useMemo

## 3. Mise à jour du Routing
- [x] Modifier `routes.js` pour ajouter la nouvelle route home
  - Ajout de la route `/home` dans App.jsx
  - Mise à jour des imports pour inclure le composant Home
- [x] Rediriger '/' vers le nouveau composant
  - Modification de HomePage.jsx pour rediriger vers `/home`
  - Conservation des routes `/inbox` et `/outbox` pour compatibilité
- [x] Mettre à jour la navigation principale
  - Remplacement des onglets inbox/outbox par un onglet feed unifié
  - Mise à jour du SubBar.jsx
- [x] Gérer la rétrocompatibilité temporaire (redirections)
  - Les routes `/inbox` et `/outbox` redirigent vers le composant Home
  - Préservation de la compatibilité avec les liens existants

## 4. Mise à jour de l'UI
- [x] Adapter le composant ActivityBlock pour le nouveau design
  - Ajout de la distinction visuelle entre messages entrants/sortants
  - Implémentation du style de messagerie instantanée
  - Ajout des bulles de messages avec flèches
  - Repositionnement des avatars
- [x] Ajouter des indicateurs visuels pour différencier les messages entrants/sortants
  - Messages sortants en vert (#A7C340) alignés à droite
  - Messages entrants en blanc alignés à gauche
  - Avatars positionnés de manière cohérente
  - Flèches de bulle adaptatives selon la direction
- [x] Mettre à jour les styles pour un affichage unifié
  - Uniformisation des marges et espacements
  - Amélioration de la lisibilité du texte
  - Optimisation de l'affichage des images
  - Gestion cohérente des dates et métadonnées
- [x] Adapter le composant PostBlock pour le nouveau contexte
  - Intégration dans le nouveau design
  - Maintien de la cohérence visuelle
  - Adaptation des boutons d'action

## 5. Mise à jour des Tests
- [ ] Adapter les tests existants

## 6. Nettoyage
- [ ] Déprécier les anciens composants Inbox/Outbox
- [ ] Supprimer les routes obsolètes
- [ ] Nettoyer les imports inutilisés
- [ ] Mettre à jour la documentation

## 7. Tests et Validation
- [ ] Tester toutes les fonctionnalités
- [ ] Vérifier la performance
- [ ] Tester les cas d'erreur
- [ ] Valider sur différents navigateurs

## 8. Documentation
- [ ] Mettre à jour la documentation technique
- [ ] Documenter les nouveaux composants
- [ ] Documenter les changements de breaking changes

## 9. Déploiement
- [ ] Planifier la stratégie de déploiement
- [ ] Préparer les scripts de migration si nécessaire
- [ ] Prévoir une stratégie de rollback
- [ ] Communiquer les changements
