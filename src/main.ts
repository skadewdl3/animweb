import NumberPlane from './animweb/AnimObjects/NumberPlane'
import NumberPlane3D from './animweb/AnimObjects/3D/NumberPlane3D'
import Scene2D from './animweb/Scene2D'
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
import Constants, { RenderingModes } from './animweb/helpers/Constants'
import ImplicitCurve from './animweb/AnimObjects/ImplicitCurve'
import LaTeX from './animweb/AnimObjects/LaTeX'
import Matrix from './animweb/helpers/Matrix'
import Vector, { Vectors } from './animweb/AnimObjects/Vector'
import Scene3D from './animweb/Scene3D'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import Cube from './animweb/AnimObjects/3D/Cube'
import Line3D from './animweb/AnimObjects/3D/Line3D'
import Point3D from './animweb/AnimObjects/3D/Point3D'

declare global {
  interface Window {
    p5: any
    P5Capture: any
    WebAnim: any
    BuildBridgedWorker: any
  }
}

let defaultCode = `// code your animation here`
let editor = new EditorView({
  //@ts-ignore
  parent: document.querySelector('.codemirror-editor-container'),
  doc: defaultCode,
  extensions: [basicSetup, javascript(), EditorView.lineWrapping],
})

export type Scene = Scene2D | Scene3D
let scene: Scene
let scene2D = new Scene2D(Width.full, Height.full, Colors.gray0, editor)
let scene3D = new Scene3D(Width.full, Height.full, Colors.gray0, editor)
// scene3D.hide()
// scene2D.show()
scene2D.show()
scene3D.hide()
scene = scene2D

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
  render: (mode: '3D' | '2D' = '2D') => {
    if (mode == '3D') {
      scene2D.hide()
      scene3D.show()
      scene = scene3D
    } else {
      scene3D.hide()
      scene2D.show()
      scene = scene2D
    }
  },
  // AnimObjects
  NumberPlane: (config: any) =>
    scene == scene2D
      ? new NumberPlane({ ...config, scene })
      : new NumberPlane3D({ ...config, scene }),
  Line: (config: any) =>
    scene == scene2D
      ? new Line({ ...config, scene })
      : new Line3D({ ...config, scene }),
  Point: (config: any) =>
    scene == scene2D
      ? new Point({ ...config, scene })
      : new Point3D({ ...config, scene }),
  Curve: (config: any) => new Curve({ ...config, scene }),
  Text: (config: any) => new Text({ ...config, scene }),
  ImplicitCurve: (config: any) => new ImplicitCurve({ ...config, scene }),
  LaTeX: (config: any) => new LaTeX({ ...config, scene }),
  Latex: (config: any) => new LaTeX({ ...config, scene }),
  TeX: (config: any) => new LaTeX({ ...config, scene }),
  Tex: (config: any) => new LaTeX({ ...config, scene }),
  Vector: (config: any) => new Vector({ ...config, scene }),
  // transitions
  Create: (object: AnimObject, config: any) => {
    if (scene instanceof Scene2D) {
      scene.add(Create(object, config))
    }
  },
  FadeIn: (object: AnimObject, config: any) => {
    if (scene instanceof Scene2D) {
      scene.add(FadeIn(object, config))
    }
  },

  // AnimObject3D
  Cube: (config: any) => new Cube({ ...config, scene }),
  FadeOut,
  startRotation() {
    scene3D.startRotation()
  },
  stopRotation() {
    scene3D.stopRotation()
  },
  camera: scene3D.camera,
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
