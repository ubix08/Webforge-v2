# WASM Execution Standards (Pipeline B)

## WASM Loading

- WASM binaries in `/public/wasm/` (same-origin — no CDN)
- Load via `WebAssembly.instantiateStreaming` (preferred) or `fetch` + `WebAssembly.instantiate`
- Always check `typeof WebAssembly !== 'undefined'` before loading
- COOP/COEP headers required for `SharedArrayBuffer` (multi-threaded WASM) — set in `vercel.json`
- For products that don't need `SharedArrayBuffer`, omit COOP/COEP to avoid breaking third-party embeds

## Web Workers

Workers in `public/workers/` (accessible at runtime). Worker managers in `src/workers/`.

### Worker Lifecycle

```typescript
// src/workers/{tool}Worker.ts
export class ToolWorker {
  private worker: Worker | null = null
  private idleTimer: ReturnType<typeof setTimeout> | null = null
  private readonly IDLE_TIMEOUT = 30_000

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker('/workers/{tool}.worker.js')
    }
    this.resetIdleTimer()
    return this.worker
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer)
    this.idleTimer = setTimeout(() => this.terminate(), this.IDLE_TIMEOUT)
  }

  terminate(): void {
    this.worker?.terminate()
    this.worker = null
    if (this.idleTimer) clearTimeout(this.idleTimer)
  }
}
```

### Worker Message Protocol

All worker messages use a typed discriminated union:

```typescript
// Inbound (main → worker)
type WorkerInbound =
  | { type: 'init'; payload: { wasmUrl: string } }
  | { type: 'process'; payload: { input: ArrayBuffer; options?: ProcessOptions } }
  | { type: 'cancel' }

// Outbound (worker → main)
type WorkerOutbound =
  | { type: 'ready' }
  | { type: 'progress'; payload: { percent: number; stage: string } }
  | { type: 'result'; payload: { output: ArrayBuffer; metadata: ResultMetadata } }
  | { type: 'error'; payload: { message: string; code: string } }
```

### ArrayBuffer Transfer

Always **transfer** (not copy) ArrayBuffers for large data:

```typescript
worker.postMessage(
  { type: 'process', payload: { input: buffer } },
  [buffer] // transferable — caller loses ownership
)
```

### React Hook Pattern

```typescript
// src/hooks/use{Tool}.ts
export function useTool() {
  const [state, setState] = useState<ToolState>({ status: 'idle' })
  const workerRef = useRef<ToolWorker | null>(null)

  const process = useCallback(async (file: File) => {
    setState({ status: 'loading', progress: 0 })
    const worker = workerRef.current ??= new ToolWorker()
    const buffer = await file.arrayBuffer()

    return new Promise<ProcessResult>((resolve, reject) => {
      worker.onMessage((msg) => {
        if (msg.type === 'progress') setState({ status: 'loading', progress: msg.payload.percent })
        if (msg.type === 'result') { setState({ status: 'success' }); resolve(msg.payload) }
        if (msg.type === 'error') { setState({ status: 'error', message: msg.payload.message }); reject(new Error(msg.payload.message)) }
      })
      worker.post({ type: 'process', payload: { input: buffer } }, [buffer])
    })
  }, [])

  useEffect(() => () => workerRef.current?.terminate(), [])

  return { state, process }
}
```

## Performance

- Keep worker alive for batch operations — don't recreate per file
- Auto-terminate after 30s idle (see lifecycle above)
- Transfer `ArrayBuffer` objects — never `JSON.stringify` large binary data
- Show progress events for operations > 500ms

## File Structure

```
public/
  wasm/
    {tool}.wasm
  workers/
    {tool}.worker.js
src/
  workers/
    {tool}Worker.ts      # Worker manager class
  hooks/
    use{Tool}.ts         # React hook (UI ↔ worker bridge)
```
