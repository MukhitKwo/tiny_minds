import type { CirclePhysics, SquarePhysics } from "../classes/ShapePhysics";

export function resolveCircles(a: CirclePhysics, b: CirclePhysics) {
	const dx = b.position.x - a.position.x;
	const dy = b.position.y - a.position.y;

	const dist = Math.hypot(dx, dy) + 1e-8; //TODO use squared to avoid division

	const minDist = a.radius + b.radius;

	if (dist > minDist) {
		return null;
	}

	const overlap = minDist - dist;

	const totalInv = a.invMass + b.invMass;

	if (totalInv === 0) {
		return null;
	}

	const normalX = dx / dist;
	const normalY = dy / dist;

	// 1. separate
	a.position.x -= normalX * overlap * (a.invMass / totalInv);
	a.position.y -= normalY * overlap * (a.invMass / totalInv);
	b.position.x += normalX * overlap * (b.invMass / totalInv);
	b.position.y += normalY * overlap * (b.invMass / totalInv);

	// 2. bounce
	const velAlongN = (b.velocity.x - a.velocity.x) * normalX + (b.velocity.y - a.velocity.y) * normalY;

	if (velAlongN > 0) {
		return;
	}

	const e = Math.min(a.bounce, b.bounce);
	const j = (-(1 + e) * velAlongN) / totalInv;

	a.velocity.x -= j * a.invMass * normalX;
	a.velocity.y -= j * a.invMass * normalY;
	b.velocity.x += j * b.invMass * normalX;
	b.velocity.y += j * b.invMass * normalY;
}

export function resolveCircleSquareColision(circle: CirclePhysics, wall: SquarePhysics) {
	const radius = circle.radius;

	const px = Math.max(wall.position.x, Math.min(circle.position.x, wall.position.x + wall.width));
	const py = Math.max(wall.position.y, Math.min(circle.position.y, wall.position.y + wall.height));

	const dx = circle.position.x - px;
	const dy = circle.position.y - py;
	const distSq = dx * dx + dy * dy;

	if (distSq < radius * radius) {
		console.log("colision");
	}
}
