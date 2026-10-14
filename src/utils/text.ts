import { Application, Text } from 'pixi.js';

export function createLabel(app: Application, x: number, y: number, fontSize = 24, text="Preview 123") {
	const label = new Text({
		text: text,
		style: {
			fontFamily: 'Arial',
			fontSize: fontSize,
			fill: 0xffffff,
		},
	});

	label.position.set(x, y);
	app.stage.addChild(label);
	return label;
}
