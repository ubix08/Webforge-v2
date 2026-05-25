# React + Vite Stack Conventions (Pipeline A)

## Setup

```bash
npm create vite@latest . -- --template react-ts
npx shadcn@latest init
npm install react-router-dom @tanstack/react-query zustand react-hook-form zod axios
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react playwright
```

## Project Structure

```
src/
  app/
    App.tsx           # Root component, providers
    router.tsx        # createBrowserRouter definition
    providers.tsx     # QueryClient, theme, etc.
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
    layout/           # AppLayout, AuthLayout, Sidebar, TopBar
    shared/           # PageError, PageSkeleton, ConfirmDialog, EmptyState
  lib/
    api.ts            # Axios instance + interceptors
    queryKeys.ts      # Query key factories
    utils.ts          # cn() and other utilities
    env.ts            # Typed env var access
  types/
    index.ts          # Shared global types
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
- `keepPreviousData: true` for paginated queries
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

// Inject auth token
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
