import { Application, Graphics } from 'pixi.js'
import { CirclePhysics, SquarePhysics } from './ShapePhysics';

export class CircleGraphic extends CirclePhysics {

    gfx: Graphics;

    constructor(app: Application, x: number = 0, y: number = 0, radius: number = 10) {
        super(x, y, radius);
        this.gfx = new Graphics().circle(0, 0, radius).fill(0xE63946)
        app.stage.addChild(this.gfx)
    }

    // call every frame, e.g. from app.ticker
    draw() {
        this.gfx.position.set(this.position.x, this.position.y)
        
    }
}

export class SquareGraphic extends SquarePhysics {
    gfx = new Graphics().rect(0, 0, this.width, this.height).fill(0x1F4FA8)

    constructor(app: Application, x: number = 0, y: number = 0, width: number = 1, height: number = 1) {
        super(x, y, width, height);
        app.stage.addChild(this.gfx)
    }

    // call every frame, e.g. from app.ticker
    draw() {
        this.gfx.position.set(this.position.x, this.position.y)
    }
}