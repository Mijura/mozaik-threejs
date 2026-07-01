/**
 * mozaik-treejs — Communication network visualization using three.js
 * and @mozaik-ai/core.
 *
 * Replaces the original spinning cube demo with a spherical participant
 * node layout, connection lines, and animated communication visuals.
 */
import * as THREE from "three";
import { BaseParticipant, SemanticEvent } from "@mozaik-ai/core";
declare class VisualizerAgent extends BaseParticipant {
    private readonly label;
    constructor(label: string);
    onJoined(): void;
    onMessage(message: string): void;
    onInternalEvent(event: SemanticEvent<unknown>): void;
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
