import type { Text } from "pixi.js";

export const state = {
	frames: 0,
	collisionCount: 0,
	detectionCount: 0,
};

export function updateLabels(fpsLabel: Text, detectionLabel: Text, collisionLabel: Text, fpsTimer: number) {
	const fps = (state.frames * 1000) / fpsTimer;
	const avgMs = fpsTimer / state.frames;
	fpsLabel.text = `FPS: ${fps.toFixed(0)} (${avgMs.toFixed(2)} ms)`;
	detectionLabel.text = `Detections: ${(state.detectionCount / state.frames) | 0}`;
	collisionLabel.text = `Collisions: ${(state.collisionCount / state.frames) | 0}`;
	state.detectionCount = 0;
	state.collisionCount = 0;
	state.frames = 0;
	
}
