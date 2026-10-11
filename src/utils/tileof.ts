import type { CircleGraphic } from "../classes/ShapeGraphic";
import type { CirclePhysics } from "../classes/ShapePhysics";
import { cellSize, cols, rows } from "../main";

export function tileOf(ball: CircleGraphic | CirclePhysics) {
	const cx = Math.min(Math.max((ball.position.x / cellSize) | 0, 0), cols - 1);
	const cy = Math.min(Math.max((ball.position.y / cellSize) | 0, 0), rows - 1);
	return { cx, cy };
}