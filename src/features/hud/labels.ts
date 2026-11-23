// On-screen FPS, detection, and collision labels.

import { Application, Text } from "pixi.js";
import {
	HUD_FONT_COLOR,
	HUD_FONT_FAMILY,
	LABEL_DEFAULT_FONT_SIZE,
	LABEL_DEFAULT_TEXT,
} from "../../constants/hud";
import { state } from "../../shared/state";

export function createLabel(app: Application, x: number, y: number, fontSize = LABEL_DEFAULT_FONT_SIZE, text = LABEL_DEFAULT_TEXT) {
	const label = new Text({
		text: text,
		style: {
			fontFamily: HUD_FONT_FAMILY,
			fontSize: fontSize,
			fill: HUD_FONT_COLOR,
		},
	});

	label.position.set(x, y);
	app.stage.addChild(label);
	return label;
}

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
