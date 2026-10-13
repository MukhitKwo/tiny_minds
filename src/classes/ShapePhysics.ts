import { Vector2 } from "./Vector2";

export class CirclePhysics {
	position: Vector2;
	radius: number;
	velocity: Vector2;
	mass: number;
	bounce: number;
	decay: number;
	invMass: number;

	constructor(
		x: number,
		y: number,
		radius: number = 5,
		mass: number = 1,
		bounce: number = 0.99,
		decay: number = 0,
		velocity: Vector2 = new Vector2(0, 0),
	) {
		this.position = new Vector2(x, y);
		this.radius = radius;
		this.mass = mass;
		this.bounce = bounce;
		this.decay = decay;
		this.velocity = velocity;
		this.invMass = 1 / this.mass;
	}

	update(dt: number) {
		const frictionFactor = Math.exp(-this.decay * dt);
		this.velocity = this.velocity.scale(frictionFactor);

		if (this.velocity.magSq() < 0.01) {
			this.velocity = new Vector2(0, 0);
		}

		// this.velocity = this.velocity.add(new Vector2(0, 100 * dt));

		this.position = this.position.add(this.velocity.scale(dt));
	}
}
