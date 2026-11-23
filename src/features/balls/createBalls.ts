// Creates the balls with random positions, radii, and velocities.

import { Application, Container, Graphics, ParticleContainer } from "pixi.js";
import { BALL_INITIAL_SPEED, BALL_TEXTURE_SIZE } from "../../constants/balls";
import { WORLD_H, WORLD_W } from "../../constants/world-generation";
import { Vector2 } from "../../shared/vector2";
import { CircleGraphic } from "./circleGraphic";
import { randomRadius } from "./random";

export function createBalls(app: Application, world: Container, count: number) {
	const circleTex = app.renderer.generateTexture(
		new Graphics().circle(0, 0, BALL_TEXTURE_SIZE / 2).fill(0xffffff), // white, so tint works
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
		randomBall.velocity = new Vector2((Math.random() - 0.5) * BALL_INITIAL_SPEED, (Math.random() - 0.5) * BALL_INITIAL_SPEED);
		balls.push(randomBall);
	}

	return balls;
}
