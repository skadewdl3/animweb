// Core
import Scene2D from '@core/Scene2D'
import Scene3D from '@core/Scene3D'
import AnimObject2D from './core/AnimObject2D'
import AnimObject3D from './core/AnimObject3D'

// AnimObjects2D
import Point from '@AnimObjects2D/Point.ts'
import Line from '@AnimObjects2D/Line.ts'
import NumberPlane from '@AnimObjects2D/NumberPlane.ts'
import Curve from '@AnimObjects2D/Curve.ts'
import ImplicitCurve from '@AnimObjects2D/ImplicitCurve.ts'
import Text from '@AnimObjects2D/Text.ts'
import LaTeX from '@AnimObjects2D/LaTeX.ts'
import Vector from '@AnimObjects2D/Vector.ts'
import ComplexPlane2D from '@AnimObjects2D/ComplexPlane2D.ts'

// AnimObjects3D
import Point3D from '@AnimObjects3D/Point3D.ts'
import Line3D from '@AnimObjects3D/Line3D.ts'
import Surface from '@AnimObjects3D/Surface.ts'
import NumberPlane3D from '@AnimObjects3D/NumberPlane3D.ts'
import ComplexPlane3D from '@AnimObjects3D/ComplexPlane3D.ts'
import Text3D from '@AnimObjects3D/Text3D.ts'

// Auxiliary
import Color from '@auxiliary/Color.ts'
import Matrix from '@auxiliary/Matrix.ts'
import Complex from '@auxiliary/Complex.ts'

// enums
import { Lines, Vectors, TextStyle } from '@enums/AnimObjects2D.ts'
import { NumberPlanes, ComplexPlanes, Octants } from '@enums/AnimObjects3D.ts'
import { Fonts } from '@enums/miscellaneous.ts'
import { Properties } from '@enums/mixins.ts'
import { Transitions } from '@enums/transitions.ts'

// Helpers
import Colors from '@helpers/Colors.ts'
import { roundOff, degToRad, radToDeg } from './helpers/miscellaneous'
import { Width, Height } from '@/helpers/Dimensions'
import { getElement, getInlineCode, throwError } from './helpers/miscellaneous'

// Interfaces
import { AnimObject, Scene } from '@interfaces/core'
import { EditorReactive } from './interfaces/ui'

// Mixins
import { createButton } from './mixins/Button'
import { createSlider } from './mixins/Slider'

// Reactives
import logger from '@reactives/logger'
import error from '@reactives/error'
import { svgData } from './reactives/svg'
import { sliders } from './reactives/sliders'
import { buttons } from './reactives/buttons'
import { prompts } from './reactives/prompts'

// Styles
import '@styles/main.styl'

// Transitions
import FadeIn from '@transitions/FadeIn.ts'
import FadeOut from '@transitions/FadeOut.ts'
import Create from '@transitions/Create.ts'

// UI
import App from '@/ui/App.vue'

// Libraries
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { createApp, reactive } from 'vue'
import { createPrompt } from './mixins/Prompt'
import { watch } from './mixins/Watcher'

declare global {
  interface Window {
    p5: any
    P5Capture: any
    WebAnim: any
    BuildBridgedWorker: any
  }
}

let scene2D = new Scene2D(Width.full, Height.full, Colors.gray0)
let scene3D = new Scene3D(Width.full, Height.full, Colors.gray0)
scene2D.show()
scene3D.hide()
let scene: Scene = scene2D
scene = scene2D

const resetScene = (clearDebuggingData = false) => {
  clearDebuggingData && error.hide()
  clearDebuggingData && logger.clear()
  svgData.clear()
  sliders.clear()
  buttons.clear()
  prompts.clear()
  scene2D.resetScene()
  scene3D.resetScene()
}

export const editor: EditorReactive = reactive<EditorReactive>({
  editor: null,
  create() {
    let defaultCode = `// Code your animation here\n`
    // @ts-ignore
    this.editor = new EditorView({
      //@ts-ignore
      parent: document.querySelector('.codemirror-editor-container'),
      doc: defaultCode,
      extensions: [basicSetup, javascript(), EditorView.lineWrapping],
    })
  },
  run() {
    resetScene(true)
    let inlineCode = getInlineCode(this.editor)
    let script = document.createElement('script')
    script.type = 'module'
    script.className = 'user-script'
    script.appendChild(inlineCode)
    let prevScript = getElement('.user-script')
    if (prevScript) document.body.removeChild(prevScript)
    scene2D.resetScene()
    scene3D.resetScene()
    document.body.appendChild(script)
  },
  clear() {
    resetScene()
  },
})

