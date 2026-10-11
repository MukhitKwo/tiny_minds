import type { CirclePhysics } from "../classes/ShapePhysics";
import { tileOf } from "./tileof";

export function resolveCircleToCircleCollision(circle1: CirclePhysics, circle2: CirclePhysics) {
	const dx = circle2.position.x - circle1.position.x;
	const dy = circle2.position.y - circle1.position.y;

	const distSq = dx ** 2 + dy ** 2;

	const minDist = circle1.radius + circle2.radius;

	if (distSq > minDist ** 2) {
		return null;
	}

	const dist = Math.sqrt(distSq) + 1e-8;
	const normalX = dx / dist;
	const normalY = dy / dist;

	const push = (minDist - dist) * 0.5;

	circle1.position.x -= normalX * push;
	circle1.position.y -= normalY * push;
	circle2.position.x += normalX * push;
	circle2.position.y += normalY * push;

	const velAlongN = (circle2.velocity.x - circle1.velocity.x) * normalX + (circle2.velocity.y - circle1.velocity.y) * normalY;

	if (velAlongN > 0) {
		return;
	}

	const e = Math.min(circle1.bounce, circle2.bounce);
	const j = (-(1 + e) * velAlongN) / 2;

	circle1.velocity.x -= j * normalX;
	circle1.velocity.y -= j * normalY;
	circle2.velocity.x += j * normalX;
	circle2.velocity.y += j * normalY;
}

export function checkCollision(b: number, balls: CirclePhysics[], head: Int32Array, next: Int32Array, cols: number, rows: number) {
	const ball = balls[b];

	const { cx, cy } = tileOf(ball);

	for (let ny = Math.max(cy - 1, 0); ny <= Math.min(cy + 1, rows - 1); ny++) {
		for (let nx = Math.max(cx - 1, 0); nx <= Math.min(cx + 1, cols - 1); nx++) {
			const t = ny * cols + nx;

			for (let j = head[t]; j !== -1; j = next[j]) {
				const other = balls[j];

				if (j <= b) continue;

				resolveCircleToCircleCollision(ball, other);
			}
		}
	}
}

export function collideWorldBounds(c: CirclePhysics, W: number, H: number) {
	const r = c.radius;

	if (c.position.x < r) {
		c.position.x = r;
		if (c.velocity.x < 0) {
			c.velocity.x *= -c.bounce;
		}
	} else if (c.position.x > W - r) {
		c.position.x = W - r;
		if (c.velocity.x > 0) {
			c.velocity.x *= -c.bounce;
		}
	}

	if (c.position.y < r) {
		c.position.y = r;
		if (c.velocity.y < 0) {
			c.velocity.y *= -c.bounce;
		}
	} else if (c.position.y > H - r) {
		c.position.y = H - r;
		if (c.velocity.y > 0) {
			c.velocity.y *= -c.bounce;
		}
	}
}
