# mozaik-treejs

A minimal example combining [three.js](https://threejs.org/) visualization with [@mozaik-ai/core](https://github.com/jigjoy-ai/mozaik) reactive agents.

## Usage

### Run in the browser (development)

```bash
npm install
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173/`. Open it in a browser to see the spinning cube while mozaik lifecycle and event logs appear in the browser developer console.

### TypeScript build / type-check

```bash
npm run build
```

The compiled output goes into `dist/`. This is the standard TypeScript compile/check pass and does not produce a browser bundle.

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
