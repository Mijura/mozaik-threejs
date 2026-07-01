/**
 * mozaik-treejs — A small example combining three.js visualization
 * with @mozaik-ai/core reactive agents.
 *
 * Spinning cube scene + an agent that logs lifecycle events to the
 * browser console (or Node stdout if run headless).
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
declare function createScene(): {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    cube: THREE.Mesh;
};
declare function animate(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, cube: THREE.Mesh): void;
declare function main(): void;
export { VisualizerAgent, createScene, animate, main };
