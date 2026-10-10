import { CircleGraphic, SquareGraphic } from "./classes/ShapeGraphic";
import { Vector2 } from "./classes/Vector2";
import "./style.css";
import { Application } from "pixi.js";
import { resolveCircleCircleCollision, resolveCircleSquareColision } from "./utils/collisions";

const app = new Application();
await app.init({
	resizeTo: window,
	background: "#1e1e2e",
	antialias: true,
	resolution: window.devicePixelRatio,
	autoDensity: true,
});
document.body.appendChild(app.canvas);

const cellSize = 3; //TODO make dynamic

const cols = Math.ceil(app.screen.width / cellSize);
const rows = Math.ceil(app.screen.height / cellSize);

console.log("Cols", cols);
console.log("Rows", rows);

const totalCells = cols * rows;

console.log(`Total cells: ${totalCells}`);

const head = new Int32Array(totalCells).fill(-1);
const next = new Int32Array(1_000_000);

function tileOf(ball: CircleGraphic) {
	const cx = Math.min(Math.max((ball.position.x / cellSize) | 0, 0), cols - 1);
	const cy = Math.min(Math.max((ball.position.y / cellSize) | 0, 0), rows - 1);
	return { cx, cy };
}

function checkCollision(b: number) {
	const ball = balls[b];

	const { cx, cy } = tileOf(ball);

	for (let ny = Math.max(cy - 1, 0); ny <= Math.min(cy + 1, rows - 1); ny++) {
		for (let nx = Math.max(cx - 1, 0); nx <= Math.min(cx + 1, cols - 1); nx++) {
			const t = ny * cols + nx;

			for (let j = head[t]; j !== -1; j = next[j]) {
				const other = balls[j];

				if (j <= b) continue;

				resolveCircleCircleCollision(ball, other);
			}
		}
	}
}

const balls: CircleGraphic[] = [];

for (let i = 0; i < 30000; i++) {
	const x = 80 + Math.random() * (app.screen.width - 100);
	const y = 80 + Math.random() * (app.screen.height - 100);
	const randomBall = new CircleGraphic(app, x, y, 1);
	randomBall.velocity = new Vector2((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
	balls.push(randomBall);
}

function rebuildGrid() {
	head.fill(-1);
	balls.forEach((ball, index) => {
		const { cx, cy } = tileOf(ball);

		const gridPosition = cy * cols + cx;

		// get the current head value at the grid position and store it in next[ball_index
		next[index] = head[gridPosition];

		// update the head to have the index of ball and next
		head[gridPosition] = index;
	});
}

const wall1 = new SquareGraphic(app, -20, 0, 20, app.screen.height);
const wall2 = new SquareGraphic(app, 0, -20, app.screen.width, 20);
const wall3 = new SquareGraphic(app, app.screen.width, 0, 20, app.screen.height);
const wall4 = new SquareGraphic(app, 0, app.screen.height, app.screen.width, 20);

const walls: SquareGraphic[] = [wall1, wall2, wall3, wall4];

let fpsTimer = 0;

app.ticker.add((ticker) => {
	
	fpsTimer += ticker.deltaMS;
	if (fpsTimer >= 1000) {
		console.log(ticker.FPS | 0);
		fpsTimer -= 1000;
	}

	const dt = Math.min(ticker.deltaMS / 1000, 1 / 30);

	for (const ball of balls) {
		ball.update(dt);
		ball.draw();
	}

	rebuildGrid();

	for (let i = 0; i < balls.length; i++) {
		checkCollision(i);
	}

	for (const ball of balls) {
		for (const wall of walls) {
			resolveCircleSquareColision(ball, wall);
		}
	}

	for (const wall of walls) {
		wall.draw();
	}
});
