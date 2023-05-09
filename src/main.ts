// Core
import Scene2D from '@core/Scene2D'
import Scene3D from '@core/Scene3D'
import { Observables } from './enums/AnimObjects2D'

// Transitions
import FadeIn from '@transitions/FadeIn.ts'
import FadeOut from '@transitions/FadeOut.ts'
import Create from '@transitions/Create.ts'

// Auxiliary
import Color from '@auxiliary/Color.ts'
import Matrix from '@auxiliary/Matrix.ts'
import Complex from '@auxiliary/Complex.ts'

// Helpers
import Colors from '@helpers/Colors.ts'
import { Width, Height } from '@/helpers/Dimensions'
import Constants from '@helpers/Constants.ts'
import { UserSVGs, svgData } from '@helpers/addSVG.ts'
import { getElement, getInlineCode } from './helpers/miscellaneous'

// Interfaces
import { AnimObject, Scene } from '@interfaces/core'

// Enums
import { Octants, NumberPlanes, ComplexPlanes } from './enums/AnimObjects3D'
import { Vectors, TextStyle, Lines } from './enums/AnimObjects2D'
import { Transitions } from './enums/transitions'
import { Fonts } from './enums/miscellaneous'

// UI
import { code, error, logger } from '@ui/elements.ts'

// Libraries
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { createApp, reactive } from 'petite-vue'
import AnimObject2D from './core/AnimObject2D'

declare global {
  interface Window {
    p5: any
    P5Capture: any
    WebAnim: any
    BuildBridgedWorker: any
  }
}

let scene: Scene
let scene2D = new Scene2D(Width.full, Height.full, Colors.gray0)
let scene3D = new Scene3D(Width.full, Height.full, Colors.gray0)
scene2D.show()
scene3D.hide()
scene = scene2D

const editor = reactive({
  editor: null,
  create() {
    let defaultCode = `// import AnimObjects here\nawait use()\n\n//... and code your animation here\n`
    this.editor = new EditorView({
      //@ts-ignore
      parent: document.querySelector('.codemirror-editor-container'),
      doc: defaultCode,
      extensions: [basicSetup, javascript(), EditorView.lineWrapping],
    })
  },
  run() {
    error.hide()
    svgData.clear()
    logger.clear()
    scene2D.resetScene()
    scene3D.resetScene()
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
    svgData.clear()
    scene2D.resetScene()
    scene3D.resetScene()
  },
})

const functions = {
  wait: async (config: any) => await scene.wait(config),
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
}

const helpers = {
  Color,
  Colors,
  Matrix,
  Complex,
  Width,
  Height,
}

const aos = {
  Point: [
    async () => await import('@AnimObjects2D/Point.ts'),
    async () => await import('@AnimObjects3D/Point3D.ts'),
  ],
  Line: [
    async () => await import('@AnimObjects2D/Line.ts'),
    async () => await import('@AnimObjects3D/Line3D.ts'),
  ],
  NumberPlane: [
    async () => await import('@AnimObjects2D/NumberPlane.ts'),
    async () => await import('@AnimObjects3D/NumberPlane3D.ts'),
  ],
  Text: [
    async () => await import('@AnimObjects2D/Text.ts'),
    async () => await import('@AnimObjects3D/Text3D.ts'),
  ],
  Curve: [async () => await import('@AnimObjects2D/Curve.ts')],
  ImplicitCurve: [async () => await import('@AnimObjects2D/ImplicitCurve.ts')],
  Surface: [async () => await import('@AnimObjects3D/Surface.ts')],
  ComplexPlane: [async () => await import('@AnimObjects3D/ComplexPlane3D.ts')],
  Cube: [async () => await import('@AnimObjects3D/Cube.ts')],
  LaTeX: [async () => await import('@AnimObjects2D/LaTeX.ts')],
  Latex: [async () => await import('@AnimObjects2D/LaTeX.ts')],
  TeX: [async () => await import('@AnimObjects2D/LaTeX.ts')],
  Tex: [async () => await import('@AnimObjects2D/LaTeX.ts')],
  Vector: [async () => await import('@AnimObjects2D/Vector.ts')],
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

const enums = {
  Transitions,
  Observables,
  Lines,
  TextStyle,
  Constants,
  Vectors,
  NumberPlanes,
  Octants,
  ComplexPlanes,
  Fonts,
}

window.WebAnim = {
  use: async (...config: Array<any>) => {
    for (let name of config) {
      if (!(name in aos))
        return error.show(
          'ImportError',
          `AnimObject '${name}' not found. Please check your spelling.`
        )
      if (name in window.WebAnim) return
      // @ts-ignore
      let arr = aos[name]
      let imported: Array<any> = []
      if (arr.length > 1) {
        for (let i = 0; i < arr.length; i++) {
          let obj = await arr[i]()
          imported.push(obj.default)
        }
        window.WebAnim[name] = (config: any) => {
          return scene == scene2D
            ? new imported[0]({ ...config, scene })
            : new imported[1]({ ...config, scene })
        }
      } else {
        let obj = await arr[0]()
        window.WebAnim[name] = (config: any) =>
          new obj.default({ ...config, scene })
      }
      let importScript = document.createElement('script')
      let text = document.createTextNode(`var ${name} = window.WebAnim.${name}`)
      importScript.appendChild(text)
      getElement('.user-imports')?.appendChild(importScript)
    }
  },

  ...functions,
  ...transitions,
  ...enums,
  ...helpers,
  error,
}

Object.defineProperty(window, 'camera', {
  get() {
    return scene == scene2D ? undefined : scene3D.camera
  },
})

Object.defineProperty(window, 'showError', {
  get() {
    return error.show
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

// Creating the UI using petite-vue
const UserControls = () => {
  return {
    $template: '#user-controls',
  }
}

createApp({
  UserControls,
  UserSVGs,
  editor,
  code,
  error,
  logger,
  svgData,
}).mount()
