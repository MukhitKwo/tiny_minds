import "./style.css";
import { CircleGraphic } from "./classes/ShapeGraphic";
import { checkCircleCollision, collideWorldBounds } from "./utils/collisions";
import { Application, Container } from "pixi.js";
import { createBalls } from "./utils/create";
import { rebuildGrid } from "./utils/grid";
import { createLabel } from "./utils/text";
import { state, updateLabels } from "./utils/state";

const app = new Application();
await app.init({
	resizeTo: window,
	background: "#1e1e2e",
	antialias: true,
	resolution: window.devicePixelRatio,
	autoDensity: true,
});

document.body.appendChild(app.canvas);

const world = new Container();
app.stage.addChild(world);

export const WORLD_W = 20000;
export const WORLD_H = 20000;

export const cellSize = 20;
export const invCell = 1 / cellSize;

export const cols = Math.ceil(WORLD_W / cellSize);
export const rows = Math.ceil(WORLD_H / cellSize);
export const totalCells = cols * rows;

console.log("Cols", cols);
console.log("Rows", rows);
console.log(`Total cells: ${totalCells}`);

const head = new Int32Array(totalCells).fill(-1);
const next = new Int32Array(1_000_000);

const balls: CircleGraphic[] = createBalls(app, world, 50000);

let dragging = false;
let lastX = 0;
let lastY = 0;

app.canvas.addEventListener("pointerdown", (e) => {
	dragging = true;
	lastX = e.clientX;
	lastY = e.clientY;
});

window.addEventListener("pointermove", (e) => {
	if (!dragging) return;
	world.x += e.clientX - lastX;
	world.y += e.clientY - lastY;
	lastX = e.clientX;
	lastY = e.clientY;
});

window.addEventListener("pointerup", () => (dragging = false));

app.canvas.addEventListener(
	"wheel",
	(e) => {
		e.preventDefault();

		const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
		const newScale = Math.min(10, Math.max(0.05, world.scale.x * factor));

		// world point under the cursor, before zooming
		const worldX = (e.offsetX - world.x) / world.scale.x;
		const worldY = (e.offsetY - world.y) / world.scale.y;

		world.scale.set(newScale);

		// move the world so that same point is under the cursor again
		world.x = e.offsetX - worldX * newScale;
		world.y = e.offsetY - worldY * newScale;
	},
	{ passive: false },
);

let fpsTimer = 0;

const fpsLabel = createLabel(app, 10, 10, 18, "FPS:");
const detectionLabel = createLabel(app, 10, 30, 18, "Detections:");
const collisionLabel = createLabel(app, 10, 50, 18, "Collisions:");

app.ticker.add((ticker) => {

	state.frames++;
	fpsTimer += ticker.deltaMS;
	if (fpsTimer >= 100) {
		updateLabels(fpsLabel, detectionLabel, collisionLabel, fpsTimer);
		fpsTimer = 0;
	}

	const dt = Math.min(ticker.deltaMS / 1000, 1 / 30);

	for (const ball of balls) {
		ball.update(dt);
		ball.draw();
	}

	rebuildGrid(head, balls, next);

	for (let i = 0; i < balls.length; i++) {
		collideWorldBounds(balls[i], WORLD_W, WORLD_H);
		checkCircleCollision(i, balls, head, next);
	}
});
