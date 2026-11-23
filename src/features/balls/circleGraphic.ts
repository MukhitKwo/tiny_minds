// Pixi particle for a physics ball; the particle follows the physics position.

import { Particle, ParticleContainer, Texture } from "pixi.js";
import {
	BALL_COLOR,
	BALL_TEXTURE_SIZE,
	GRAPHIC_DEFAULT_MASS,
	GRAPHIC_DEFAULT_RADIUS,
} from "../../constants/balls";
import { CirclePhysics } from "./circlePhysics";

export class CircleGraphic extends CirclePhysics {
	particle: Particle;
	container: ParticleContainer;

	color: number;
	radius: number;

	constructor(
		container: ParticleContainer,
		texture: Texture,
		x: number = 0,
		y: number = 0,
		radius: number = GRAPHIC_DEFAULT_RADIUS,
		mass: number = GRAPHIC_DEFAULT_MASS,
	) {
		super(x, y, radius, mass);

		this.color = BALL_COLOR;
		this.radius = radius;
		this.container = container;

		const s = (radius * 2) / BALL_TEXTURE_SIZE;

		this.particle = new Particle({
			texture,
			x,
			y,
			anchorX: 0.5,
			anchorY: 0.5,
			scaleX: s,
			scaleY: s,
			tint: this.color,
		});

		container.addParticle(this.particle);
	}

	// call every frame after physics
	draw() {
		this.particle.x = this.position.x;
		this.particle.y = this.position.y;
	}

	// call only when radius or color changed
	syncStyle() {
		const s = (this.radius * 2) / BALL_TEXTURE_SIZE;
		this.particle.scaleX = s;
		this.particle.scaleY = s;
		this.particle.tint = this.color;
	}

	destroy() {
		this.container.removeParticle(this.particle);
	}
}
