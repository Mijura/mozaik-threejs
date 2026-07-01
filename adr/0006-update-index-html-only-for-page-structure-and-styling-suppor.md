# ADR-0006: Update `index.html` only for page structure and styling support

**Status:** Accepted  
**Context:** The user specifically said “edit this index.html,” but the actual application logic is loaded from `src/index.ts`. The current `index.html` only resets layout and loads the TypeScript module.  
**Decision:** Modify `index.html` to support the visualization shell:
- Keep `<script type="module" src="/src/index.ts"></script>`.
- Update the `<title>` to something like `Mozaik Cultural Dialogue`.
- Add a visible overlay container in `<body>` with stable IDs:
  - `#app-overlay`
  - `#dialogue-title`
  - `#message-log`
- The overlay should explain that the scene visualizes a mozaik/three.js communication simulation about cultural appropriation.
- Keep global full-screen canvas styling.
- Styling may be placed in the existing `<style>` block.
- Do not move the TypeScript entry point out of `src/index.ts`.

**Consequences:** `index.html` becomes the page shell for the educational simulation, while `src/index.ts` remains the owner of rendering and mozaik behavior. Implementation agents should not replace the Vite entry pattern.
