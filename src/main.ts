import { CircleGraphic } from './classes/CircleGraphic'
import { Vector2 } from './classes/Physics'
import './style.css'
import { Application } from 'pixi.js'

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
const ball = new CircleGraphic(app, 100, 100, 20)

ball.velocity = new Vector2(1000, 0)

app.ticker.add((ticker) => {
  // If your physics velocity is in units per second:
  const dtInSeconds = ticker.deltaMS / 1000;
  ball.update(dtInSeconds);
  ball.draw();
});
