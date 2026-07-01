/**
 * mozaik-treejs — Cultural-appropriation dialogue simulation
 *
 * Uses @mozaik-ai/core to run a fixed script about cultural appropriation
 * among five perspectives (source-community, artist, curator, audience,
 * mediator) and visualises the communication with three.js.
 */

import * as THREE from "three";
import {
  AgenticEnvironment,
  BaseParticipant,
  SemanticEvent,
} from "@mozaik-ai/core";

// ── Agent ---------------------------------------------------------------

/**
 * A dialogue participant that logs / renders semantic events of type
 * "dialogue:message" sent through the AgenticEnvironment.
 */
class DialogueAgent extends BaseParticipant {
  constructor(private readonly roleId: string) {
    super();
  }

  override onJoined(): void {
    console.log(`[${this.roleId}] joined the environment`);
  }

  override onInternalEvent(event: SemanticEvent<unknown>): void {
    console.log(`[${this.roleId}] internal event:`, event.getType(), event.data);
  }

  override onExternalEvent(source: unknown, event: SemanticEvent<unknown>): void {
    console.log(
      `[${this.roleId}] received external event from ${(source as DialogueAgent).roleId || "unknown"}:`,
      event.getType(),
      event.data,
    );
  }
}

// ── Dialogue script -----------------------------------------------------

interface DialogueMessage {
  from: string;
  to: string;
  text: string;
  tone: "concern" | "reflection" | "context" | "question" | "resolution";
  timestamp: number;
}

const SCRIPT: Omit<DialogueMessage, "timestamp">[] = [
  {
    from: "source-community",
    to: "artist",
    tone: "concern",
    text: "This symbol carries lived history for our community; using it without context can cause harm.",
  },
  {
    from: "artist",
    to: "source-community",
    tone: "reflection",
    text: "I hear that concern. I need to understand the origin and ask whether collaboration is appropriate.",
  },
  {
    from: "curator",
    to: "audience",
    tone: "context",
    text: "The difference between appreciation and appropriation often depends on consent, credit, power, and benefit.",
  },
  {
    from: "audience",
    to: "mediator",
    tone: "question",
    text: "How can viewers respond respectfully when they encounter contested cultural imagery?",
  },
  {
    from: "mediator",
    to: "artist",
    tone: "resolution",
    text: "Begin with consent, compensate contributors, credit sources, and be willing to change or withdraw the work.",
  },
  {
    from: "mediator",
    to: "source-community",
    tone: "resolution",
    text: "The process should center the affected community's voice rather than treating culture as decoration.",
  },
];

const MSG_INTERVAL_MS = 1800;

// ── Scene helpers (minimal) --------------------------------------------

function createScene(): {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
} {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111122);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const ambientLight = new THREE.AmbientLight(0x404060);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);

  return { scene, camera, renderer };
}

function animate(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
): void {
  function frame() {
    requestAnimationFrame(frame);
    renderer.render(scene, camera);
  }
  frame();
}

// ── Main -----------------------------------------------------------------

function main(): void {
  // Set up the mozaik reactive environment
  const env = new AgenticEnvironment("cultural-appropriation-dialogue");

  // ── Create & subscribe dialogue agents ──────────────────────────────
  const agentIds = ["source-community", "artist", "curator", "audience", "mediator"];
  const agents: Record<string, DialogueAgent> = {};
  for (const id of agentIds) {
    const agent = new DialogueAgent(id);
    agents[id] = agent;
    env.subscribe(agent);
  }

  // ── Fixed dialogue loop ──────────────────────────────────────────────
  let scriptIndex = 0;

  function dispatchNextMessage(): void {
    const entry = SCRIPT[scriptIndex];
    const sender = agents[entry.from];
    const recipient = agents[entry.to];

    if (sender && recipient) {
      const event = new SemanticEvent<DialogueMessage>("dialogue:message", {
        from: entry.from,
        to: entry.to,
        text: entry.text,
        tone: entry.tone,
        timestamp: Date.now(),
      });
      env.deliverSemanticEvent(recipient, event);
    }

    scriptIndex = (scriptIndex + 1) % SCRIPT.length;
    setTimeout(dispatchNextMessage, MSG_INTERVAL_MS);
  }

  // Start after a short initial pause
  setTimeout(dispatchNextMessage, MSG_INTERVAL_MS);

  // ── three.js scene (placeholder — visualisation added by later stories) ──
  const { scene, camera, renderer } = createScene();
  document.body.appendChild(renderer.domElement);
  animate(scene, camera, renderer);
}

// Only run in a browser-like environment (document exists)
if (typeof document !== "undefined" && document.body) {
  main();
}

export { DialogueAgent, createScene, animate, main };
export type { DialogueMessage };
