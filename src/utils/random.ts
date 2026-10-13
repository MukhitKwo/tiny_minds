function randomNormal(mean = 0, stdDev = 1): number {
	const u = 1 - Math.random(); // avoid log(0)
	const v = Math.random();
	const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	return mean + z * stdDev;
}

export function randomRadius(min = 2, max = 10): number {
	const mean = (min + max) / 2; // 6
	const stdDev = (max - min) / 6; // ~1.33, so min/max are about 3 sigma out
	let r: number;
	do {
		r = randomNormal(mean, stdDev);
	} while (r < min || r > max); // resample instead of clamping
	return r;
}