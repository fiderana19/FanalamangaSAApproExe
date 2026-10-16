# Conventions de code & architecture — UI

Référentiel extrait de l'ancien projet `project-ref/ui`.

> **Portée.** Ce document décrit les conventions à suivre pour **tout nouveau code** de
> `fanalamangasaprocurementui`. Il ne demande **aucun renommage** des variables, types,
> hooks ou pages existants, et ne modifie ni le fonctionnement ni le design actuels.
> La section « Divergences » est purement informative.

---

## 1. Stack technique

- React 19 + Vite 6 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`, configuration en CSS `@theme`)
- shadcn/ui (Radix UI) pour les primitives d'interface
- TanStack Query 5 (`@tanstack/react-query`) pour le data-fetching
- react-hook-form + `@hookform/resolvers` + yup pour les formulaires
- react-toastify pour les notifications
- antd (icônes principalement) et `@ant-design/icons`
- `@react-pdf/renderer` pour les exports PDF
- `react-apexcharts` / `apexcharts` pour les graphiques
- react-router-dom 7

---

## 2. Alias & imports

- L'alias `@` pointe vers `src` (défini dans `vite.config.ts` et `tsconfig`).
- **Nouveau code : toujours utiliser `@/...`** (pas d'imports relatifs remontants `../../`).

```ts
import { showToast } from "@/utils/Toast";
import { QueryCacheKey } from "@/api/QueryCacheKey";
import { TOAST_TYPE } from "@/constants/ToastType";
```

---

## 3. Arborescence cible

```
src/
├─ api/            # 1 fichier par domaine + Config.ts + QueryCacheKey.ts
├─ components/     # composants par fonction (Dashboard, Navigation, status, ui)
├─ constants/      # constantes globales (statuts, http, toast, etc.)
├─ context/        # AuthContext
├─ hooks/          # 1 fichier = 1 appel API
├─ interfaces/     # types/interfaces par domaine
├─ layouts/        # coquilles de page (AdminLayout, UserLayout)
├─ lib/            # utils génériques (cn)
├─ pages/          # pages par rôle (Admin/, User/)
├─ routes/         # RoleBasedRoute
├─ utils/          # helpers (Toast, dates, PDF…)
└─ validation/     # schémas yup (*.validation.ts)
```

---

## 4. Couche API (`src/api/`)

- **1 fichier par domaine métier** : `api/audience.ts`, `api/request.ts`, `api/users.ts`…
- `Config.ts` expose les instances axios :
  - `axiosAuthInstance` (défaut) : injecte le header `Authorization: Bearer <token>`
    depuis `localStorage`.
  - `axiosInstance` : sans auth.
  - `axiosMutlipartFormDataInstance` : `multipart/form-data`.
- Chaque fichier déclare une constante d'URL puis des fonctions `async` courtes :

```ts
import axiosAuthInstance from "./Config";

const AudienceAPIUrl = `${import.meta.env.VITE_BASE_URL}/audience`;

export const getAllAudience = async () => {
  return await axiosAuthInstance.get(`${AudienceAPIUrl}/all`);
}

export const audienceCreate = async (data: CreateAudienceInterface) => {
  return await axiosAuthInstance.post(`${AudienceAPIUrl}/create`, data);
}

