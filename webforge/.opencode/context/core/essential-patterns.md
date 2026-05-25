# Universal Quality Standards

## Code Quality

- TypeScript strict mode — no `any`, no implicit `any`, no type assertions without justification
- All functions have explicit return types
- All props and state typed with interfaces or type aliases
- No unused imports or variables
- No `console.log` in production code — use a proper logger or remove entirely

## Error Handling

- Every async operation has try/catch or `.catch()`
- User-facing error messages are human-readable — never expose raw error objects or stack traces
- Network failures show a retry option, not a blank screen
- Unexpected errors are caught at the boundary (React error boundary or top-level handler)

## Testing

- Unit tests for all business logic (stores, hooks, processing functions, paywall helpers)
- Component tests for critical UI flows (React Testing Library)
- E2E tests for the primary happy path (Playwright — Pipeline B priority)
- Tests cover: happy path, loading state, error state, empty state, edge cases

## Performance

- Code-split at route level with `React.lazy` + `Suspense`
- Lazy load heavy components and libraries
- Optimize images (compressed, correct format, explicit dimensions)
- No unnecessary re-renders — use `React.memo`, `useMemo`, `useCallback` only where profiling shows benefit

## Security

- Never hardcode secrets, API keys, or credentials
- Sanitize all user input before rendering (prevent XSS)
- No `dangerouslySetInnerHTML` without explicit sanitization
- CSP headers set in deployment config
- No `eval()` or dynamic code execution

## Accessibility

- Semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<header>`, etc.)
- ARIA labels on interactive elements that lack visible text
- Keyboard navigable — Tab, Enter, Escape, arrow keys work correctly
- Color contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text)
- Focus management for modals and drawers (trap focus when open, restore on close)
- Screen reader tested for primary flows

## State Management Discipline

- Server state → TanStack Query (Pipeline A) or React state (Pipeline B)
- UI state → Zustand (global) or `useState` (local)
- Form state → React Hook Form
- No mixing of concerns: don't store server data in Zustand, don't use `useEffect` for data fetching
