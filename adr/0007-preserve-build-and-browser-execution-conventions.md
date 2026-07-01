# ADR-0007: Preserve build and browser execution conventions

**Status:** Accepted  
**Context:** The project uses `npm run build` for TypeScript checking and `npm run dev` for Vite browser execution. The current `src/index.ts` guards browser-only startup with a document check.  
**Decision:** Preserve the browser-first pattern:
- Keep `main()` as the top-level function that wires mozaik, three.js, and the DOM overlay.
- Keep a browser guard before calling `main()`:
  - Only call `main()` when `typeof document !== "undefined"` and `document.body` exists.
- Continue exporting important symbols from `src/index.ts` for type-checking and possible reuse.
- Ensure `npm run build` succeeds with `tsc`.
- Do not introduce server-side code or Node-only APIs.

**Consequences:** The app remains runnable with `npm run dev` in a browser and checkable with `npm run build`. Agents should avoid APIs that break Vite/browser execution.
