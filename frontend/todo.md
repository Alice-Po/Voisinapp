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

### 1. Modification du formulaire de création de note
- [ ] Ajouter un champ pour le rayon de diffusion
- [ ] Définir la valeur par défaut (10 km)
- [ ] Récupérer automatiquement les coordonnées de l'utilisateur (vcard:hasGeo)
- [ ] Valider que l'utilisateur a bien une position définie

### 2. Enrichissement du modèle de données
- [ ] Ajouter les champs de géolocalisation au modèle de note
- [ ] Stocker les coordonnées de l'auteur
- [ ] Stocker le rayon de diffusion
- [ ] Stocker le nom de la commune

### 3. Implémentation du filtrage géographique
- [ ] Créer une fonction de calcul de distance entre deux points
- [ ] Implémenter la logique de filtrage basée sur le rayon
- [ ] Optimiser les performances du filtrage
- [ ] Gérer les cas où la position de l'utilisateur est manquante

### 4. Mise à jour de l'interface
- [ ] Afficher le nom de la commune sur chaque note
- [ ] Afficher le rayon de diffusion
- [ ] Ajouter des indicateurs visuels pour la portée géographique
- [ ] Gérer les messages d'erreur (position manquante, etc.)

### 5. Tests
- [ ] Tester le calcul de distance
- [ ] Tester la visibilité des notes selon la position
- [ ] Tester les cas limites (rayon = 0, position manquante, etc.)
- [ ] Tester la performance avec beaucoup de notes

### 6. Documentation
- [ ] Documenter la nouvelle fonctionnalité
- [ ] Mettre à jour les guides utilisateur
- [ ] Documenter les calculs de distance utilisés
- [ ] Documenter les limitations éventuelles
