import AnimObject from '@/core/AnimObject2D'
import p5 from 'p5'
import Point from './Point'
import Curve from './Curve'
import Line from './Line'
import { Lines } from '@/enums/AnimObjects2D'
import { Transition } from '@core/Transition'
import { Transitions } from '@/enums/transitions'
import { RenderingModes } from '@/enums/miscellaneous'
import Constants from '@helpers/Constants'
import ImplicitCurve from './ImplicitCurve'
import { matrix } from 'mathjs'
import Matrix from '@auxiliary/Matrix'
import {
  PointPlotProps,
  ImplicitCurvePlotProps,
  CurvePlotProps,
  NumberPlaneProps,
  VectorProps,
  LinearTransformProps,
} from '@interfaces/AnimObjects2D'
import Vector from './Vector'

export default class NumberPlane extends AnimObject {
  stepX: number
  stepY: number
  width: number
  height: number
  x: number
  y: number
  origin: {
    x: number
    y: number
  }
  points: Array<Point> = []
  curves: Array<Curve> = []
  implicitCurves: Array<ImplicitCurve> = []
  axes: Array<Line> = []
  xTicks: Array<Point> = []
  yTicks: Array<Point> = []
  xGrid: Array<Line> = []
  yGrid: Array<Line> = []
  vectors: Array<Vector> = []
  showTicks: boolean = true
  showXGrid: boolean = false
  showYGrid: boolean = false
  xRange: [number, number] | undefined
  yRange: [number, number] | undefined

  iterables = [
    'points',
    'curves',
    'axes',
    'xTicks',
    'yTicks',
    'xGrid',
    'yGrid',
    'implicitCurves',
    'vectors',
  ]

  planeComponents = ['xTicks', 'yTicks', 'xGrid', 'yGrid']
  drawnComponents = ['points', 'curves', 'axes', 'implicitCurves', 'vectors']

  constructor({
    stepX,
    stepY,
    step = 50,
    width,
    height,
    x = 0,
    y = 0,
    origin,
    color,
    showTicks = true,
    grid = false,
    xGrid,
    yGrid,
    scene,
  }: NumberPlaneProps) {
    super(scene)
    this.stepX = stepX ? stepX : step
    this.stepY = stepY ? stepY : step
    this.width = width ? width : this.scene.width
    this.height = height ? height : this.scene.height
    this.x = x ? x : 0
    this.y = y ? y : 0
    this.origin = origin
      ? origin
      : this.scene.mode == RenderingModes._3D
      ? { x: 0, y: 0 }
      : { x: (this.x + this.width) / 2, y: (this.y + this.height) / 2 }

    this.showTicks = showTicks
    if (color) {
      this.color = color
      console.log(this.color)
    }
    if (xGrid) {
      this.showXGrid = true
    }
    if (yGrid) {
      this.showYGrid = true
    }
    if (grid) {
      this.showXGrid = true
      this.showYGrid = true
    }

    // +ve x-axis
    if (this.showTicks) {
      for (let i = 0; i < Math.floor(this.width / this.stepX); i++) {
        this.xTicks.push(
          new Point({
            x: i,
            y: 0,
            color: this.color.copy(),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
            scene: this.scene,
          })
        )
      }

      // -ve x-axis
      for (let i = 1; i < Math.floor(this.width / this.stepX); i++) {
        this.xTicks.unshift(
          new Point({
            x: -i,
            y: 0,
            color: this.color.copy(),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
            scene: this.scene,
          })
        )
      }

      // +ve y-axis
      // shitty fix to show complete transformation. fix later.
      for (let i = 1; i < 2 * Math.floor(this.height / this.stepY); i++) {
        this.yTicks.push(
          new Point({
            y: i,
            x: 0,
            color: this.color.copy(),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
            scene: this.scene,
          })
        )
      }

      // -ve y-axis
      // shitty fix to show complete transformation. fix later.
      for (let i = 1; i < 2 * Math.floor(this.height / this.stepY); i++) {
        this.yTicks.unshift(
          new Point({
            y: -i,
            x: 0,
            color: this.color.copy(),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
            scene: this.scene,
          })
        )
      }
    }

    if (this.showXGrid) {
      // +ve x-axis
      for (let i = 0; i < Math.floor(this.width / this.stepX); i++) {
        this.xGrid.push(
          new Line({
            form: Lines.SlopePoint,
            slope: Constants.Infinity,
            point: { x: i, y: 0 },
            color: this.color.copy(),
            maxAlpha: 0.3,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
            scene: this.scene,
          })
        )
      }
      // -ve x-axis
      for (let i = 1; i < Math.floor(this.width / this.stepX); i++) {
        this.xGrid.unshift(
          new Line({
            form: Lines.SlopePoint,
            slope: Constants.Infinity,
            point: { x: -i, y: 0 },
            color: this.color.copy(),
            maxAlpha: 0.3,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
            scene: this.scene,
          })
        )
      }
    }
    if (this.showYGrid) {
      // +ve y-axis
      for (let i = 0; i < Math.floor(this.height / this.stepY); i++) {
        this.yGrid.push(
          new Line({
            form: Lines.SlopePoint,
            slope: 0,
            point: { x: 0, y: i },
            color: this.color.copy(),
            maxAlpha: 0.3,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
            scene: this.scene,
          })
        )
      }
      // -ve y-axis
      for (let i = 1; i < Math.floor(this.height / this.stepY); i++) {
        this.yGrid.unshift(
          new Line({
            form: Lines.SlopePoint,
            slope: 0,
            point: { x: 0, y: -i },
            color: this.color.copy(),
            maxAlpha: 0.3,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
            scene: this.scene,
          })
        )
      }
    }

    this.axes.push(
      new Line({
        form: Lines.SlopePoint,
        slope: Constants.Infinity,
        point: { x: 0, y: 0 },
        color: this.color.copy(),
        parentData: {
          origin: this.origin,
          stepX: this.stepX,
          stepY: this.stepY,
        },
        scene: this.scene,
      })
    )
    this.axes.push(
      new Line({
        form: Lines.SlopePoint,
        slope: 0,
        point: { x: 0, y: 0 },
        color: this.color.copy(),
        parentData: {
          origin: this.origin,
          stepX: this.stepX,
          stepY: this.stepY,
        },
        scene: this.scene,
      })
    )
  }

