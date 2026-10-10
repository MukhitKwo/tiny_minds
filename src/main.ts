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

const cellSize = 10;

const cols = Math.ceil(app.screen.width / cellSize);
const rows = Math.ceil(app.screen.height / cellSize);

console.log("Cols", cols);
console.log("Rows", rows);

const totalCells = cols * rows;

console.log(`Total cells: ${totalCells}`);

const head = new Int32Array(totalCells).fill(-1);
const next = new Int32Array(1_000_000);

function getSurroundingCells(ball: CircleGraphic) {
	// const gridPosition = calculateBallGridPosition(ball);

	const cx = (ball.position.x / cellSize) | 0;
	const cy = (ball.position.y / cellSize) | 0;

	const surrounding = [];

	for (let ny = Math.max(cy - 1, 0); ny <= Math.min(cy + 1, rows - 1); ny++) {
		for (let nx = Math.max(cx - 1, 0); nx <= Math.min(cx + 1, cols - 1); nx++) {
			surrounding.push(ny * cols + nx);
		}
	}

	// console.log(surrounding);

	return surrounding;
}

const balls: CircleGraphic[] = [];

for (let i = 0; i < 3; i++) {
	const x = 80 + Math.random() * (app.screen.width - 100);
	const y = 80 + Math.random() * (app.screen.height - 100);
	const randomBall = new CircleGraphic(app, x, y, 5);
	randomBall.velocity = new Vector2((Math.random() - 0.5) * 0, (Math.random() - 0.5) * 0);
	balls.push(randomBall);
}

balls.forEach((ball, index) => {
	const cx = (ball.position.x / cellSize) | 0;
	const cy = (ball.position.y / cellSize) | 0;

	const gridPosition = cy * cols + cx;

	// get the current head value at the grid position and store it in next[ball_index
	next[index] = head[gridPosition];
	
	// update the head to have the index of ball and next
	head[gridPosition] = index;
});

console.log(head);


const wall1 = new SquareGraphic(app, -20, 0, 20, app.screen.height);
const wall2 = new SquareGraphic(app, 0, -20, app.screen.width, 20);
const wall3 = new SquareGraphic(app, app.screen.width, 0, 20, app.screen.height);
const wall4 = new SquareGraphic(app, 0, app.screen.height, app.screen.width, 20);

const walls: SquareGraphic[] = [wall1, wall2, wall3, wall4];

getSurroundingCells(balls[0]);

app.ticker.add((ticker) => {
	// console.log(app.ticker.FPS | 0);

	const dtInSeconds = ticker.deltaMS / 1000;

	for (const ballA of balls) {
		for (const ballB of balls) {
			if (ballA !== ballB) {
				resolveCircleCircleCollision(ballA, ballB);
			}
		}
	}

	for (const ball of balls) {
		for (const wall of walls) {
			resolveCircleSquareColision(ball, wall);
		}
	}

	for (const ball of balls) {
		ball.update(dtInSeconds);
		ball.draw();
	}

	for (const wall of walls) {
		wall.draw();
	}
});
