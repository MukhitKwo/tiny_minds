import { Application, Graphics, ParticleContainer } from "pixi.js";
import { CircleGraphic, SquareGraphic } from "../classes/ShapeGraphic";
import { Vector2 } from "../classes/Vector2";

export function createBalls(app: Application, count: number) {

	const circleTex = app.renderer.generateTexture(
		new Graphics().circle(0, 0, 32 / 2).fill(0xffffff), // white, so tint works
	);

	const container = new ParticleContainer({
		dynamicProperties: { position: true, vertex: true, color: true },
	});
	app.stage.addChild(container);

	const balls: CircleGraphic[] = [];

	for (let i = 0; i < count; i++) {
		const x = Math.random() * app.screen.width;
		const y = Math.random() * app.screen.height;
		const radius = Math.random() * 8 + 2;
		const mass = radius * radius * Math.PI;
		const randomBall = new CircleGraphic(container, circleTex, x, y, radius, mass);
		randomBall.velocity = new Vector2((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
		balls.push(randomBall);
	}

	return balls;
}

export function createWalls(app: Application) {
	return [
		new SquareGraphic(app, -20, 0, 20, app.screen.height),
		new SquareGraphic(app, 0, -20, app.screen.width, 20),
		new SquareGraphic(app, app.screen.width, 0, 20, app.screen.height),
		new SquareGraphic(app, 0, app.screen.height, app.screen.width, 20),
	];
}


