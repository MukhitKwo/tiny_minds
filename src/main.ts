import "./style.css";
import { CircleGraphic, SquareGraphic } from "./classes/ShapeGraphic";
import { checkCollision, collideWorldBounds } from "./utils/collisions";
import { Application } from "pixi.js";
import { createBalls, createWalls } from "./utils/create";
import { rebuildGrid } from "./utils/grid";

const app = new Application();
await app.init({
	resizeTo: window,
	background: "#1e1e2e",
	antialias: true,
	resolution: window.devicePixelRatio,
	autoDensity: true,
});

document.body.appendChild(app.canvas);

export const cellSize = 4; //TODO make dynamic

export const cols = Math.ceil(app.screen.width / cellSize);
export const rows = Math.ceil(app.screen.height / cellSize);
export const totalCells = cols * rows;

console.log("Cols", cols);
console.log("Rows", rows);
console.log(`Total cells: ${totalCells}`);

const head = new Int32Array(totalCells).fill(-1);
const next = new Int32Array(1_000_000);

const balls: CircleGraphic[] = createBalls(app, 64000);
const walls: SquareGraphic[] = createWalls(app);

let fpsTimer = 0;

app.ticker.add((ticker) => {
	fpsTimer += ticker.deltaMS;
	if (fpsTimer >= 1000) {
		console.log(ticker.FPS | 0);
		fpsTimer = 0;
	}

	const dt = Math.min(ticker.deltaMS / 1000, 1 / 30);

	for (const ball of balls) {
		ball.update(dt);
		ball.draw();
	}
	
	rebuildGrid(head, balls, next, cols);
	
	for (let i = 0; i < balls.length; i++) {
		collideWorldBounds(balls[i], app.screen.width, app.screen.height);
		checkCollision(i, balls, head, next);
	}

	for (const wall of walls) {
		wall.draw();
	}
});
