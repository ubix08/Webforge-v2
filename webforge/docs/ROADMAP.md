# WebForge — Product Roadmap

> **Reference document** — Not loaded by agents during pipeline runs. For human planning only.

## Scoring Summary

| Rank | Product | Score | Build Time | Price | Why This Order |
|------|---------|-------|-----------|-------|----------------|
| 1 | **SchemaLocal** ✅ | 23/25 | 2–3 days | $14/mo or $29 one-time | Pure logic, no WASM, biggest gap |
| 2 | **BatesBot** | 21/25 | 1–2 weeks | $19–29/mo | pdf-lib, legal buyers, high retention |
| 3 | **PDF Compressor** ✅ | 19/25 | 2–3 weeks | $9/mo | Ghostscript WASM, mass audience |
| 4 | **CSVFixer** | 18/25 | 1 week | $19/mo or $2/file | Papa Parse, dropshipper pain |
| 5 | **MapVisualizer** | 19/25 | 1 week | $15/mo | D3.js, agency deliverable |
| 6 | **Audio Transcription** | 20/25 | 4–6 weeks | $15–29/mo | Highest revenue ceiling |
| 7 | **PII Masking / Legal AI** | 20/25 | 6–10 weeks | $39–199/mo | B2B, long sales cycle |

---

## Phase 1: Foundation (Products 1–3)

Establish the platform: Next.js + PWA + paywall + optional WASM loading pattern.

### Product 1: SchemaLocal ✅ Shipped
**Build:** 2–3 days | **Stack:** Next.js + Papa Parse + JSON-LD template engine
**Buyer:** SEO agencies managing multi-location clients
**Free:** ≤5 locations | **Paid:** $14/month or $29 one-time
**Key pattern:** CSV upload → column mapping → bulk JSON-LD generation. Zero WASM needed.

### Product 2: BatesBot 🔴 Next
**Build:** 1–2 weeks | **Stack:** Next.js + pdf-lib + JSZip
**Buyer:** Solo law firms, paralegals
**Free:** ≤3 documents/month | **Paid:** $19/month (unlimited), $29/month (custom templates)
**SEO pages:** `/bates-numbering/legal-discovery`, `/free-bates-tool-for-paralegals`, `/bulk-bates-generator`
**Key pattern:** Batch PDF upload → sequential Bates stamping → ZIP download. All pdf-lib, no WASM.

### Product 3: PDF Compressor ✅ Shipped
**Build:** 2–3 weeks | **Stack:** Next.js + Ghostscript WASM + Web Worker
**Buyer:** General (legal, medical, office admin, students)
**Free:** 1 file/session, 50MB max | **Paid:** $9/month (unlimited, 500MB, batch ZIP)
**Key pattern:** Ghostscript WASM in Web Worker. Establishes WASM + Worker + COOP/COEP pattern.

---

## Phase 2: Scale (Products 4–5)

Platform proven. Add simpler tools sharing the same infrastructure.

### Product 4: CSVFixer
**Build:** 1 week | **Stack:** Next.js + Papa Parse + column mapping UI
**Buyer:** Dropshippers, e-commerce managers
**Free:** 1 file | **Paid:** $19/month or $2/file

### Product 5: MapVisualizer
**Build:** 1 week | **Stack:** Next.js + D3.js
**Buyer:** SEO consultants, web design agencies
**Free:** ≤100 pages | **Paid:** $15/month (10k pages, white-label)

---

## Phase 3: High-Revenue (Products 6–7)

Require WASM AI models. Loading UX and paywall are production-proven by now.

### Product 6: Audio Transcription Suite
**Build:** 4–6 weeks | **Stack:** Next.js + Transformers.js v3 (Whisper via WebGPU) + Cache API
**Buyer:** Legal, medical, journalism
**Free:** ≤5 minutes | **Paid:** $15–29/month

### Product 7: PII Masking / Legal AI
**Build:** 6–10 weeks | **Stack:** Next.js + WebLLM + ONNX 4-bit quantized models
**Buyer:** Enterprise legal, procurement
**Free:** Basic 1B model | **Paid:** $39–199/month B2B

---

## Phase 4: Fillers

Low-effort products using established patterns:
- Invoice Generator
- Email Signature Generator
- Rent Receipt Generator
- Receipt Scanner
- Letterhead Generator

---

## Progress Tracker

| Product | Phase | Status | Est. Build | Actual Start | Actual Ship |
|---------|-------|--------|-----------|-------------|-------------|
| SchemaLocal | 1 | ✅ Shipped | 2–3 days | 2026-05-23 | 2026-05-23 |
| BatesBot | 1 | 🔴 Not started | 1–2 weeks | — | — |
| PDF Compressor | 1 | ✅ Shipped | 2–3 weeks | 2026-05-22 | 2026-05-23 |
| CSVFixer | 2 | 🔴 Not started | 1 week | — | — |
| MapVisualizer | 2 | 🔴 Not started | 1 week | — | — |
| Audio Transcription | 3 | 🔴 Not started | 4–6 weeks | — | — |
| PII Masking / Legal AI | 3 | 🔴 Not started | 6–10 weeks | — | — |
