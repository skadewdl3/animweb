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
  ImplicitCurve,
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
