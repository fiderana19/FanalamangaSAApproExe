# AGENTS.md

Ce projet est l'interface (frontend) de l'application d'approvisionnement FANALAMANGA S.A.

## Conventions

Avant toute contribution, lire et respecter :

- **[CONVENTIONS.md](./CONVENTIONS.md)** — conventions de code & architecture issues de
  l'ancien projet `project-ref/ui`, applicables à tout **nouveau** code.

## Règles impératives

- **Ne jamais renommer** les variables, types, hooks, constantes ou pages existants.
- **Ne pas modifier le design** ni le comportement fonctionnel actuels.
- Réutiliser les tokens de style existants (`src/index.css` : `--color-brand`, `.panel`…).
- Pour le nouveau code : imports en `@/...`, hooks `useGetAllX` / `useCreateX` / `usePatchX`,
  interfaces suffixées `Interface`, validations `*.validation.ts`, toasts via `showToast`.
- Les points marqués « à conserver » dans la section Divergences de `CONVENTIONS.md`
  (intercepteur 401/403, `invalidateQueries`, `ROLE_HOME_PATH`, layouts) ne doivent pas
  être rétrogradés.

## Commandes utiles

```bash
npm run dev      # serveur de développement
npm run build    # tsc -b && vite build
npm run lint     # eslint
```
