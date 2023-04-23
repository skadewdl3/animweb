import NumberPlane from './animweb/AnimObjects/NumberPlane'
import Scene from './animweb/Scene'
import Point from './animweb/AnimObjects/Point'
import Line, { Lines } from './animweb/AnimObjects/Line'
import { Width, Height } from './animweb/helpers/Dimensions'
import Colors from './animweb/helpers/Colors'
import FadeIn from './animweb/transitions/FadeIn'
import FadeOut from './animweb/transitions/FadeOut'
import Create from './animweb/transitions/Create'
import Curve from './animweb/AnimObjects/Curve'
import Color from './animweb/helpers/Color'
import { Transitions } from './animweb/Transition'
import Text, { TextStyle } from './animweb/AnimObjects/Text'
import AnimObject, { Observables, AnimObjects } from './animweb/AnimObject'
import Constants from './animweb/helpers/Constants'
import ImplicitCurve from './animweb/AnimObjects/ImplicitCurve'
import LaTeX from './animweb/AnimObjects/LaTeX'
import Matrix from './animweb/helpers/Matrix'
import Vector, { Vectors } from './animweb/AnimObjects/Vector'

declare global {
  interface Window {
    p5: any
    P5Capture: any
    WebAnim: any
    BuildBridgedWorker: any
  }
}

let scene = new Scene(Width.full, Height.full, Colors.gray0)

let WebAnim = {
  // Basic classes/functions
  scene,
  Color,
  Colors,
  Matrix,
  Width,
  Height,
  wait: async (config: any) => scene.wait(config),
  show: (config: any) => scene.add(config),
  // AnimObjects
  NumberPlane: (config: any) => new NumberPlane({ ...config, scene }),
  Line: (config: any) => new Line({ ...config, scene }),
  Point: (config: any) => new Point({ ...config, scene }),
  Curve: (config: any) => new Curve({ ...config, scene }),
  Text: (config: any) => new Text({ ...config, scene }),
  ImplicitCurve: (config: any) => new ImplicitCurve({ ...config, scene }),
  LaTeX: (config: any) => new LaTeX({ ...config, scene }),
  Latex: (config: any) => new LaTeX({ ...config, scene }),
  TeX: (config: any) => new LaTeX({ ...config, scene }),
  Tex: (config: any) => new LaTeX({ ...config, scene }),
  Vector: (config: any) => new Vector({ ...config, scene }),
  // transitions
  Create: (object: AnimObject, config: any) =>
    scene.add(Create(object, config)),
  FadeIn: (object: AnimObject, config: any) =>
    scene.add(FadeIn(object, config)),
  FadeOut,
  // enums
  Transitions,
  Observables,
  Lines,
  TextStyle,
  AnimObjects,
  Constants,
  Vectors,
  Fonts: {},
}

window.WebAnim = WebAnim
export default WebAnim
