# mozaik-treejs

A minimal example combining [three.js](https://threejs.org/) visualization with [@mozaik-ai/core](https://github.com/jigjoy-ai/mozaik) reactive agents.

## Usage

```bash
npm install
npm run build
```

The compiled output is in `dist/`. The main entry point (`src/index.ts`) creates a spinning 3D cube and a mozaik `BaseParticipant` agent that logs lifecycle events — demonstrating how an agentic reactive environment can coexist with a real-time rendering loop.

## What it does

- Sets up a three.js scene (spinning cube with lighting)
- Creates a `VisualizerAgent` (a `BaseParticipant` subclass) in a mozaik `AgenticEnvironment`
- Fires semantic events (`SemanticEvent`) into the environment that the agent logs to the console
- Designed to run in the browser (attaches the renderer to `document.body`)

## API exports

- `VisualizerAgent` — a simple mozaik participant that logs events
- `createScene()` — builds a basic three.js scene
- `animate(scene, camera, renderer, cube)` — starts the render loop
- `main()` — wires everything together
