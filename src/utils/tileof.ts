import type { CircleGraphic } from "../classes/ShapeGraphic";
import type { CirclePhysics } from "../classes/ShapePhysics";
import { cols, invCell, rows } from "../main";

export function tileOf(ball: CircleGraphic | CirclePhysics) {
	let cx = (ball.position.x * invCell) | 0;
	let cy = (ball.position.y * invCell) | 0;
	if (cx < 0) {
		cx = 0;
	} else if (cx >= cols) {
		cx = cols - 1;
	}
	if (cy < 0) {
		cy = 0;
	} else if (cy >= rows) {
		cy = rows - 1;
	}
	return cy * cols + cx;
}
