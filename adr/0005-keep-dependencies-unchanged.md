# ADR-0005: Keep dependencies unchanged

**Status:** Accepted  
**Context:** The existing `package.json` already includes `three`, `@mozaik-ai/core`, TypeScript, Vite, and `@types/three`. The requested feature can be built with these existing dependencies.  
**Decision:** Do not add any new npm dependencies. Use:
- `three` for rendering
- `@mozaik-ai/core` for the agentic environment and semantic events
- Browser DOM APIs for text overlays and message logs

Do not add UI frameworks, CSS libraries, animation libraries, or state-management packages.

**Consequences:** The implementation remains lightweight and aligned with the current project. `package.json` and `package-lock.json` should not need dependency changes.
