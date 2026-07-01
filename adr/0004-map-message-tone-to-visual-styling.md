# ADR-0004: Map message tone to visual styling

**Status:** Accepted  
**Context:** The user asked to visually display communication. Without a fixed visual language, agents may choose conflicting colors, animation patterns, or UI meanings.  
**Decision:** Use one shared tone-to-color mapping in `src/index.ts`:
- `concern`: `0xff5c7a`
- `reflection`: `0x66ccff`
- `context`: `0xffcc66`
- `question`: `0xb28dff`
- `resolution`: `0x6ee7a8`

Apply the tone color consistently to:
- The moving communication pulse
- The highlighted connection line, if implemented
- The corresponding message log entry or tone badge in the HTML overlay

Communication animation:
- A pulse starts at the sender node position.
- It travels linearly to the receiver node position.
- It fades or shrinks when it reaches the receiver.
- The receiver node should briefly glow or scale up to show message receipt.

**Consequences:** Users can associate different kinds of communication with consistent visual cues. Implementation agents must not invent alternate tone colors.
