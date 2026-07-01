/**
 * mozaik-treejs — Communication network visualization using three.js
 * and @mozaik-ai/core.
 *
 * Replaces the original spinning cube demo with a spherical participant
 * node layout, connection lines, and animated communication visuals.
 */

import * as THREE from "three";
import {
  AgenticEnvironment,
  BaseParticipant,
  SemanticEvent,
} from "@mozaik-ai/core";

// ── Agent ---------------------------------------------------------------

class VisualizerAgent extends BaseParticipant {
  constructor(private readonly label: string) {
    super();
  }

  override onJoined(): void {
    console.log(`[${this.label}] joined the environment`);
  }

  override onMessage(message: string): void {
    console.log(`[${this.label}] received message:`, message);
  }

  override onInternalEvent(event: SemanticEvent<unknown>): void {
    console.log(`[${this.label}] internal event:`, event.getType(), event.data);
  }
}

// ── Scene helpers -------------------------------------------------------

const PARTICIPANT_COUNT = 5;
const CIRCLE_RADIUS = 2.5;
const NODE_RADIUS = 0.35;

interface SceneObjects {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  nodes: THREE.Mesh[];
  lines: THREE.LineSegments;
}

function createScene(): SceneObjects {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111122);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 1.5, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404060);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0x4466ff, 0.5);
  fillLight.position.set(-1, -0.5, -1);
  scene.add(fillLight);

  // Participant nodes arranged in a circle
  const nodeGeometry = new THREE.SphereGeometry(NODE_RADIUS, 24, 24);
  const nodeMaterial = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    metalness: 0.2,
    roughness: 0.6,
  });

  const nodes: THREE.Mesh[] = [];
  const nodePositions: THREE.Vector3[] = [];

  for (let i = 0; i < PARTICIPANT_COUNT; i++) {
    const angle = (i / PARTICIPANT_COUNT) * Math.PI * 2;
    const x = Math.cos(angle) * CIRCLE_RADIUS;
    const z = Math.sin(angle) * CIRCLE_RADIUS;

    const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
    node.position.set(x, 0, z);
    scene.add(node);
    nodes.push(node);
    nodePositions.push(node.position.clone());
  }

  // Connection lines between every pair of nodes
  const linePositions: number[] = [];
  for (let i = 0; i < PARTICIPANT_COUNT; i++) {
    for (let j = i + 1; j < PARTICIPANT_COUNT; j++) {
      const p1 = nodePositions[i];
      const p2 = nodePositions[j];
      linePositions.push(p1.x, p1.y, p1.z);
      linePositions.push(p2.x, p2.y, p2.z);
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3),
  );
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x444466,
    transparent: true,
    opacity: 0.4,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  return { scene, camera, renderer, nodes, lines };
}

function animate(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  nodes: THREE.Mesh[],
  lines: THREE.LineSegments,
): void {
  function frame() {
    requestAnimationFrame(frame);

    // Gentle floating motion for nodes
    const time = Date.now() * 0.001;
    nodes.forEach((node, i) => {
      const offset = i * 1.2;
      node.position.y = Math.sin(time + offset) * 0.1;
    });

    renderer.render(scene, camera);
  }
  frame();
}

function handleResize(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
): void {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ── Main -----------------------------------------------------------------

function main(): void {
  // Set up the mozaik reactive environment
  const env = new AgenticEnvironment("cultural-appropriation-dialogue");

  const agent = new VisualizerAgent("SceneWatcher");
  env.subscribe(agent);

  // Fire a semantic event that the agent logs
  const startEvent = new SemanticEvent("scene:started", {
    timestamp: Date.now(),
  });
  env.deliverSemanticEvent(agent, startEvent);

  // three.js scene
  const { scene, camera, renderer, nodes, lines } = createScene();
  document.body.appendChild(renderer.domElement);
  handleResize(camera, renderer);
  animate(scene, camera, renderer, nodes, lines);

  // Send a message after a short delay to demonstrate message delivery
  setTimeout(() => {
    const msgEvent = new SemanticEvent("scene:tick", {
      message: "Network visualization is running",
      timestamp: Date.now(),
    });
    env.deliverSemanticEvent(agent, msgEvent);
  }, 2000);
}

// Only run in a browser-like environment (document exists)
if (typeof document !== "undefined" && document.body) {
  main();
}

export { VisualizerAgent, createScene, animate, handleResize, main };
