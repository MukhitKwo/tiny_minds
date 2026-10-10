import { Vector2 } from "./Vector2";

export class CirclePhysics {
	position: Vector2;
	radius: number;
	velocity: Vector2;
	mass: number;
	bounce: number;
	decay: number = 0

	constructor(
		x: number,
		y: number,
		radius: number = 1,
		mass: number = 1,
		bounce: number = 1,
		velocity: Vector2 = new Vector2(0, 0),
	) {
		this.position = new Vector2(x, y);
		this.radius = radius;
		this.mass = mass;
		this.bounce = bounce;
		this.velocity = velocity;
	}

	update(dt: number) {
		const frictionFactor = Math.exp(-this.decay * dt);
		this.velocity = this.velocity.scale(frictionFactor);

		// Optional: Stop tiny micro-jitters when velocity is virtually zero
		if (this.velocity.magSq() < 0.01) {
			this.velocity = new Vector2(0, 0);
		}

		// this.velocity = this.velocity.add(new Vector2(0, 1000 * dt));

		// 2. Move position
		this.position = this.position.add(this.velocity.scale(dt));
	}
}

export class SquarePhysics {
	position: Vector2;
	width: number;
	height: number;

	constructor(x: number, y: number, width: number = 1, height: number = 1) {
		this.position = new Vector2(x, y);
		this.width = width;
		this.height = height;
	}
}