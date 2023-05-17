// Core
import Scene2D from './Scene2D.ts'
import Scene3D from './Scene3D.ts'
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
import { roundOff, degToRad, radToDeg } from '@helpers/miscellaneous.ts'
import { Width, Height } from '@helpers/Dimensions.ts'

// Interfaces
import { AnimObject, Scene } from '@interfaces/core.ts'

// Mixins
import { createButton } from '@mixins/Button.ts'
import { createSlider } from '@mixins/Slider.ts'

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
import Create3D from '@transitions/Create3D.ts'
import FadeIn3D from '@transitions/FadeIn3D.ts'
import FadeOut3D from '@transitions/FadeOut3D.ts'

import { createPrompt } from '@mixins/Prompt.ts'
import { watch } from '@mixins/Watcher.ts'

let scene2D = new Scene2D(Width.full, Height.full, Colors.gray0)
let scene3D = new Scene3D(Width.full, Height.full, Colors.gray0)
scene2D.show()
scene3D.hide()
let scene: Scene = scene2D
scene = scene2D

export const resetScene = (clearDebuggingData = false) => {
  clearDebuggingData && error.hide()
  clearDebuggingData && logger.clear()
  svgData.clear()
  sliders.clear()
  buttons.clear()
  prompts.clear()
  scene2D.resetScene()
  scene3D.resetScene()
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
        : (scene as Scene3D).add(Create3D(object as AnimObject3D, config))
    },
    FadeIn: (object: AnimObject, config: any) => {
      return scene == scene2D
        ? (scene as Scene2D).add(FadeIn(object as AnimObject2D, config))
        : (scene as Scene3D).add(FadeIn3D(object as AnimObject3D, config))
    },
    FadeOut: (object: AnimObject, config: any) => {
      return scene == scene2D
        ? (scene as Scene2D).add(FadeOut(object as AnimObject2D, config))
        : (scene as Scene3D).add(FadeOut3D(object as AnimObject3D, config))
    },
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
