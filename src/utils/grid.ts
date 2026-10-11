import type { CircleGraphic } from "../classes/ShapeGraphic";
import { tileOf } from "./tileof";

export function rebuildGrid(head: Int32Array, balls: CircleGraphic[], next: Int32Array) {

    head.fill(-1);
    for (let index = 0; index < balls.length; index++) {
        const ball = balls[index];
        
        const gridPosition = tileOf(ball);

        // get the current head value at the grid position and store it in next[ball_index
        next[index] = head[gridPosition];

        // update the head to have the index of ball and next
        head[gridPosition] = index;
    }
}
