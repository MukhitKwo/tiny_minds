import { Color } from "pixi.js";
import type { CircleGraphic } from "../classes/ShapeGraphic";

export function colorByDirection(i: number, balls: CircleGraphic[]) {
	const ball = balls[i];
    
	const angle = Math.atan2(ball.velocity.y, ball.velocity.x);
	const hue = ((angle / (2 * Math.PI)) * 360 + 360) % 360;
    
	ball.color = Color.shared.setValue({ h: hue, s: 100, l: 50 }).toNumber();
	ball.syncStyle();
}