import { NumberPlanes, Octants } from './animweb/AnimObjects/3D/NumberPlane3D'
import Scene2D from './animweb/Scene2D'
import { Lines } from './animweb/AnimObjects/Line'
import { Width, Height } from './animweb/helpers/Dimensions'
import Colors from './animweb/helpers/Colors'
import FadeIn from './animweb/transitions/FadeIn'
import FadeOut from './animweb/transitions/FadeOut'
import Create from './animweb/transitions/Create'
import Color from './animweb/helpers/Color'
import { Transitions } from './animweb/Transition'
import { TextStyle } from './animweb/AnimObjects/Text'
import AnimObject, { Observables } from './animweb/AnimObject'
import Constants from './animweb/helpers/Constants'
import Matrix from './animweb/helpers/Matrix'
import { Vectors } from './animweb/AnimObjects/Vector'
import Scene3D from './animweb/Scene3D'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import Complex from './animweb/helpers/Complex'
import { createApp, reactive } from 'petite-vue'
import { code, error, logger } from './ui/elements.ts'
import { UserSVGs, svgData } from './animweb/helpers/addSVG.ts'

declare global {
  interface Window {
    p5: any
    P5Capture: any
    WebAnim: any
    BuildBridgedWorker: any
  }
}

const getElement = (selector: string) => {
  return document.querySelector(selector)
}

export type Scene = Scene2D | Scene3D
let scene: Scene
let scene2D = new Scene2D(Width.full, Height.full, Colors.gray0)
let scene3D = new Scene3D(Width.full, Height.full, Colors.gray0)
scene2D.show()
scene3D.hide()
scene = scene2D

const getInlineCode = (codeEditor: EditorView) => {
  let defaultExports = ''
  for (let name in window.WebAnim) {
    defaultExports = defaultExports.concat(
      `var ${name} = window.WebAnim.${name}\n`
    )
  }
  let inlineCode = document.createTextNode(
    `try {\n${defaultExports}${codeEditor.state.doc.toString()}\n}\ncatch (err) {
            let [errLineNumber, errLineColumn] = err.stack.split(':').slice(-2).map((i) => parseInt(i))
            let errType = err.stack.split(':')[0]
            showError(errType, err.message, parseInt(errLineNumber - ${
              defaultExports.split('\n').length
            }))
        }`
  )
  return inlineCode
}

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
    async () => await import('./animweb/AnimObjects/Point.ts'),
    async () => await import('./animweb/AnimObjects/3D/Point3D.ts'),
  ],
  Line: [
    async () => await import('./animweb/AnimObjects/Line.ts'),
    async () => await import('./animweb/AnimObjects/3D/Line3D.ts'),
  ],
  NumberPlane: [
    async () => await import('./animweb/AnimObjects/NumberPlane.ts'),
    async () => await import('./animweb/AnimObjects/3D/NumberPlane3D.ts'),
  ],
  Text: [
    async () => await import('./animweb/AnimObjects/Text.ts'),
    async () => await import('./animweb/AnimObjects/3D/Text3D.ts'),
  ],
  Curve: [async () => await import('./animweb/AnimObjects/Curve.ts')],
  ImplicitCurve: [
    async () => await import('./animweb/AnimObjects/ImplicitCurve.ts'),
  ],
  Surface: [async () => await import('./animweb/AnimObjects/3D/Surface.ts')],
  ComplexPlane: [
    async () => await import('./animweb/AnimObjects/3D/ComplexPlane3D.ts'),
  ],
  Cube: [async () => await import('./animweb/AnimObjects/3D/Cube.ts')],
  LaTeX: [async () => await import('./animweb/AnimObjects/LaTeX.ts')],
  Latex: [async () => await import('./animweb/AnimObjects/LaTeX.ts')],
  TeX: [async () => await import('./animweb/AnimObjects/LaTeX.ts')],
  Tex: [async () => await import('./animweb/AnimObjects/LaTeX.ts')],
  Vector: [async () => await import('./animweb/AnimObjects/Vector.ts')],
}

const transitions = {
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
  Fonts: {},
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

createApp({ UserControls, UserSVGs, editor, code, error, logger, svgData }).mount()
// createApp({ UserSVGs, svgData }).mount()
