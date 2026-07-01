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
 * A dialogue participant that logs / renders semantic events of type
 * "dialogue:message" sent through the AgenticEnvironment.
 */
declare class DialogueAgent extends BaseParticipant {
    private readonly roleId;
    constructor(roleId: string);
    onJoined(): void;
    onInternalEvent(event: SemanticEvent<unknown>): void;
    onExternalEvent(source: unknown, event: SemanticEvent<unknown>): void;
}
interface DialogueMessage {
    from: string;
    to: string;
    text: string;
    tone: "concern" | "reflection" | "context" | "question" | "resolution";
    timestamp: number;
}
interface SceneObjects {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    nodes: THREE.Mesh[];
    lines: THREE.LineSegments;
}
declare function createScene(): SceneObjects;
declare function animate(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, nodes: THREE.Mesh[], lines: THREE.LineSegments): void;
declare function handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void;
declare function main(): void;
export { VisualizerAgent, createScene, animate, handleResize, main };
