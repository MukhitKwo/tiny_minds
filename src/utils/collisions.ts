import type { CirclePhysics } from "../classes/ShapePhysics";

export function resolveCircles(a: CirclePhysics, b: CirclePhysics) {
	const dx = b.position.x - a.position.x;
	const dy = b.position.y - a.position.y;

	const dist = Math.hypot(dx, dy) + 1e-8; //TODO use Vector2 method

	const minDist = a.radius + b.radius;

	if (dist > minDist) {
		return;
	}

	const overlap = minDist - dist;

	const totalInv = a.invMass + b.invMass;

	if (totalInv === 0) {
		return;
	}

	const nx = dx / dist;
	const ny = dy / dist;

	// 1. separate
	a.position.x -= nx * overlap * (a.invMass / totalInv);
	a.position.y -= ny * overlap * (a.invMass / totalInv);
	b.position.x += nx * overlap * (b.invMass / totalInv);
	b.position.y += ny * overlap * (b.invMass / totalInv);

	// 2. bounce
	const velAlongN = (b.velocity.x - a.velocity.x) * nx + (b.velocity.y - a.velocity.y) * ny;
	
    if (velAlongN > 0) {
		return;
	}

	const e = Math.min(a.bounce, b.bounce);
	const j = (-(1 + e) * velAlongN) / totalInv;

	a.velocity.x -= j * a.invMass * nx;
	a.velocity.y -= j * a.invMass * ny;
	b.velocity.x += j * b.invMass * nx;
	b.velocity.y += j * b.invMass * ny;
}
