import { Vector2 } from "./Vector2";

export class CirclePhysics {
	position: Vector2;
	radius: number;
	velocity: Vector2;
	mass: number;
	bounce: number;
	invMass: number = 1;
	decay: number = 0

	constructor(
		x: number,
		y: number,
		radius: number,
		mass: number = 1,
		velocity: Vector2 = new Vector2(0, 0),
		bounce: number = 1,
	) {
		this.position = new Vector2(x, y);
		this.radius = radius;
		this.velocity = velocity;
		this.mass = mass;
		this.bounce = bounce;
	}

	update(dt: number) {
		// If invMass is 0, it's an immovable wall/bumper
		if (this.invMass === 0) return;

		const frictionFactor = Math.exp(-this.decay * dt);
		this.velocity = this.velocity.scale(frictionFactor);

		// Optional: Stop tiny micro-jitters when velocity is virtually zero
		if (this.velocity.magSq() < 0.01) {
			this.velocity = new Vector2(0, 0);
		}

		// 2. Move position
		this.position = this.position.add(this.velocity.scale(dt));
	}
}

export class SquarePhysics {
	position: Vector2;
	width: number;
	height: number;
	mass: number;
	bounce: number;
	invMass: number = 0;
	static: boolean = true;

	constructor(x: number, y: number, width: number = 1, height: number = 1, mass: number = 1, bounce: number = 1) {
		this.position = new Vector2(x, y);
		this.width = width;
		this.height = height;
		this.mass = mass;
		this.bounce = bounce;
	}
}