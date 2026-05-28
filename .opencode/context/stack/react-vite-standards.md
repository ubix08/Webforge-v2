# React + Vite Stack Conventions (Pipeline A)

## Setup

Templates at `templates/pipeline-a-vite/` provide the base scaffold. This doc covers conventions for adding feature code on top.

```bash
# Template provides: Vite + React + TypeScript + Tailwind + Router + Query + Zustand
# After copy: npm install, then implement per feature structure below
```

## Project Structure

```
src/
  app/
    App.tsx           # Root component, providers + router
  pages/              # Route pages (lazy-loaded)
    Home.tsx
  features/
    {feature}/
      components/     # Feature-specific UI
      hooks.ts        # TanStack Query hooks
      api.ts          # API client functions
      store.ts        # Zustand slice (UI state only)
      schemas.ts      # Zod schemas
      types.ts        # TypeScript interfaces
  components/
    ui/               # shadcn/ui components
    layout/           # AppLayout, Sidebar, TopBar
    shared/           # PageError, PageSkeleton, ConfirmDialog, EmptyState
  lib/
    api.ts            # Axios instance + interceptors
    queryKeys.ts      # Query key factories
    utils.ts          # cn() and other utilities
  types/
    index.ts          # Shared global types
  stores/
    authStore.ts      # Auth session (create during implementation)
```

## Routing

- React Router v6 with `createBrowserRouter`
- All routes lazy-loaded: `const Page = React.lazy(() => import('./pages/Page'))`
- Wrap lazy routes in `<Suspense fallback={<PageSkeleton />}>`
- Layout routes for shared shells (AppLayout, AuthLayout)
- `ProtectedRoute` component wraps all authenticated routes

## Data Fetching (TanStack Query v5)

- Query key factories in `src/lib/queryKeys.ts`:
  ```typescript
  export const userKeys = {
    all: () => ['users'] as const,
    list: (filters?: UserFilters) => [...userKeys.all(), 'list', filters] as const,
    detail: (id: string) => [...userKeys.all(), 'detail', id] as const,
  }
  ```
- Custom hooks per resource: `useUsers`, `useUser(id)`, `useCreateUser`, `useUpdateUser`
- Mutations with optimistic updates for toggle/status changes
- `placeholderData: keepPreviousData` for paginated queries (import `keepPreviousData` from `@tanstack/react-query`)
- `useInfiniteQuery` for scroll-based pagination
- `staleTime: 5 * 60 * 1000` (5 min) for mostly-static data

## State Management (Zustand)

- Zustand stores for: auth session, theme, modal state, filter/sort state
- Server state lives in TanStack Query — never duplicated in Zustand
- Use slices pattern for complex stores
- Persist auth store to localStorage via `persist` middleware

## API Client (Axios)

```typescript
// src/lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
})

// Inject auth token (assumes useAuthStore exists — create it in src/stores/authStore.ts)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) useAuthStore.getState().clearSession()
    return Promise.reject(normalizeError(err))
  }
)
```

## Error Normalization

```typescript
interface AppError {
  message: string
  code: string
  status: number
}
```

- 401 → clear session, redirect to login
- 403 → show permission denied
- 5xx → show retry option
- Network error → "Connection lost — check your internet"

## Form Validation (Zod + React Hook Form)

- Schemas in `src/features/{feature}/schemas.ts`
- Use `zodResolver` from `@hookform/resolvers/zod`
- Error messages defined in schema, not in components
- Co-locate form schemas with the feature that owns them
