// Uniform spatial grid over the world, used to find nearby balls cheaply.

import { CELL_NEXT_CAPACITY, CELL_SIZE } from "../../constants/cells";
import { WORLD_H, WORLD_W } from "../../constants/world-generation";
import type { CirclePhysics } from "../balls/circlePhysics";
import type { CircleGraphic } from "../balls/circleGraphic";

export const invCellSize = 1 / CELL_SIZE;

export const gridCols = Math.ceil(WORLD_W / CELL_SIZE);
export const gridRows = Math.ceil(WORLD_H / CELL_SIZE);
export const totalCells = gridCols * gridRows;

export const cellHead = new Int32Array(totalCells).fill(-1);
// TODO BUG: cellNext has a fixed 1,000,000 entries that are not tied to BALL_COUNT; writes past the end are silently dropped.
export const cellNext = new Int32Array(CELL_NEXT_CAPACITY);

export function tileOf(ball: CircleGraphic | CirclePhysics) {
	let cx = (ball.position.x * invCellSize) | 0;
	let cy = (ball.position.y * invCellSize) | 0;
	if (cx < 0) {
		cx = 0;
	} else if (cx >= gridCols) {
		cx = gridCols - 1;
	}
	if (cy < 0) {
		cy = 0;
	} else if (cy >= gridRows) {
		cy = gridRows - 1;
	}
	return cy * gridCols + cx;
}

export function rebuildGrid(head: Int32Array, balls: CircleGraphic[], next: Int32Array) {
	head.fill(-1);
	for (let index = 0; index < balls.length; index++) {
		const ball = balls[index];

		const gridPosition = tileOf(ball);

		// get the current head value at the grid position and store it in next[ball_index]
		next[index] = head[gridPosition];

		// update the head to have the index of ball and next
		head[gridPosition] = index;
	}
}
