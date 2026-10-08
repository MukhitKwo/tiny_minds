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

const ball1 = new CircleGraphic(app, 100, 400, 20);
const ball2 = new CircleGraphic(app, 600, 405, 20);

const wall1 = new SquareGraphic(app, 0, 0, 10, app.screen.height);
const wall2 = new SquareGraphic(app, 0, 0, app.screen.width, 10);
const wall3 = new SquareGraphic(app, app.screen.width - 10, 0, 20, app.screen.height);
const wall4 = new SquareGraphic(app, 0, app.screen.height - 10, app.screen.width, 20);

ball1.velocity = new Vector2(2000, 0);

app.ticker.add((ticker) => {
	// If your physics velocity is in units per second:
	const dtInSeconds = ticker.deltaMS / 1000;
	ball1.update(dtInSeconds);
	ball2.update(dtInSeconds);
	ball1.draw();
	ball2.draw();

	wall1.draw();
	wall2.draw();
	wall3.draw();
	wall4.draw();

	resolveCircleCircleCollision(ball1, ball2);
	resolveCircleSquareColision(ball2, wall3);
});
