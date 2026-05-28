# API Patterns (Pipeline A)

## API Client

```typescript
// src/lib/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearSession()
    }
    return Promise.reject(normalizeApiError(err))
  }
)

export interface AppError {
  message: string
  code: string
  status: number
}

function normalizeApiError(err: unknown): AppError {
  if (axios.isAxiosError(err)) {
    return {
      message: err.response?.data?.message ?? 'An unexpected error occurred',
      code: err.response?.data?.code ?? 'UNKNOWN',
      status: err.response?.status ?? 0,
    }
  }
  return { message: 'Network error — check your connection', code: 'NETWORK', status: 0 }
}
```

## Endpoint Organization

```
src/lib/api/
  client.ts       # Axios instance (above)
  users.ts        # User API functions
  projects.ts     # Project API functions
  tasks.ts        # Task API functions
```

Each file exports typed async functions:

```typescript
// src/lib/api/projects.ts
import { api } from './client'
import type { Project, CreateProjectInput } from '@/features/projects/types'

export const projectsApi = {
  list: () => api.get<Project[]>('/projects').then(r => r.data),
  get: (id: string) => api.get<Project>(`/projects/${id}`).then(r => r.data),
  create: (input: CreateProjectInput) => api.post<Project>('/projects', input).then(r => r.data),
  update: (id: string, input: Partial<CreateProjectInput>) =>
    api.patch<Project>(`/projects/${id}`, input).then(r => r.data),
  delete: (id: string) => api.delete(`/projects/${id}`),
}
```

## Query Key Factories

```typescript
// src/lib/queryKeys.ts
export const projectKeys = {
  all: () => ['projects'] as const,
  lists: () => [...projectKeys.all(), 'list'] as const,
  list: (filters?: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all(), 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
}
```

## Query Hook Patterns

```typescript
// src/features/projects/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectKeys } from '@/lib/queryKeys'
import { projectsApi } from '@/lib/api/projects'

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => projectsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<CreateProjectInput>) => projectsApi.update(id, input),
    onMutate: async (input) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: projectKeys.detail(id) })
      const previous = queryClient.getQueryData(projectKeys.detail(id))
      queryClient.setQueryData(projectKeys.detail(id), (old: Project) => ({ ...old, ...input }))
      return { previous }
    },
    onError: (_err, _input, context) => {
      queryClient.setQueryData(projectKeys.detail(id), context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) })
    },
  })
}
```

## Error Handling in Components

```typescript
const { data, isLoading, isError, error, refetch } = useProjects()

if (isLoading) return <PageSkeleton />
if (isError) return <PageError message={error.message} onRetry={refetch} />
if (!data?.length) return <EmptyState title="No projects yet" action={<CreateProjectButton />} />
```

Never render raw error objects. Always map to user-friendly messages.

## Pagination

```typescript
// Cursor-based infinite scroll
export function useInfiniteProjects() {
  return useInfiniteQuery({
    queryKey: projectKeys.list({ paginated: true }),
    queryFn: ({ pageParam }) => projectsApi.list({ cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
```