export const audienceCancel = async (id: string) => {
  return await axiosAuthInstance.patch(`${AudienceAPIUrl}/cancel/${id}`);
}
```

- Les clés de cache sont centralisées dans `api/QueryCacheKey.ts` (enum `QueryCacheKey`).

---

## 5. Hooks (`src/hooks/`)

- **1 fichier = 1 appel API**, nommé d'après l'action : `useGetAllX`, `useGetXById`,
  `useCreateX`, `usePatchX`, `useUpdateX`, `useDeleteX`, `useValidateX`, `useSearchX`.

### Query (lecture)

```ts
export const useGetAllAudience = () => {
    const { data, isLoading, error, isError, refetch } = useQuery({
        queryKey: [QueryCacheKey.AUDIENCES],
        queryFn: () => getAllAudience(),
        staleTime: Infinity
    })

    useEffect(() => {
        if(isError) {
            showToast({
                type: TOAST_TYPE.ERROR,
                message: "Erreur lors de la récuperation des audiences !"
            })
        }
    }, [error])

    return {
        isLoading,
        data: data?.data,
        refetch
    }
}
```

### Mutation (écriture)

```ts
export const useCreateAudience = ({action}: {action?: () => void}) => {
    const mutation = useMutation({
        mutationFn: (data: CreateAudienceInterface) => audienceCreate(data),
        onSuccess: () => {
            if(action) { action(); }
            showToast({ type: TOAST_TYPE.SUCCESS, message: "Audience organisée !" })
        },
        onError: (error: AxiosError) => {
            showToast({ type: TOAST_TYPE.ERROR, message: error?.message })
        }
    })

    return mutation;
}
```

> Note : le référentiel expose `data: data?.data` et un `action?()` en `onSuccess`.
> L'invalidation de cache existante dans le projet actuel
> (`queryClient.invalidateQueries`) doit être **conservée** dans le nouveau code.

---

## 6. Interfaces (`src/interfaces/`)

- **1 fichier par domaine**, interfaces suffixées `Interface` :
  `CreateAudienceInterface`, `ReportAudienceInterface`, `SerachAudienceInterface`,
  `LoginInterface`…

```ts
export interface CreateAudienceInterface {
    user: string;
    availability: string;
    request: string;
}
```

---

## 7. Validation (`src/validation/`)

- **1 fichier `*.validation.ts` par domaine**, schémas `yup.object`.
- L'export est nommé d'après l'action : `AudienceOrganizeValidation`,
  `AudienceSearchValidation`, `XValidation`.

```ts
import * as yup from 'yup';

