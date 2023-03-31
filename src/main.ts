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
import { ImplicitCurve } from './animweb/AnimObjects/ImplicitCurve'

declare global {
  interface Window {
    p5: any
    P5Capture: any
    WebAnim: any
    BuildBridgedWorker: any
  }
}

let scene = new Scene(Width.full, Height.full, Colors.Gray(0))

let WebAnim = {
  // Basic classes/functions
  scene,
  Color,
  Colors: StandardColors,
  Width,
  Height,
  wait: async (config: any) => scene.wait(config),
  show: async (config: any) => scene.add(config),
  // AnimObjects
  NumberPlane: (config: any) => new NumberPlane(config),
  Line: (config: any) => new Line(config),
  Point: (config: any) => new Point(config),
  Curve: (config: any) => new Curve(config),
  Text: (config: any) => new Text(config),
  ImplicitCurve: (config: any) => new ImplicitCurve(config),
  // transitions
  Create: async (config: any) => scene.add(await Create(config)),
  FadeIn: async (config: any) => scene.add(await FadeIn(config)),
  FadeOut,
  // enums
  Transitions,
  Observables,
  Lines,
  TextStyle,
  AnimObjects,
  Constants,
}

window.WebAnim = WebAnim
export default WebAnim
