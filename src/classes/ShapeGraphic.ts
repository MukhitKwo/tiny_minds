import { Application, Graphics, Particle, ParticleContainer, Texture } from 'pixi.js'
import { CirclePhysics, SquarePhysics } from './ShapePhysics';

const TEX_SIZE = 32; // width of the shared circle texture

export class CircleGraphic extends CirclePhysics {

    particle: Particle;
    container: ParticleContainer;

    color: number;
    radius: number;

    constructor(container: ParticleContainer, texture: Texture, x: number = 0, y: number = 0, radius: number = 10) {
        super(x, y, radius);

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

export class SquareGraphic extends SquarePhysics {
    gfx = new Graphics().rect(0, 0, this.width, this.height).fill(0x1F4FA8)

    constructor(app: Application, x: number = 0, y: number = 0, width: number = 1, height: number = 1) {
        super(x, y, width, height);
        app.stage.addChild(this.gfx)
    }

    draw() {
        this.gfx.position.set(this.position.x, this.position.y)
    }
}