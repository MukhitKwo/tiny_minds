// Generates the random rock layout and draws it as a world-sized texture.

import { BufferImageSource, Container, Sprite, Texture } from "pixi.js";
import { CELL_SIZE } from "../../constants/cells";
import {
	ROCK_ALPHA,
	ROCK_BLUE,
	ROCK_GREEN,
	ROCK_PROBABILITY,
	ROCK_RED,
} from "../../constants/world-generation";
import { gridCols, gridRows, totalCells } from "./grid";

export function generateRocks() {
	// TODO IMPROVEMENT: rocks holds only 0/1 flags; Uint8Array would cut this array's memory by 4x.
	const rocks = new Int32Array(totalCells);
	for (let i = 0; i < rocks.length; i++) {
		rocks[i] = Math.random() < ROCK_PROBABILITY ? 1 : 0;
	}
	return rocks;
}

export function addRockLayer(world: Container, rocks: Int32Array) {
	const pixels = new Uint8Array(totalCells * 4);
	for (let i = 0; i < totalCells; i++) {
		if (rocks[i] === 1) {
			const o = i * 4;
			pixels[o] = ROCK_RED;
			pixels[o + 1] = ROCK_GREEN;
			pixels[o + 2] = ROCK_BLUE;
			pixels[o + 3] = ROCK_ALPHA;
		}
	}

	const source = new BufferImageSource({
		resource: pixels,
		width: gridCols,
		height: gridRows,
		format: "rgba8unorm",
		scaleMode: "nearest", // crisp squares when scaled up
	});

	const rockSprite = new Sprite(new Texture({ source }));
	rockSprite.scale.set(CELL_SIZE);
	rockSprite.eventMode = "none";
	world.addChild(rockSprite); // add to world, not app.stage
}
