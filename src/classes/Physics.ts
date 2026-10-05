export class Vector2 {
	x: number;
	y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	add(v: Vector2): Vector2 {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	sub(v: Vector2): Vector2 {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	scale(scalar: number): Vector2 {
		return new Vector2(this.x * scalar, this.y * scalar);
	}

	magSq(): number {
		return this.x * this.x + this.y * this.y;
	}

	mag(): number {
		return Math.sqrt(this.magSq());
	}

	normalize(): Vector2 {
		const m = this.mag();
		return m === 0 ? new Vector2() : new Vector2(this.x / m, this.y / m);
	}

	dot(v: Vector2): number {
		return this.x * v.x + this.y * v.y;
	}
}

export class CirclePhysics {
	position: Vector2;
	radius: number;
	velocity: Vector2;
	mass: number;
	bounce: number;
	invMass: number = 1;
	decay: number = 0.99

	// Ball A (cart) has mass = 1. Ball B (truck) has mass = 9. Overlap is 10 pixels.
	// Cart (A): invMass = 1 / 1 = 1.0
	// Truck (B): invMass = 1 / 9 ≈ 0.111
	// totalInvMass = 1.0 + 0.111 = 1.111
	// Cart (A) moves:
	// 10 * (1.0 / 1.111) = 9px backward
	// Truck (B) moves:
	// 10 * (0.111 / 1.111) = 1px forward

	constructor(
		x: number,
		y: number,
		radius: number = 1,
		mass: number = 1,
		velocity: Vector2 = new Vector2(0, 0),
		bounce: number = 0.9,
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
			this.velocity = new Vector2(Math.random() * 1000 - 50, Math.random() * 1000 - 50);
		}

		// 2. Move position
		this.position = this.position.add(this.velocity.scale(dt));
	}
}
