// Physics state for a ball: position, velocity, mass, and per-tick motion.

import {
	BALL_SLEEP_SPEED_SQ,
	PHYSICS_DEFAULT_BOUNCE,
	PHYSICS_DEFAULT_DECAY,
	PHYSICS_DEFAULT_MASS,
	PHYSICS_DEFAULT_RADIUS,
} from "../../constants/balls";
import { Vector2 } from "../../shared/vector2";

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
		radius: number = PHYSICS_DEFAULT_RADIUS,
		mass: number = PHYSICS_DEFAULT_MASS,
		bounce: number = PHYSICS_DEFAULT_BOUNCE,
		decay: number = PHYSICS_DEFAULT_DECAY,
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

	// TODO IMPROVEMENT: allocates new Vector2 objects for every ball on every tick; updating x/y in place would remove that GC pressure in the hot loop.
	update(dt: number) {
		const frictionFactor = Math.exp(-this.decay * dt);
		this.velocity = this.velocity.scale(frictionFactor);

		if (this.velocity.magSq() < BALL_SLEEP_SPEED_SQ) {
			this.velocity = new Vector2(0, 0);
		}

		this.position = this.position.add(this.velocity.scale(dt));
	}
}
