import { Application, Graphics } from 'pixi.js'

export class Circle {
    gfx = new Graphics().circle(0, 0, 20).fill(0x89b4fa)

    constructor(app: Application) {
        app.stage.addChild(this.gfx)
    }

    // call every frame, e.g. from app.ticker
    update() {
        // this.gfx.position.set(this.body.position.x, this.body.position.y)
        // this.gfx.rotation = this.body.angle
    }
}