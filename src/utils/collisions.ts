import type { CirclePhysics } from "../classes/ShapePhysics";
import { cellSize, cols, invCell, rows } from "../main";
import { state } from "./state";

export function resolveCircleToCircleCollision(circle1: CirclePhysics, circle2: CirclePhysics) {
	const dx = circle2.position.x - circle1.position.x;
	const dy = circle2.position.y - circle1.position.y;

	const distSq = dx ** 2 + dy ** 2;

	const minDist = circle1.radius + circle2.radius;

	state.detectionCount++;

	if (distSq > minDist ** 2) {
		return null;
	}

	state.collisionCount++;

	const dist = Math.sqrt(distSq) + 1e-8;
	const inv = 1 / dist;
	const normalX = dx * inv;
	const normalY = dy * inv;

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

	const im1 = circle1.invMass;
	const im2 = circle2.invMass;

	const j = (-(1 + e) * velAlongN) / (im1 + im2);

	const jx = j * normalX;
	const jy = j * normalY;

	circle1.velocity.x -= jx * im1;
	circle1.velocity.y -= jy * im1;
	circle2.velocity.x += jx * im2;
	circle2.velocity.y += jy * im2;
}

export function checkCircleCollision(b: number, balls: CirclePhysics[], head: Int32Array, next: Int32Array, rocks: Int32Array) {
	const ball = balls[b];
	const r = ball.radius;

	// which cell is the ball in
	let cx = (ball.position.x * invCell) | 0;
	let cy = (ball.position.y * invCell) | 0;

	// how far to search around that cell
	const range = Math.ceil(r * 2 * invCell - 1e-6);

	// define how far to search in the grid for potential collisions
	const x0 = cx - range < 0 ? 0 : cx - range;
	const x1 = cx + range >= cols ? cols - 1 : cx + range;
	const y0 = cy - range < 0 ? 0 : cy - range;
	const y1 = cy + range >= rows ? rows - 1 : cy + range;

	for (let ny = y0; ny <= y1; ny++) {
		const row = ny * cols;
		for (let nx = x0; nx <= x1; nx++) {
			const cellIndex = row + nx;

			for (let j = rocks[cellIndex]; j !== -1; j = next[j]) {
				const rock = rocks[cellIndex];

				if (rock === 1) {

					state.detectionCount++;

					const px = ball.position.x;
					const py = ball.position.y;
					const left = nx * cellSize;
					const top = ny * cellSize;
					const qx = Math.max(left, Math.min(px, left + cellSize));
					const qy = Math.max(top, Math.min(py, top + cellSize));
					const dx = px - qx;
					const dy = py - qy;
					const touching = dx * dx + dy * dy < r * r;

					if (touching) {
						state.collisionCount++;
					}
				}
			}

			for (let j = head[cellIndex]; j !== -1; j = next[j]) {
				if (j === b) continue;
				const other = balls[j];
				const or = other.radius;
				if (or > r || (or === r && j < b)) continue;
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
