import NumberPlane from './animweb/AnimObjects/NumberPlane'
import Scene from './animweb/Scene'
import Point from './animweb/AnimObjects/Point'
import Line, { Lines } from './animweb/AnimObjects/Line'
import Colors from './animweb/helpers/StandardColors'
import { Width, Height } from './animweb/helpers/Dimensions'
import StandardColors from './animweb/helpers/StandardColors'
import FadeIn from './animweb/transitions/FadeIn'
import FadeOut from './animweb/transitions/FadeOut'
import Create from './animweb/transitions/Create'
import Curve from './animweb/AnimObjects/Curve'
import Color from './animweb/helpers/Color'
import { Transitions } from './animweb/Transition'
import Text, { TextStyle } from './animweb/AnimObjects/Text'
import { Observables, AnimObjects } from './animweb/AnimObject'
import Constants from './animweb/helpers/Constants'
import { wait } from './animweb/helpers/miscellaneous'

declare global {
  interface Window {
    p5: any
    P5Capture: any
    WebAnim: any
    BuildBridgedWorker: any
  }
}

let scene = new Scene(Width.full, Height.full, Colors.Gray(0))
// let line = new Line({ form: Lines.SlopePoint, slope: 1, point: { x: 1, y: 1 } })
// let plane = new NumberPlane({ showGridLines: true })

// scene.add(await FadeIn(plane, { duration: 5 }))
// await scene.wait()
// let sinx = await plane.plot({
//   definition: 'y = sin(x)',
//   color: StandardColors.Green(),
//   thickness: 3,
//   transition: Transitions.Create,
// })
// await scene.wait()
// let anchor = await sinx.addAnchorLine({
//   x: 0,
//   length: 3,
//   color: StandardColors.Orange(),
//   thickness: 3,
//   transition: Transitions.Create,
// })
// await scene.wait(3000)

// let text = new Text({
//   text: 'Hi mom',
//   position: { x: 10, y: 2 },
//   size: 26,
//   color: StandardColors.Blue(4),
//   style: TextStyle.bold,
//   parentData: {
//     stepX: 50,
//     stepY: 50,
//   },
// })
// scene.add(text)
// text.link(anchor, Observables.slope)
// await scene.wait(2000)

// let x = Math.PI
// while (true) {
//   await anchor.moveTo({ x, duration: 2 })
//   await scene.wait()
//   x *= -1
// }

window.WebAnim = {
  // Basic classes/functions
  scene,
  Color,
  Colors: StandardColors,
  Width,
  Height,
  wait,
  // AnimObjects
  NumberPlane,
  Line,
  Point,
  Curve,
  Text,
  // transitions
  Create,
  FadeIn,
  FadeOut,
  // enums
  Transitions,
  Observables,
  Lines,
  TextStyle,
  AnimObjects,
  Constants,
}
