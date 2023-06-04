// Core
import Scene2D from './Scene2D.ts'
import AnimObject2D from './AnimObject2D.ts'
import AnimObject3D from './AnimObject3D.ts'

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
// import Point3D from '@AnimObjects3D/Point3D.ts'
// import Line3D from '@AnimObjects3D/Line3D.ts'
// import Surface from '@AnimObjects3D/Surface.ts'
// import NumberPlane3D from '@AnimObjects3D/NumberPlane3D.ts'
// import ComplexPlane3D from '@AnimObjects3D/ComplexPlane3D.ts'
// import Text3D from '@AnimObjects3D/Text3D.ts'

let Point3D: any
let Line3D: any
let Surface: any
let NumberPlane3D: any
let ComplexPlane3D: any
let Text3D: any

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
import { roundOff, degToRad, radToDeg } from '@helpers/miscellaneous.ts'
import { Width, Height } from '@helpers/Dimensions.ts'

// Interfaces
import { AnimObject, Scene } from '@interfaces/core.ts'

// Mixins
import { createButton } from '@mixins/Button.ts'
import { createSlider } from '@mixins/Slider.ts'
import { createPrompt } from '@mixins/Prompt.ts'

// Reactives
import logger from '@reactives/logger.ts'
import error from '@reactives/error.ts'
import { svgData } from '@reactives/svg.ts'
import { sliders } from '@reactives/sliders.ts'
import { buttons } from '@reactives/buttons.ts'
import { prompts } from '@reactives/prompts.ts'

// Transitions
import FadeIn from '@transitions/FadeIn.ts'
import FadeOut from '@transitions/FadeOut.ts'
import Create from '@transitions/Create.ts'
import Morph from '@transitions/Morph.ts'

// @ts-ignore

let Create3D: any
let FadeIn3D: any
let FadeOut3D: any
let Morph3D: any

let w = await useWASM()
console.log(w.greet())
import { watch } from '@mixins/Watcher.ts'

let scene2D = new Scene2D(Width.full, Height.full, Colors.gray0)
let scene3D: any

scene2D.show()
scene3D?.hide()
let scene: Scene = scene2D
scene = scene2D

const init3DScene = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (scene3D) resolve(scene3D)
    else {
      let scene3DModule = await import('./Scene3D.ts')
      scene3D = new scene3DModule.default(Width.full, Height.full, Colors.gray0)
      let point3DModule = await import('@AnimObjects3D/Point3D.ts')
      Point3D = point3DModule.default
      let line3DModule = await import('@AnimObjects3D/Line3D.ts')
      Line3D = line3DModule.default
      let surfaceModule = await import('@AnimObjects3D/Surface.ts')
      Surface = surfaceModule.default
      let numberPlane3DModule = await import('@AnimObjects3D/NumberPlane3D.ts')
      NumberPlane3D = numberPlane3DModule.default
      let complexPlane3DModule = await import(
        '@AnimObjects3D/ComplexPlane3D.ts'
      )
      ComplexPlane3D = complexPlane3DModule.default
      let text3DModule = await import('@AnimObjects3D/Text3D.ts')
      Text3D = text3DModule.default
      let create3DModule = await import('@transitions/Create3D.ts')
      Create3D = create3DModule.default
      let fadeIn3DModule = await import('@transitions/FadeIn3D.ts')
      FadeIn3D = fadeIn3DModule.default
      let fadeOut3DModule = await import('@transitions/FadeOut3D.ts')
      FadeOut3D = fadeOut3DModule.default
      resolve(scene3D)
    }
  })
}

const destroyScenes = () => {
  scene2D.destroy()
  if (scene3D) {
    scene3D.destroy()
  }
}

const resetScene = (clearDebuggingData = false) => {
  if (!window) return

  clearDebuggingData && error.hide()
  clearDebuggingData && logger.clear()
  svgData.clear()
  sliders.clear()
  buttons.clear()
  prompts.clear()
  scene2D.resetScene()
  scene3D?.resetScene()
}

export default () => {
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
    resetScene,
    init3DScene,
    scene3DInitialised() {
      return Boolean(scene3D)
    },
    destroyScenes,
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
      return scene == scene2D
        ? (scene as Scene2D).add(Create(object as AnimObject2D, config))
        : (scene as any).add(Create3D(object as AnimObject3D, config))
    },
    FadeIn: (object: AnimObject, config: any) => {
      return scene == scene2D
        ? (scene as Scene2D).add(FadeIn(object as AnimObject2D, config))
        : (scene as any).add(FadeIn3D(object as AnimObject3D, config))
    },
    FadeOut: (object: AnimObject, config: any) => {
      return scene == scene2D
        ? (scene as Scene2D).add(FadeOut(object as AnimObject2D, config))
        : (scene as any).add(FadeOut3D(object as AnimObject3D, config))
    },
    Morph: (object1: AnimObject, object2: AnimObject, config: any) => {
      return scene == scene2D
        ? Morph(object1 as AnimObject2D, object2 as AnimObject2D, config)
        : undefined
    },
  }

  const AnimObjects = {
    Point: (config: any) => {
      return scene == scene2D
        ? new Point({ ...config, scene })
        : new Point3D({ ...config, scene: scene as any })
    },
    Line: (config: any) => {
      return scene == scene2D
        ? new Line({ ...config, scene })
        : new Line3D({ ...config, scene: scene as any })
    },
    NumberPlane: (config: any) => {
      return scene == scene2D
        ? new NumberPlane({ ...config, scene })
        : new NumberPlane3D({ ...config, scene: scene as any })
    },
    Text: (config: any) => {
      return scene == scene2D
        ? new Text({ ...config, scene })
        : new Text3D({ ...config, scene: scene as any })
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
        : new ComplexPlane3D({ ...config, scene: scene as any })
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
      return new Surface({ ...config, scene: scene as any })
    },
  }

  // @ts-ignore
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
}
