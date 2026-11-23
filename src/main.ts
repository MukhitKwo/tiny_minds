// Entry point: sets up the app and world, then wires the features together and runs the frame loop.

import "./style.css";
import { Application, Container } from "pixi.js";
import { BACKGROUND_COLOR } from "./constants/app";
import { BALL_COUNT, MAX_SIMULATION_STEP } from "./constants/balls";
import {
	COLLISION_LABEL_Y,
	DETECTION_LABEL_Y,
	FPS_LABEL_Y,
	HUD_FONT_SIZE,
	HUD_LABEL_X,
	HUD_UPDATE_INTERVAL_MS,
} from "./constants/hud";
import { WORLD_H, WORLD_W } from "./constants/world-generation";
import { createBalls } from "./features/balls/createBalls";
import { checkCircleCollision, collideWorldBounds } from "./features/collisions/collisions";
import { setupPanZoom } from "./features/camera/panZoom";
import { cellHead, cellNext, gridCols, gridRows, rebuildGrid, totalCells } from "./features/cells/grid";
import { createLabel, updateLabels } from "./features/hud/labels";
import { addRockLayer, generateRocks } from "./features/world-generation/rocks";
import { state } from "./shared/state";

const app = new Application();
await app.init({
	resizeTo: window,
	background: BACKGROUND_COLOR,
	antialias: true,
	resolution: window.devicePixelRatio,
	autoDensity: true,
});

document.body.appendChild(app.canvas);

const world = new Container();
app.stage.addChild(world);

console.log("Cols", gridCols);
console.log("Rows", gridRows);
console.log(`Total cells: ${totalCells}`);

const rocks = generateRocks();
addRockLayer(world, rocks);

const balls = createBalls(app, world, BALL_COUNT);

setupPanZoom(app, world);

let fpsTimer = 0;

const fpsLabel = createLabel(app, HUD_LABEL_X, FPS_LABEL_Y, HUD_FONT_SIZE, "FPS:");
const detectionLabel = createLabel(app, HUD_LABEL_X, DETECTION_LABEL_Y, HUD_FONT_SIZE, "Detections:");
const collisionLabel = createLabel(app, HUD_LABEL_X, COLLISION_LABEL_Y, HUD_FONT_SIZE, "Collisions:");

app.ticker.add((ticker) => {
	state.frames++;
	fpsTimer += ticker.deltaMS;
	if (fpsTimer >= HUD_UPDATE_INTERVAL_MS) {
		updateLabels(fpsLabel, detectionLabel, collisionLabel, fpsTimer);
		fpsTimer = 0;
	}

	const dt = Math.min(ticker.deltaMS / 1000, MAX_SIMULATION_STEP);

	for (const ball of balls) {
		ball.update(dt);
		ball.draw();
	}

	rebuildGrid(cellHead, balls, cellNext);

	for (let i = 0; i < balls.length; i++) {
		collideWorldBounds(balls[i], WORLD_W, WORLD_H);
		checkCircleCollision(i, balls, cellHead, cellNext, rocks);
	}
});
