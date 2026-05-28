# Universal Quality Standards

## Code Quality

- TypeScript strict mode — no `any`, no implicit `any`, no type assertions without justification
- All functions have explicit return types
- All props and state typed with interfaces or type aliases
- No unused imports or variables
- No `console.log` in production code

## Error Handling

- Every async operation has try/catch or `.catch()`
- User-facing error messages are human-readable — never expose raw error objects or stack traces
- Network failures show a retry option, not a blank screen
- Unexpected errors caught at React error boundary or top-level handler

## Testing

- Unit tests for all business logic (stores, hooks, processing, paywall)
- Component tests for critical UI flows (React Testing Library)
- E2E tests for the primary happy path (Playwright)
- Tests cover: happy path, loading state, error state, empty state, edge cases

## Performance

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

- Semantic HTML (`<button>`, `<nav>`, `<main>`, `<header>`)
- ARIA labels on interactive elements lacking visible text
- Keyboard navigable — Tab, Enter, Escape, arrow keys
- Color contrast meets WCAG AA (4.5:1 body text, 3:1 large text)
- Focus management for modals and drawers

## State Management (Pipeline-Specific)

Choose based on the active pipeline:
- **Pipeline A:** Server state → TanStack Query, UI state → Zustand, Form state → React Hook Form
- **Pipeline B:** State → Zustand, no server state layer needed
