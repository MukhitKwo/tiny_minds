import { Application, Graphics, Particle, ParticleContainer, Texture } from 'pixi.js'
import { CirclePhysics } from './ShapePhysics';
import { Vector2 } from './Vector2';
import { cellSize } from '../main';

const TEX_SIZE = 32; // width of the shared circle texture

export class CircleGraphic extends CirclePhysics {

    particle: Particle;
    container: ParticleContainer;

    color: number;
    radius: number;

    constructor(container: ParticleContainer, texture: Texture, x: number = 0, y: number = 0, radius: number = 2, mass: number = 1) {
        super(x, y, radius, mass);

        this.color = 0xE63946;
        this.radius = radius;
        this.container = container;

        const s = (radius * 2) / TEX_SIZE;

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
        const s = (this.radius * 2) / TEX_SIZE;
        this.particle.scaleX = s;
        this.particle.scaleY = s;
        this.particle.tint = this.color;
    }

    destroy() {
        this.container.removeParticle(this.particle);
    }
}

export class SquareArray {

    position: Vector2;
	width: number;
	height: number;

    gfx = new Graphics().rect(0, 0, cellSize, cellSize).fill(0x1F4FA8)

    constructor(app: Application, x: number = 0, y: number = 0, width: number = 1, height: number = 1) {
        this.position = new Vector2(x, y);
		this.width = width;
		this.height = height;
        app.stage.addChild(this.gfx)
    }

    draw() {
        this.gfx.position.set(this.position.x, this.position.y)
    }
}