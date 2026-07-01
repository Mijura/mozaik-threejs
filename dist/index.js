/**
 * mozaik-treejs — Communication network visualization using three.js
 * and @mozaik-ai/core.
 *
 * Replaces the original spinning cube demo with a spherical participant
 * node layout, connection lines, and animated communication visuals.
 */
import * as THREE from "three";
import { AgenticEnvironment, BaseParticipant, SemanticEvent, } from "@mozaik-ai/core";
// ── Tone → colour mapping (ADR-004) ------------------------------------
const TONE_COLORS = {
    concern: 0xff5c7a,
    reflection: 0x66ccff,
    context: 0xffcc66,
    question: 0xb28dff,
    resolution: 0x6ee7a8,
};
// ── Agent ---------------------------------------------------------------
/**
 * A dialogue participant that renders semantic events of type
 * "dialogue:message" as animated pulses in the three.js scene.
 */
class DialogueAgent extends BaseParticipant {
    sceneObjects;
    /** Public accessor so the dispatch loop can look up agents by role. */
    roleId;
    constructor(roleId, sceneObjects) {
        super();
        this.sceneObjects = sceneObjects;
        this.roleId = roleId;
    }
    onJoined() {
        console.log(`[${this.roleId}] joined the environment`);
    }
    onInternalEvent(event) {
        const data = event.data;
        if (event.getType() === "dialogue:message" && data) {
            const from = data.from;
            const to = data.to;
            const text = data.text;
            const tone = data.tone;
            const pulseColor = TONE_COLORS[tone] ?? 0xffffff;
            // Map role IDs to node indices (must match PARTICIPANT_ROLES order)
            const roleIndex = {
                "source-community": 0,
                "artist": 1,
                "curator": 2,
                "audience": 3,
                "mediator": 4,
            };
            const fromIdx = roleIndex[from];
            const toIdx = roleIndex[to];
            if (fromIdx === undefined || toIdx === undefined)
                return;
            const { nodes, nodePositions, scene } = this.sceneObjects;
            const startPos = nodePositions[fromIdx];
            const endPos = nodePositions[toIdx];
            // Create the pulse sphere
            const pulseGeom = new THREE.SphereGeometry(0.12, 12, 12);
            const pulseMat = new THREE.MeshStandardMaterial({
                color: pulseColor,
                emissive: pulseColor,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 1,
            });
            const pulse = new THREE.Mesh(pulseGeom, pulseMat);
            pulse.position.copy(startPos);
            scene.add(pulse);
            // Animate the pulse
            const duration = 1200; // ms
            const startTime = performance.now();
            const animatePulse = () => {
                const elapsed = performance.now() - startTime;
                const t = Math.min(elapsed / duration, 1); // 0 → 1
                // Linear interpolation from start to end
                pulse.position.lerpVectors(startPos, endPos, t);
                // Fade + shrink in the second half
                if (t > 0.5) {
                    const fadeT = (t - 0.5) / 0.5; // 0 → 1
                    pulseMat.opacity = 1 - fadeT;
                    const scale = 1 - fadeT * 0.8; // shrink to 20%
                    pulse.scale.setScalar(scale);
                }
                if (t < 1) {
                    requestAnimationFrame(animatePulse);
                }
                else {
                    // Pulse arrived — highlight receiver
                    const receiverNode = nodes[toIdx];
                    if (receiverNode) {
                        receiverNode.scale.setScalar(1.3);
                        setTimeout(() => {
                            receiverNode.scale.setScalar(1);
                        }, 400);
                    }
                    // Remove pulse from scene
                    scene.remove(pulse);
                    pulseGeom.dispose();
                    pulseMat.dispose();
                }
            };
            requestAnimationFrame(animatePulse);
            // Log to console for debugging
            console.log(`[${this.roleId}] dialogue:message ${from} → ${to} (${tone}): ${text}`);
        }
    }
    onExternalEvent(source, event) {
        const src = source;
        console.log(`[${this.roleId}] received external event from ${src.roleId || "unknown"}:`, event.getType(), event.data);
    }
}
const SCRIPT = [
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
// ── Scene helpers -------------------------------------------------------
const PARTICIPANT_COUNT = 5;
const CIRCLE_RADIUS = 2.5;
const NODE_RADIUS = 0.35;
function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    const nodes = [];
    const nodePositions = [];
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
    const linePositions = [];
    for (let i = 0; i < PARTICIPANT_COUNT; i++) {
        for (let j = i + 1; j < PARTICIPANT_COUNT; j++) {
            const p1 = nodePositions[i];
            const p2 = nodePositions[j];
            linePositions.push(p1.x, p1.y, p1.z);
            linePositions.push(p2.x, p2.y, p2.z);
        }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x444466,
        transparent: true,
        opacity: 0.4,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    return { scene, camera, renderer, nodes, nodePositions, lines };
}
function animate(scene, camera, renderer, nodes, lines) {
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
function handleResize(camera, renderer) {
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
// ── Dialogue dispatch ---------------------------------------------------
const PARTICIPANT_ROLES = [
    "source-community",
    "artist",
    "curator",
    "audience",
    "mediator",
];
function startDialogue(env, agents) {
    const roleToAgent = {};
    agents.forEach((a) => {
        roleToAgent[a.roleId] = a;
    });
    let scriptIndex = 0;
    function sendNext() {
        const msg = SCRIPT[scriptIndex];
        const targetAgent = roleToAgent[msg.to];
        if (!targetAgent) {
            scriptIndex = (scriptIndex + 1) % SCRIPT.length;
            setTimeout(sendNext, MSG_INTERVAL_MS);
            return;
        }
        const event = new SemanticEvent("dialogue:message", {
            from: msg.from,
            to: msg.to,
            text: msg.text,
            tone: msg.tone,
            timestamp: Date.now(),
        });
        env.deliverSemanticEvent(targetAgent, event);
        scriptIndex = (scriptIndex + 1) % SCRIPT.length;
        setTimeout(sendNext, MSG_INTERVAL_MS);
    }
    // Start after a brief pause
    setTimeout(sendNext, 1000);
}
// ── Main -----------------------------------------------------------------
function main() {
    // Set up the mozaik reactive environment
    const env = new AgenticEnvironment("cultural-appropriation-dialogue");
    // three.js scene
    const sceneObjects = createScene();
    document.body.appendChild(sceneObjects.renderer.domElement);
    handleResize(sceneObjects.camera, sceneObjects.renderer);
    animate(sceneObjects.scene, sceneObjects.camera, sceneObjects.renderer, sceneObjects.nodes, sceneObjects.lines);
    // Create dialogue agents and subscribe them
    const agents = PARTICIPANT_ROLES.map((role) => new DialogueAgent(role, sceneObjects));
    agents.forEach((agent) => env.subscribe(agent));
    // Start the dialogue loop
    startDialogue(env, agents);
}
// Only run in a browser-like environment (document exists)
if (typeof document !== "undefined" && document.body) {
    main();
}
export { DialogueAgent, createScene, animate, handleResize, main };
//# sourceMappingURL=index.js.map