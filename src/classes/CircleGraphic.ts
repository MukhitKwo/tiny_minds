import { Application, Graphics } from 'pixi.js'
import { CirclePhysics } from './Physics';

export class CircleGraphic extends CirclePhysics {
    gfx = new Graphics().circle(0, 0, 20).fill(0x89b4fa)

    constructor(app: Application, x: number = 0, y: number = 0, radius: number = 20) {
        super(x, y, radius);
        app.stage.addChild(this.gfx)
    }

    // call every frame, e.g. from app.ticker
    draw() {
        this.gfx.position.set(this.position.x, this.position.y)
        
    }
}