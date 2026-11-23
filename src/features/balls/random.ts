// Random sampling helpers for ball radii.

import { BALL_MAX_RADIUS, BALL_MIN_RADIUS } from "../../constants/balls";

function randomNormal(mean = 0, stdDev = 1): number {
	const u = 1 - Math.random(); // avoid log(0)
	const v = Math.random();
	const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	return mean + z * stdDev;
}

export function randomRadius(min = BALL_MIN_RADIUS, max = BALL_MAX_RADIUS): number {
	const mean = (min + max) / 2;
	const stdDev = (max - min) / 6; // min and max sit about 3 sigma out
	let r: number;
	do {
		r = randomNormal(mean, stdDev);
	} while (r < min || r > max); // resample instead of clamping
	return r;
}