export const AudienceOrganizeValidation = yup.object({
    user: yup.string().required("Utilisateur requis"),
    request: yup.string().required("Demande d'audience requise"),
    availability: yup.string().required("Veuillez selectionner un disponibilité"),
})
```

---

## 8. Constants & enums (`src/constants/`)

- Objets `UPPER_SNAKE` exportés par thème :
  - `ToastType.ts` → `TOAST_TYPE` (`SUCCESS`, `ERROR`, `DEFAULT`, `INFO`, `WARNING`)
  - `Http_status.ts` → `HttpStatus`
  - `Status_type.ts` → `StatusType` (`primary`, `alert`, `success`, `gray`, `danger`)
  - `StatusValue.ts` → libellés par domaine (`REQUEST_STATUS`, `AUDIENCE_STATUS`…)
- Utiliser `as const` sur les nouveaux objets de constantes.

```ts
export const TOAST_TYPE = {
    SUCCESS: "success",
    ERROR: "error",
    DEFAULT: "default",
    INFO: "info",
    WARNING: "warning",
} as const;
```

---

## 9. Composants (`src/components/`)

- **Badges d'état** : composants dédiés, un par type d'état
  (`components/status/RequestStatus.tsx`, `AudienceStatus.tsx`…), avec des classes
  Tailwind de pastille (`rounded-full`, `text-xs`, `bg-<couleur>-200`, `text-<couleur>-800`).
- **Dashboard** : composants dans `components/Dashboard/`
  (`AccountDashboard`, `AudienceChart`, `RequestChart`…).
- **Navigation** : `components/Navigation/` (`AdminNavigation`, `UserNavigation`).
- **ui/** : primitives shadcn réutilisables (`button`, `dialog`, `select`…).

---

## 10. Pages & routing

- **Pages organisées par rôle** : `pages/Admin/`, `pages/User/` (aujourd'hui `pages/{role}/`).
- Nommage des pages : `AdminXxx`, `UserXxx` (aujourd'hui `XxxPage`).
- Sous-dossiers pour les vues dérivées (`pages/Admin/Audience/`, `pages/User/Demande/`).
- `App.tsx` compose les routes ; chaque route non triviale est chargée en `lazy()`
  et enveloppée dans un `Suspense`.
- Les routes protégées passent par `routes/RoleBasedRoute.tsx` :

```ts
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
    const { token, isAuthenticated } = useAuth();
    if(!isAuthenticated) { return <Navigate to="/" />; }
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const userRole = decodedToken ? decodedToken.role : null;
    if(userRole && allowedRoles.includes(userRole)) {
        return <Outlet />;
    }
    return <Navigate to="/unauthorized" />;
}
```

---

## 11. Layouts, context & auth

- Coquilles de page dans `layouts/` (`AdminLayout`, `UserLayout`) exposant un `<Outlet />`.
- `context/AuthContext.tsx` expose `AuthProvider` + `useAuth()` (`token`,
  `isAuthenticated`, `login`, `logout`), monte le `<ToastContainer />` et gère la
  redirection après connexion.
- `useAuth()` lève une erreur s'il est utilisé hors `AuthProvider`.

---

## 12. Utils & Toast (`src/utils/`)

- `utils/Toast.ts` : helper unique `showToast({ message, type })` (react-toastify,
  position `top-right`, `autoClose: 3000`, transition `Bounce`).
- Helpers nommés par usage : `toIsoString.ts`, `dateFixation.ts`, `GetMonth/Week/Year`,
  `handleKeyPress.ts`, `ModalStyle.ts`, `setPdfGenerate.tsx`.

---

## 13. Styling

- Tailwind v4. Le référentiel utilise `tailwind.config.js` avec couleurs nommées
  (`primary`, `second`, `four`, `five`…) et polices locales (`fonts/`).
- Le projet actuel définit ses tokens dans `src/index.css` via `@theme`
  (`--color-brand`, `--color-brand-bg`, `--color-brand-border`…) et la classe `.panel`.
- **Nouveau code : réutiliser les tokens existants du projet actuel** ; ne pas introduire
  de nouvelle palette ni changer le design.

---

## 14. Divergences

Le projet actuel (`fanalamangasaprocurementui`) est issu de `project-ref/ui` et respecte
déjà l'essentiel des conventions ci-dessus. Les écarts structurels **retenus** ont été
appliqués (imports `@/`, dossiers, badges, `constants/`) ; les autres restent documentés
pour information. **Aucun nom de variable/type/page n'a été renommé.**

### 14.1 Alignement appliqué

| Point | Avant | Après | Nature |
|---|---|---|---|
| Imports internes | relatifs (`../`, `./pages/…`) | alias `@/...` | appliqué |
| Dossiers de layouts | `src/components/layout/*Layout.tsx` | `src/layouts/*Layout.tsx` | appliqué |
| Dossiers pages | `pages/admin`, `pages/employe`, … | `pages/Admin`, `pages/Employe`, … (PascalCase) | appliqué |
| Badges d'état | dispersés (`components/{demandes,approvisionnement,bonmagasin,demandeachat}/…Badge`) | centralisés dans `components/status/` | appliqué |
| `enums/` | `src/enums/UniteRessource.ts` | `src/constants/UniteRessource.ts` | appliqué |

### 14.2 Divergences conservées (AUCUNE ACTION)

| Point | Référentiel `project-ref/ui` | Projet actuel | Statut |
|---|---|---|---|
| Nommage des pages | `AdminXxx`, `UserXxx` | `XxxPage` | nommage (conservé) |
| `staleTime` sur les queries | `staleTime: Infinity` systématique | souvent absent | améliorer seulement le **nouveau** code |
| Intercepteur de réponse | absent | gère 401 → `/` et 403 → `/unauthorized` | **supérieur, à conserver** |
| Invalidation de cache | non utilisée (`action` seul) | `queryClient.invalidateQueries` | **supérieur, à conserver** |
| Redirection par rôle | logique codée en dur | constante `ROLE_HOME_PATH` | **supérieur, à conserver** |
| Routes/layouts | pas de layout en wrapper de route | layouts en wrapper de route | **supérieur, à conserver** |
| Polices | polices locales `fonts/` + `typeface-lato` | `@fontsource-variable/inter` | divergence (conservée) |
| Dashboard à graphiques | `components/Dashboard/*` | pages d'accueil minimales | **hors périmètre** |

**Règle d'or** : pour les divergences marquées « conservée / à conserver », ne rien
rétrograder — le projet actuel reste la référence sur ces points.
