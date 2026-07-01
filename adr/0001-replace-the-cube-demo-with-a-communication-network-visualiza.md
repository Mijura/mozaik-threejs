# ADR-0001: Replace the cube demo with a communication network visualization

**Status:** Accepted  
**Context:** The current three.js scene in `src/index.ts` uses `THREE.BoxGeometry` and names its visual object `cube`. The user explicitly requested “I don’t want cube not square” and wants communication displayed visually. Alternatives such as keeping the cube and adding labels are rejected because they violate the visual requirement.  
**Decision:** Replace the cube-centered visualization in `src/index.ts` with a non-cube communication network:
- Do not use `THREE.BoxGeometry`, cube terminology, or square/cube primitives.
- Use circular/spherical visual forms only:
  - Agent nodes: `THREE.SphereGeometry`
  - Communication pulses: `THREE.SphereGeometry`
  - Connection lines: `THREE.BufferGeometry` + `THREE.LineBasicMaterial`
- Visualize communication as animated colored pulses traveling between participant nodes.
- Use the theme “cultural appropriation” by modeling participants as named perspectives in a dialogue:
  - `Source Community`
  - `Artist`
  - `Curator`
  - `Audience`
  - `Cultural Mediator`
- Arrange nodes in a circular layout around the scene center.
- Render labels or an overlay in HTML so users can understand what each node/message represents.
- Keep everything in `src/index.ts`; do not introduce new source files unless strictly necessary.
- Keep `index.html` as the browser shell and allow it to host any overlay container needed by the visualization.

**Consequences:** Implementation agents must remove the old spinning cube scene and replace it with an agent communication visualization. All visual naming should refer to nodes, pulses, links, messages, or participants, not cubes or squares.
