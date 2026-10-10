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

const balls: CircleGraphic[] = [];

for (let i = 0; i < 32768; i++) {
	const x = 80 + Math.random() * (app.screen.width - 160);
	const y = 80 + Math.random() * (app.screen.height - 160);
	const randomBall = new CircleGraphic(app, x, y, 5);
	randomBall.velocity = new Vector2(
		(Math.random() - 0.5) * 100,
		(Math.random() - 0.5) * 100,
	);
	balls.push(randomBall);
}

const wall1 = new SquareGraphic(app, 0, 0, 10, app.screen.height);
const wall2 = new SquareGraphic(app, 0, 0, app.screen.width, 10);
const wall3 = new SquareGraphic(app, app.screen.width - 10, 0, 20, app.screen.height);
const wall4 = new SquareGraphic(app, 0, app.screen.height - 10, app.screen.width, 20);

const walls: SquareGraphic[] = [wall1, wall2, wall3, wall4];

balls[0].velocity = new Vector2(3000, 0);

app.ticker.add((ticker) => {
	console.log(app.ticker.FPS);
	// If your physics velocity is in units per second:
	const dtInSeconds = ticker.deltaMS / 1000;

	// for (const ballA of balls) {
	// 	for (const ballB of balls) {
	// 		if (ballA !== ballB) {
	// 			resolveCircleCircleCollision(ballA, ballB);
	// 		}
	// 	}
	// }

	for (const ball of balls) {
		for (const wall of walls) {
			resolveCircleSquareColision(ball, wall);
		}
	}

	for (const wall of walls) {
		wall.draw();
	}

	for (const ball of balls) {
		ball.update(dtInSeconds);
		ball.draw();
	}
});
