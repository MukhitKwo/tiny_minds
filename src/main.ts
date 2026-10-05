import './style.css'
import { Application, Graphics } from 'pixi.js'

const app = new Application()
await app.init({
  resizeTo: window,
  background: '#1e1e2e',
  antialias: true,
  resolution: window.devicePixelRatio,
  autoDensity: true,
})
document.body.appendChild(app.canvas)

// Visuals
const ballGfx = new Graphics().circle(400, 0, 20).fill(0x89b4fa)
const groundGfx = new Graphics().rect(-400, -20, 800, 40).fill(0xa6e3a1)
groundGfx.position.set(400, 580)
app.stage.addChild(ballGfx, groundGfx)

function loop() {
  // Update the ball's position
  ballGfx.y += 1 * app.ticker.deltaMS
}

// simulation loop
app.ticker.add(loop);