const functions = {
  wait: async (config: any) => await scene.wait(config),
  show: (config: any) => {
    if (config.animating) {
      config.animating = false
    }
    return scene.add(config)
  },
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
  createButton: (config: any) => createButton(config),
  createSlider: (config: any) => createSlider(config),
  createPrompt: (config: any) => createPrompt(config),
  watch: (config: any) => watch(config),
  roundOff,
  degToRad,
  radToDeg,
}

const enums = {
  Lines,
  Vectors,
  TextStyle,
  NumberPlanes,
  ComplexPlanes,
  Octants,
  Fonts,
  Properties,
  Transitions,
}

const auxiliary = {
  Color,
  Colors,
  Matrix,
  Complex,
  Width,
  Height,
}

const transitions = {
  Create: (object: AnimObject, config: any) => {
    if (scene instanceof Scene2D) {
      scene.add(Create(object as AnimObject2D, config))
    }
    return object
  },
  FadeIn: (object: AnimObject, config: any) => {
    if (scene instanceof Scene2D) {
      scene.add(FadeIn(object as AnimObject2D, config))
    }
    return object
  },
  FadeOut,
}

const AnimObjects = {
  Point: (config: any) => {
    return scene == scene2D
      ? new Point({ ...config, scene })
      : new Point3D({ ...config, scene: scene as Scene3D })
  },
  Line: (config: any) => {
    return scene == scene2D
      ? new Line({ ...config, scene })
      : new Line3D({ ...config, scene: scene as Scene3D })
  },
  NumberPlane: (config: any) => {
    return scene == scene2D
      ? new NumberPlane({ ...config, scene })
      : new NumberPlane3D({ ...config, scene: scene as Scene3D })
  },
  Text: (config: any) => {
    return scene == scene2D
      ? new Text({ ...config, scene })
      : new Text3D({ ...config, scene: scene as Scene3D })
  },
  Curve: (config: any) => {
    return new Curve({ ...config, scene })
  },
  ImplicitCurve: (config: any) => {
    return new ImplicitCurve({ ...config, scene })
  },
  ComplexPlane: (config: any) => {
    return scene == scene2D
      ? new ComplexPlane2D({ ...config, scene })
      : new ComplexPlane3D({ ...config, scene: scene as Scene3D })
  },
  LaTeX: (config: any) => {
    return new LaTeX({ ...config, scene })
  },
  Latex: (config: any) => {
    return new LaTeX({ ...config, scene })
  },
  TeX: (config: any) => {
    return new LaTeX({ ...config, scene })
  },
  Tex: (config: any) => {
    return new LaTeX({ ...config, scene })
  },
  Vector: (config: any) => {
    return new Vector({ ...config, scene })
  },
  Surface: (config: any) => {
    return new Surface({ ...config, scene: scene as Scene3D })
  },
}

window.WebAnim = {
  ...AnimObjects,
  ...functions,
  ...transitions,
  ...auxiliary,
  ...enums,
}

Object.defineProperty(window, 'camera', {
  get() {
    return scene == scene2D ? undefined : scene3D.camera
  },
})

Object.defineProperty(window, 'print', {
  get() {
    return (...configItems: any) => {
      for (let config of configItems) {
        if (config instanceof Complex) {
          logger.logComplex(config)
        } else if (config instanceof Color) {
          logger.logColor(config)
        } else if (config instanceof Matrix) {
          logger.logMatrix(config)
        } else if (config instanceof Array) {
          logger.logArray(config)
        } else if (config instanceof Object) {
          logger.logObject(config)
        } else {
          logger.log(config, typeof config)
        }
      }
    }
  },
})

Object.defineProperty(window, 'showError', {
  get() {
    return (...config: any) => {
      error.show(...config)
    }
  },
})

const mountApp = () => {
  createApp(App).mount('#app')
}

export default mountApp
