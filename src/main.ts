import "./style.css";
import { CircleGraphic } from "./classes/ShapeGraphic";
import { checkCircleCollision, collideWorldBounds } from "./utils/collisions";
import { Application, Container } from "pixi.js";
import { createBalls } from "./utils/create";
import { rebuildGrid } from "./utils/grid";
import { colorByDirection } from "./utils/colors";

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

const worldWidth = app.screen.width;
const worldHeight = app.screen.height;

export const cellSize = 10;
export const invCell = 1 / cellSize;

export const cols = Math.ceil(app.screen.width / cellSize);
export const rows = Math.ceil(app.screen.height / cellSize);
export const totalCells = cols * rows;

console.log("Cols", cols);
console.log("Rows", rows);
console.log(`Total cells: ${totalCells}`);

const head = new Int32Array(totalCells).fill(-1);
const next = new Int32Array(1_000_000);

const balls: CircleGraphic[] = createBalls(app, world, 8000);
// const walls: SquareGraphic[] = createWalls(app);

let fpsTimer = 0;

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

app.canvas.addEventListener("wheel", (e) => {
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
}, { passive: false });


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

	rebuildGrid(head, balls, next);

	for (let i = 0; i < balls.length; i++) {
		collideWorldBounds(balls[i], worldWidth, worldHeight);
		checkCircleCollision(i, balls, head, next);
		// colorByDirection(i, balls);
	}

	// for (const wall of walls) {
	// 	wall.draw();
	// }
});
