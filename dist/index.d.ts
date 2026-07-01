/**
 * mozaik-treejs — Cultural-appropriation dialogue simulation
 *
 * Uses @mozaik-ai/core to run a fixed script about cultural appropriation
 * among five perspectives (source-community, artist, curator, audience,
 * mediator) and visualises the communication with three.js.
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
declare function createScene(): {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
};
declare function animate(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void;
declare function main(): void;
export { DialogueAgent, createScene, animate, main };
export type { DialogueMessage };
