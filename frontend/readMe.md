# How to test
## Impovement
* How to set data-idtesting in the code
* OU est appeler la commande plawright ? Comment jouer avaec ?  https://playwright.dev/docs/running-tests
recherche de plus d'info pour le débug Debug ide ne fonctionne pas
Par defaut multipage ?
différence pupeteer et playwright

## Architecture
tests/
├── features/
│   ├── auth.feature         # Tests liés à l'authentification
│   ├── dashboard.feature    # Tests du tableau de bord
│   ├── inbox.feature        # Tests de la messagerie
│   ├── navigation.feature   # Tests de navigation générique
├── steps/
│   ├── auth.steps.ts        # Étapes spécifiques à l'authentification
│   ├── dashboard.steps.ts   # Étapes spécifiques au tableau de bord
│   ├── inbox.steps.ts       # Étapes spécifiques à la messagerie
│   ├── common.steps.ts      # Étapes réutilisables communes
├── fixtures/
│   ├── users.json           # Données utilisateur pour les tests
│   ├── config.json          # Configuration spécifique aux environnements
├── support/
│   ├── hooks.ts             # Hooks globaux (avant/après chaque scénario)
│   ├── world.ts             # Contexte partagé entre les étapes
