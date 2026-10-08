import type { CirclePhysics, SquarePhysics } from "../classes/ShapePhysics";

export function resolveCircleCircleCollision(circle1: CirclePhysics, circle2: CirclePhysics) {
	const totalInv = circle1.invMass + circle2.invMass;

	if (totalInv === 0) {
		return null;
	}

	const dx = circle2.position.x - circle1.position.x;
	const dy = circle2.position.y - circle1.position.y;

	const distSq = dx ** 2 + dy ** 2 + 1e-8;

	const minDist = circle1.radius + circle2.radius;

	if (distSq > minDist ** 2) {
		return null;
	}

	console.log("ball to ball collision");

	const dist = Math.sqrt(distSq);

	const overlap = minDist - dist;

	const normalX = dx / dist;
	const normalY = dy / dist;

	circle1.position.x -= normalX * overlap * (circle1.invMass / totalInv);
	circle1.position.y -= normalY * overlap * (circle1.invMass / totalInv);
	circle2.position.x += normalX * overlap * (circle2.invMass / totalInv);
	circle2.position.y += normalY * overlap * (circle2.invMass / totalInv);

	const velAlongN = (circle2.velocity.x - circle1.velocity.x) * normalX + (circle2.velocity.y - circle1.velocity.y) * normalY;

	if (velAlongN > 0) {
		return;
	}

	const e = Math.min(circle1.bounce, circle2.bounce);
	const j = (-(1 + e) * velAlongN) / totalInv;

	circle1.velocity.x -= j * circle1.invMass * normalX;
	circle1.velocity.y -= j * circle1.invMass * normalY;
	circle2.velocity.x += j * circle2.invMass * normalX;
	circle2.velocity.y += j * circle2.invMass * normalY;
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
	const distSq = dx ** 2 + dy ** 2;

	if (distSq < radius ** 2) {
		console.log("ball to wall colision");

		const dist = Math.sqrt(distSq);

		const overlap = radius - dist;

		const normalX = dx / dist;
		const normalY = dy / dist;

		circle.position.x += normalX * overlap * circle.invMass;
		circle.position.y += normalY * overlap * circle.invMass;

		const velAlongN = circle.velocity.x * normalX + circle.velocity.y * normalY;

		if (velAlongN > 0) {
			return;
		}

		const j = -(1 + circle.bounce) * velAlongN;

		circle.velocity.x += j * normalX;
		circle.velocity.y += j * normalY;
	}
}
