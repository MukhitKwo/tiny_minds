// Mouse drag to pan and wheel to zoom the world container.

import type { Application, Container } from "pixi.js";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "../../constants/camera";

export function setupPanZoom(app: Application, world: Container) {
	let dragging = false;
	let lastX = 0;
	let lastY = 0;

	app.canvas.addEventListener("pointerdown", (e) => {
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
	});

	window.addEventListener("pointermove", (e) => {
		if (!dragging) return;
		world.x += e.clientX - lastX;
		world.y += e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
	});

	window.addEventListener("pointerup", () => (dragging = false));

	app.canvas.addEventListener(
		"wheel",
		(e) => {
			e.preventDefault();

			const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
			const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, world.scale.x * factor));

			// world point under the cursor, before zooming
			const worldX = (e.offsetX - world.x) / world.scale.x;
			const worldY = (e.offsetY - world.y) / world.scale.y;

			world.scale.set(newScale);

			// move the world so that same point is under the cursor again
			world.x = e.offsetX - worldX * newScale;
			world.y = e.offsetY - worldY * newScale;
		},
		{ passive: false },
	);
}
