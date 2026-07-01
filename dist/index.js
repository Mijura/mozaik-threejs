/**
 * mozaik-treejs — A small example combining three.js visualization
 * with @mozaik-ai/core reactive agents.
 *
 * Spinning cube scene + an agent that logs lifecycle events to the
 * browser console (or Node stdout if run headless).
 */
import * as THREE from "three";
import { AgenticEnvironment, BaseParticipant, SemanticEvent, } from "@mozaik-ai/core";
// ── Agent ---------------------------------------------------------------
class VisualizerAgent extends BaseParticipant {
    label;
    constructor(label) {
        super();
        this.label = label;
    }
    onJoined() {
        console.log(`[${this.label}] joined the environment`);
    }
    onMessage(message) {
        console.log(`[${this.label}] received message:`, message);
    }
    onInternalEvent(event) {
        console.log(`[${this.label}] internal event:`, event.getType(), event.data);
    }
}
// ── Scene helpers -------------------------------------------------------
function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    const camera = new THREE.PerspectiveCamera(75, globalThis.innerWidth / globalThis.innerHeight, 0.1, 1000);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    renderer.setPixelRatio(globalThis.devicePixelRatio);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x44aaff,
        metalness: 0.3,
        roughness: 0.4,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);
    return { scene, camera, renderer, cube };
}
function animate(scene, camera, renderer, cube) {
    function frame() {
        requestAnimationFrame(frame);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.012;
        renderer.render(scene, camera);
    }
    frame();
}
// ── Main -----------------------------------------------------------------
function main() {
    // Set up the mozaik reactive environment
    const env = new AgenticEnvironment("three-demo");
    const agent = new VisualizerAgent("CubeWatcher");
    env.subscribe(agent);
    // Fire a semantic event that the agent logs
    const startEvent = new SemanticEvent("visualizer:started", {
        timestamp: Date.now(),
    });
    env.deliverSemanticEvent(agent, startEvent);
    // three.js scene
    const { scene, camera, renderer, cube } = createScene();
    document.body.appendChild(renderer.domElement);
    animate(scene, camera, renderer, cube);
    // Send a message after a short delay to demonstrate message delivery
    setTimeout(() => {
        const msgEvent = new SemanticEvent("visualizer:tick", {
            message: "Cube is spinning",
            rotation: cube.rotation,
        });
        env.deliverSemanticEvent(agent, msgEvent);
    }, 2000);
}
// Only run in a browser-like environment (document exists)
if (typeof document !== "undefined" && document.body) {
    main();
}
export { VisualizerAgent, createScene, animate, main };
//# sourceMappingURL=index.js.map