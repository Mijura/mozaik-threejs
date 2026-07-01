/**
 * mozaik-treejs — Communication network visualization using three.js
 * and @mozaik-ai/core.
 *
 * Replaces the original spinning cube demo with a spherical participant
 * node layout, connection lines, and animated communication visuals.
 */
import * as THREE from "three";
import { BaseParticipant, SemanticEvent } from "@mozaik-ai/core";
/**
 * A dialogue participant that renders semantic events of type
 * "dialogue:message" as animated pulses in the three.js scene.
 */
declare class DialogueAgent extends BaseParticipant {
    private readonly sceneObjects;
    /** Public accessor so the dispatch loop can look up agents by role. */
    readonly roleId: string;
    constructor(roleId: string, sceneObjects: SceneObjects);
    onJoined(): void;
    onInternalEvent(event: SemanticEvent<unknown>): void;
    onExternalEvent(source: unknown, event: SemanticEvent<unknown>): void;
}
interface SceneObjects {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    nodes: THREE.Mesh[];
    nodePositions: THREE.Vector3[];
    lines: THREE.LineSegments;
}
declare function createScene(): SceneObjects;
declare function animate(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, nodes: THREE.Mesh[], lines: THREE.LineSegments): void;
declare function handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void;
declare function main(): void;
export { DialogueAgent, createScene, animate, handleResize, main };
