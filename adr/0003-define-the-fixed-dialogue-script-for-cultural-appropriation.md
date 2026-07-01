# ADR-0003: Define the fixed dialogue script for cultural appropriation

**Status:** Accepted  
**Context:** Multiple implementation agents could invent different content, tones, or participant flows. The user gave the topic “cultural appropriation,” so the app needs a consistent and sensitive simulation script.  
**Decision:** Use this fixed repeating dialogue sequence in `src/index.ts`:

1. From `source-community` to `artist`  
   Tone: `"concern"`  
   Text: `"This symbol carries lived history for our community; using it without context can cause harm."`

2. From `artist` to `source-community`  
   Tone: `"reflection"`  
   Text: `"I hear that concern. I need to understand the origin and ask whether collaboration is appropriate."`

3. From `curator` to `audience`  
   Tone: `"context"`  
   Text: `"The difference between appreciation and appropriation often depends on consent, credit, power, and benefit."`

4. From `audience` to `mediator`  
   Tone: `"question"`  
   Text: `"How can viewers respond respectfully when they encounter contested cultural imagery?"`

5. From `mediator` to `artist`  
   Tone: `"resolution"`  
   Text: `"Begin with consent, compensate contributors, credit sources, and be willing to change or withdraw the work."`

6. From `mediator` to `source-community`  
   Tone: `"resolution"`  
   Text: `"The process should center the affected community’s voice rather than treating culture as decoration."`

- Dispatch one message approximately every 1800 milliseconds.
- After the final message, loop back to the first message.
- The currently active message must be shown in an on-screen log or panel.

**Consequences:** All agents implement the same educational message flow. The simulation avoids random or insensitive phrasing and demonstrates communication dynamics clearly.
