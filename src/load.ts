// Core
import Scene2D from '@core/Scene2D'
import Scene3D from '@core/Scene3D'

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
import { getElement, getInlineCode, throwError } from './helpers/miscellaneous'

// Interfaces
import { AnimObject, Scene } from '@interfaces/core'

// UI
import code from '@reactives/code'
import logger from '@reactives/logger'
import error from '@reactives/error'
import { svgData } from './reactives/svg'
import { sliders } from './reactives/sliders'
import { buttons } from './reactives/buttons'

// Libraries
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { createApp, reactive } from 'vue'
import AnimObject2D from './core/AnimObject2D'

// Mixins
import { createButton } from './mixins/Button'
import { createSlider } from './mixins/Slider'

// Styles
import './styles/main.css'
import './styles/slider.css'
import './styles/button.css'
import { EditorReactive } from './interfaces/ui'
import App from '@/ui/App.vue'

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
  scene2D.resetScene()
  scene3D.resetScene()
}

export const editor: EditorReactive = reactive<EditorReactive>({
  editor: null,
  create() {
    let defaultCode = `// import AnimObjects here\nawait use()\n\n//... and code your animation here\n`
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
}

const helpers = {
  Color,
  Colors,
  Matrix,
  Complex,
  Width,
  Height,
}
type AnimObjectsImports =
  | [
      () => Promise<any>,
      () => Promise<any>,
      { [key: string]: () => Promise<any> }
    ]
  | [undefined, () => Promise<any>, { [key: string]: () => Promise<any> }]
  | [() => Promise<any>, undefined, { [key: string]: () => Promise<any> }]
  | [() => Promise<any>, () => Promise<any>]
  | [() => Promise<any>]

const AnimObjects: { [key: string]: AnimObjectsImports } = {
  Point: [
    async () => await import('@AnimObjects2D/Point.ts'),
    async () => await import('@AnimObjects3D/Point3D.ts'),
    {
      Properties: async () => await import('@enums/mixins.ts'),
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  Line: [
    async () => await import('@AnimObjects2D/Line.ts'),
    async () => await import('@AnimObjects3D/Line3D.ts'),
    {
      Lines: async () => await import('@enums/AnimObjects2D.ts'),
      Properties: async () => await import('@enums/mixins.ts'),
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  NumberPlane: [
    async () => await import('@AnimObjects2D/NumberPlane.ts'),
    async () => await import('@AnimObjects3D/NumberPlane3D.ts'),
    {
      NumberPlanes: async () => await import('@enums/AnimObjects3D.ts'),
      Properties: async () => await import('@enums/mixins.ts'),
      Octants: async () => await import('@enums/AnimObjects3D.ts'),
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  Text: [
    async () => await import('@AnimObjects2D/Text.ts'),
    async () => await import('@AnimObjects3D/Text3D.ts'),
    {
      TextStyle: async () => await import('@enums/AnimObjects2D.ts'),
      Properties: async () => await import('@enums/mixins.ts'),
      Transitions: async () => await import('@enums/transitions.ts'),
      Fonts: async () => await import('@enums/miscellaneous.ts'),
    },
  ],
  Curve: [
    async () => await import('@AnimObjects2D/Curve.ts'),
    undefined,
    {
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  ImplicitCurve: [
    async () => await import('@AnimObjects2D/ImplicitCurve.ts'),
    undefined,
    {
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  Surface: [async () => await import('@AnimObjects3D/Surface.ts')],
  ComplexPlane: [
    async () => await import('@AnimObjects2D/ComplexPlane2D.ts'),
    async () => await import('@AnimObjects3D/ComplexPlane3D.ts'),
    {
      ComplexPlanes: async () => await import('@enums/AnimObjects3D.ts'),
      Octants: async () => await import('@enums/AnimObjects3D.ts'),
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  Cube: [async () => await import('@AnimObjects3D/Cube.ts')],
  LaTeX: [
    async () => await import('@AnimObjects2D/LaTeX.ts'),
    undefined,
    {
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  Latex: [
    async () => await import('@AnimObjects2D/LaTeX.ts'),
    undefined,
    {
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  TeX: [
    async () => await import('@AnimObjects2D/LaTeX.ts'),
    undefined,
    {
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  Tex: [
    async () => await import('@AnimObjects2D/LaTeX.ts'),
    undefined,
    {
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
  Vector: [
    async () => await import('@AnimObjects2D/Vector.ts'),
    undefined,
    {
      Vectors: async () => await import('@enums/AnimObjects2D.ts'),
      Transitions: async () => await import('@enums/transitions.ts'),
    },
  ],
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
window.WebAnim = {
  use: async (...config: Array<any>) => {
    for (let name of config) {
      if (!(name in AnimObjects))
        throwError('ImportError', `'${name}' is not a valid AnimObject`)

      if (name in window.WebAnim) return
      let arr = AnimObjects[name]
      let imported: Array<any> = []
      let helperImports: Array<any> = []
      if (arr.length == 3) {
        imported.push(arr[0] ? (await arr[0]()).default : undefined)
        imported.push(arr[1] ? (await arr[1]()).default : undefined)

        window.WebAnim[name] = (config: any) => {
          return scene == scene2D
            ? imported[0]
              ? new imported[0]({ ...config, scene })
              : imported[0]
            : imported[1]
            ? new imported[1]({ ...config, scene })
            : imported[1]
        }

        for (let [helperName, helperImport] of Object.entries(arr[2])) {
          if (helperName in window.WebAnim) continue
          let obj = await helperImport()
          helperImports.push(helperName)
          window.WebAnim[helperName] = obj[helperName]
        }
      } else if (arr.length == 2) {
        imported.push((await arr[0]()).default)
        imported.push((await arr[1]()).default)
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
      let text = `var ${name} = window.WebAnim.${name}`
      for (let helperName of helperImports) {
        text = text.concat(`\nvar ${helperName} = window.WebAnim.${helperName}`)
      }
      let textNode = document.createTextNode(text)
      importScript.appendChild(textNode)
      getElement('.user-imports')?.appendChild(importScript)
    }
  },
  ...functions,
  ...transitions,
  ...helpers,
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
