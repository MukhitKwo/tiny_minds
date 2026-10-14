import { Application, Container, Graphics, ParticleContainer } from "pixi.js";
import { CircleGraphic, SquareGraphic } from "../classes/ShapeGraphic";
import { Vector2 } from "../classes/Vector2";
import { randomRadius } from "./random";
import { WORLD_W, WORLD_H } from "../main";

export function createBalls(app: Application, world: Container, count: number) {

	const circleTex = app.renderer.generateTexture(
		new Graphics().circle(0, 0, 32 / 2).fill(0xffffff), // white, so tint works
	);

	const particles = new ParticleContainer({
		dynamicProperties: { position: true, vertex: true, color: true },
	});
	world.addChild(particles);

	const balls: CircleGraphic[] = [];

	for (let i = 0; i < count; i++) {
		const x = Math.random() * WORLD_W;
		const y = Math.random() * WORLD_H;
		const radius = randomRadius();
		const mass = radius * radius * Math.PI;
		const randomBall = new CircleGraphic(particles, circleTex, x, y, radius, mass);
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


