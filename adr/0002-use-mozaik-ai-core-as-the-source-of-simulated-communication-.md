# ADR-0002: Use `@mozaik-ai/core` as the source of simulated communication events

**Status:** Accepted  
**Context:** The project already imports `AgenticEnvironment`, `BaseParticipant`, and `SemanticEvent` from `@mozaik-ai/core`. The user wants the mozaik library connected with three.js and wants communication displayed, not merely logged.  
**Decision:** Continue using `@mozaik-ai/core` directly in `src/index.ts`:
- Create one `AgenticEnvironment`, named exactly `"cultural-appropriation-dialogue"`.
- Create participant objects by subclassing `BaseParticipant`.
- Name the participant class `DialogueAgent`.
- Each `DialogueAgent` must represent one dialogue role:
  - `source-community`
  - `artist`
  - `curator`
  - `audience`
  - `mediator`
- Subscribe all agents to the environment with `env.subscribe(agent)`.
- Represent each simulated message as a `SemanticEvent` with event type exactly `"dialogue:message"`.
- Event data must include:
  - `from: string`
  - `to: string`
  - `text: string`
  - `tone: "concern" | "reflection" | "context" | "question" | "resolution"`
  - `timestamp: number`
- Deliver each semantic event through the mozaik environment with `env.deliverSemanticEvent(targetAgent, event)`.
- `DialogueAgent.onInternalEvent` should update the visual layer rather than only logging to the console.

**Consequences:** The simulation remains a real `@mozaik-ai/core` integration rather than a standalone three.js animation. Agents must wire semantic events to visual pulses and UI updates so communication is visible in the browser.
