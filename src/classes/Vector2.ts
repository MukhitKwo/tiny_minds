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
		return this.x ** 2 + this.y ** 2;
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