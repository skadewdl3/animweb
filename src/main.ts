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

let defaultCode = `// import AnimObjects here\nawait use()\n\n//... and code your animation here\n`
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
scene2D.show()
scene3D.hide()
scene = scene2D

const functions = {
  wait: async (config: any) => scene.wait(config),
  println: (...configItems: any) => {
    for (let config of configItems) {
      if (config instanceof Complex) {
        console.log(
          `${config.re} ${config.im >= 0 ? '+' : '-'} ${
            config.im < 0 ? -config.im : config.im
          }i`
        )
      } else if (config instanceof Matrix) {
        let obj = {}
        // @ts-ignore
        for (let [index, row] of Object.entries(config.matrix._data)) {
          // @ts-ignore
          obj[`row-${index}`] = row
        }
        console.table(obj)
      } else if (config instanceof Array) {
        console.table(config)
      } else if (config instanceof Object) {
        console.dir(config)
      } else {
        console.log(config)
      }
    }
  },
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

const animObjects = {
  Point: [
    './animweb/AnimObjects/Point.ts',
    './animweb/AnimObjects/3D/Point3D.ts',
  ],
  Line: ['./animweb/AnimObjects/Line.ts', './animweb/AnimObjects/3D/Line3D.ts'],
  NumberPlane: [
    './animweb/AnimObjects/NumberPlane.ts',
    './animweb/AnimObjects/3D/NumberPlane3D.ts',
  ],
  Text: ['./animweb/AnimObjects/Text.ts', './animweb/AnimObjects/3D/Text3D.ts'],
  Curve: ['./animweb/AnimObjects/Curve.ts'],
  ImplicitCurve: ['./animweb/AnimObjects/ImplicitCurve.ts'],
  Surface: ['./animweb/AnimObjects/3D/Surface.ts'],
  ComplexPlane: ['./animweb/AnimObjects/3D/ComplexPlane3D.ts'],
  Cube: ['./animweb/AnimObjects/3D/Cube.ts'],
  LaTeX: ['./animweb/AnimObjects/LaTeX.ts'],
  Latex: ['./animweb/AnimObjects/LaTeX.ts'],
  TeX: ['./animweb/AnimObjects/LaTeX.ts'],
  Tex: ['./animweb/AnimObjects/LaTeX.ts'],
  Vector: ['./animweb/AnimObjects/Vector.ts'],
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
      // @ts-ignore
      let arr = animObjects[name]
      let imported: Array<any> = []
      if (arr.length > 1) {
        for (let i = 0; i < arr.length; i++) {
          let obj = await import(arr[i])
          imported.push(obj.default)
        }
        window.WebAnim[name] = (config: any) => {
          return scene == scene2D
            ? new imported[0]({ ...config, scene })
            : new imported[1]({ ...config, scene })
        }
      } else {
        let obj = await import(arr[0])
        window.WebAnim[`${name}`] = obj.default
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
}

Object.defineProperty(window, 'camera', {
  get() {
    return scene == scene2D ? undefined : scene3D.camera
  },
})

const showError = (
  errType: string,
  errMessage: string,
  errLineNumber: number
) => {
  let codeError = document.querySelector('.code-error')
  // @ts-ignore
  document.querySelector(
    '.code-error-message'
  ).textContent = `${errType}: ${errMessage}`
  // @ts-ignore
  document.querySelector(
    '.code-error-line'
  ).textContent = `at line ${errLineNumber}`
  codeError?.classList.remove('hidden')
}
Object.defineProperty(window, 'showError', {
  get() {
    return showError
  },
})

getElement('.btn-play')?.addEventListener('click', () => {
  let defaultExports = ''
  for (let name in window.WebAnim) {
    defaultExports = defaultExports.concat(
      `var ${name} = window.WebAnim.${name}\n`
    )
  }
  let inlineCode = document.createTextNode(
    `try {\n${defaultExports}${editor.state.doc.toString()}\n}\ncatch (err) {
          let [errLineNumber, errLineColumn] = err.stack.split(':').slice(-2).map((i) => parseInt(i))
          let errType = err.stack.split(':')[0]
          showError(errType, err.message, parseInt(errLineNumber - ${
            defaultExports.split('\n').length
          }))
      }`
  )

  let script = document.createElement('script')
  script.type = 'module'
  script.className = 'user-script'
  script.appendChild(inlineCode)
  let prevScript = getElement('.user-script')
  if (prevScript) document.body.removeChild(prevScript)
  scene2D.resetScene()
  scene3D.resetScene()
  document.body.appendChild(script)
})
