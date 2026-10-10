import type { CirclePhysics, SquarePhysics } from "../classes/ShapePhysics";

export function resolveCircleCircleCollision(circle1: CirclePhysics, circle2: CirclePhysics) {
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

	// Each circle moves half the overlap
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

export function resolveCircleSquareColision(circle: CirclePhysics, wall: SquarePhysics) {
	const radius = circle.radius;

	// returns either left side x, right side x, or circle position x
	const px = Math.max(wall.position.x, Math.min(circle.position.x, wall.position.x + wall.width));
	const py = Math.max(wall.position.y, Math.min(circle.position.y, wall.position.y + wall.height));

	// if px is the circle x, it will return 0
	const dx = circle.position.x - px;
	const dy = circle.position.y - py;

	// 0 ** 2 is 0, so it ignores it
	const distSq = dx * dx + dy * dy;

	if (distSq < radius ** 2) {
		const dist = Math.sqrt(distSq) + 1e-8;

		const overlap = radius - dist;

		const normalX = dx / dist;
		const normalY = dy / dist;

		circle.position.x += normalX * overlap;
		circle.position.y += normalY * overlap;

		const velAlongN = circle.velocity.x * normalX + circle.velocity.y * normalY;

		if (velAlongN > 0) {
			return;
		}

		const j = -(1 + circle.bounce) * velAlongN;

		circle.velocity.x += j * normalX;
		circle.velocity.y += j * normalY;
	}
}

export function collideWorldBounds(c: CirclePhysics, W: number, H: number) {
	const r = c.radius;

	if (c.position.x < r) {
		c.position.x = r;
		if (c.velocity.x < 0) c.velocity.x *= -c.bounce;
	} else if (c.position.x > W - r) {
		c.position.x = W - r;
		if (c.velocity.x > 0) c.velocity.x *= -c.bounce;
	}

	if (c.position.y < r) {
		c.position.y = r;
		if (c.velocity.y < 0) c.velocity.y *= -c.bounce;
	} else if (c.position.y > H - r) {
		c.position.y = H - r;
		if (c.velocity.y > 0) c.velocity.y *= -c.bounce;
	}
}