  draw(p: p5) {
    this.planeComponents.forEach((name: string) => {
      ;(this as any)[name].forEach((o: AnimObject) => o.draw(p))
    })

    this.drawnComponents.forEach((name: string) => {
      ;(this as any)[name].forEach((o: AnimObject) => o.draw(p))
    })
  }

  point(config: PointPlotProps): Point {
    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    let transitionOptions = config.transitionOptions
      ? config.transitionOptions
      : {}
    let point = transition(
      new Point({
        color: this.color.copy(),
        ...config,
        parentData: {
          stepX: this.stepX,
          stepY: this.stepY,
          origin: this.origin,
        },
        scene: this.scene,
      }),
      transitionOptions
    )
    this.points.push(point as Point)
    return point as Point
  }

  plot(config: CurvePlotProps): Curve {
    let domain: [number, number] = config.domain
      ? config.domain
      : [
          -Math.floor(this.width / (2 * this.stepX) - 1),
          Math.floor(this.width / (2 * this.stepX) - 1),
        ]

    let range: [number, number] = config.domain
      ? config.domain
      : [
          -Math.floor(this.height / (2 * this.stepY) - 1),
          Math.floor(this.height / (2 * this.stepY) - 1),
        ]

    let sampleRate: number = config.sampleRate
      ? config.sampleRate
      : Constants.curveSampleRate

    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    let transitionOptions = config.transitionOptions
      ? config.transitionOptions
      : {}
    let curve = transition(
      new Curve({
        color: this.color.copy(),
        ...config,
        domain,
        range,
        sampleRate,
        parentData: {
          stepX: this.stepX,
          stepY: this.stepY,
          origin: this.origin,
        },
        scene: this.scene,
      }),
      transitionOptions
    )
    this.curves.push(curve as Curve)
    return curve as Curve
  }

  plotImplicit(config: ImplicitCurvePlotProps): ImplicitCurve {
    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    let transitionOptions = config.transitionOptions
      ? config.transitionOptions
      : {}

    let implicitCurve = transition(
      new ImplicitCurve({
        color: this.color.copy(),
        ...config,
        parentData: {
          stepX: this.stepX,
          stepY: this.stepY,
          origin: this.origin,
        },
        scene: this.scene,
      }),
      transitionOptions
    )
    this.implicitCurves.push(implicitCurve as ImplicitCurve)
    return implicitCurve as ImplicitCurve
  }

  vector(config: VectorProps) {
    let vec = new Vector({
      color: this.color.copy(),
      ...config,
      parentData: {
        stepX: this.stepX,
        stepY: this.stepY,
        origin: this.origin,
      },
      scene: this.scene,
    })
    this.vectors.push(vec)
    return vec
  }

  async transform(
    lt: [[number, number], [number, number]] | Matrix,
    config: LinearTransformProps = { duration: 1 }
  ) {
    let ltMatrix: any
    if (lt instanceof Matrix) ltMatrix = lt
    else ltMatrix = matrix(lt)
    this.iterables.forEach((name: string) => {
      //@ts-ignore
      this[name].forEach((o: AnimObject) => o.transform(ltMatrix, config))
    })
  }
}
