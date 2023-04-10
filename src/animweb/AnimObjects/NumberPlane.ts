import AnimObject, { AnimObjectProps, AnimObjects } from '../AnimObject'
import p5 from 'p5'
import Point, { PointProps } from '../AnimObjects/Point'
import Curve from './../AnimObjects/Curve'
import Line, { Lines } from './Line'
import Colors from '../helpers/Colors'
import Color from '../helpers/Color'
import TransitionProps, { Transition, Transitions } from '../Transition'
import Constants from '../helpers/Constants'
import ImplicitCurve from './ImplicitCurve'
import { Matrix, matrix } from 'mathjs'

interface NumberPlaneProps extends AnimObjectProps {
  stepX?: number
  stepY?: number
  step?: number
  width?: number
  height?: number
  x?: number
  y?: number
  origin?: { x: number; y: number }
  showTicks?: boolean
  grid?: boolean
  xGrid?: boolean
  yGrid?: boolean
}

interface ImplicitCurvePlotProps extends AnimObjectProps {
  definition: string
  sampleRate?: number
  thickness?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
}

interface CurvePlotProps extends AnimObjectProps {
  definition: string
  domain?: [number, number]
  sampleRate?: number
  thickness?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
}

interface PointPlotProps extends AnimObjectProps {
  x: number
  y: number
  z?: number
  size?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
}

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
  ticks: Array<Point> = []
  curves: Array<Curve> = []
  implicitCurves: Array<ImplicitCurve> = []
  axes: Array<Line> = []
  xTicks: Array<Point> = []
  yTicks: Array<Point> = []
  xGrid: Array<Line> = []
  yGrid: Array<Line> = []
  showTicks: boolean = true
  showXGrid: boolean = false
  showYGrid: boolean = false
  xRange: [number, number] | undefined
  yRange: [number, number] | undefined

  iterables = [
    'points',
    'ticks',
    'curves',
    'axes',
    'xTicks',
    'yTicks',
    'xGrid',
    'yGrid',
    'implicitCurves',
  ]

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
  }: NumberPlaneProps = {}) {
    super()
    this.stepX = stepX ? stepX : step
    this.stepY = stepY ? stepY : step
    this.width = width ? width : this.sceneWidth
    this.height = height ? height : this.sceneHeight
    this.x = x ? x : 0
    this.y = y ? y : 0
    this.origin = origin
      ? origin
      : { x: (this.x + this.width) / 2, y: (this.y + this.height) / 2 }

    this.showTicks = showTicks
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
            color: new Color(this.color.rgbaVals),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
          })
        )
      }

      // -ve x-axis
      for (let i = 1; i < Math.floor(this.width / this.stepX); i++) {
        this.xTicks.unshift(
          new Point({
            x: -i,
            y: 0,
            color: new Color(this.color.rgbaVals),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
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
            color: new Color(this.color.rgbaVals),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
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
            color: new Color(this.color.rgbaVals),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
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
            color: new Color(this.color.rgbaVals),
            maxAlpha: 0.3,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
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
            color: new Color(this.color.rgbaVals),
            maxAlpha: 0.3,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
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
            color: new Color(this.color.rgbaVals),
            maxAlpha: 0.3,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
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
            color: new Color(this.color.rgbaVals),
            maxAlpha: 0.3,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
          })
        )
      }
    }

    this.axes.push(
      new Line({
        form: Lines.SlopePoint,
        slope: Constants.Infinity,
        point: { x: 0, y: 0 },
        color: new Color(this.color.rgbaVals),
        parentData: {
          origin: this.origin,
          stepX: this.stepX,
          stepY: this.stepY,
        },
      })
    )
    this.axes.push(
      new Line({
        form: Lines.SlopePoint,
        slope: 0,
        point: { x: 0, y: 0 },
        color: new Color(this.color.rgbaVals),
        parentData: {
          origin: this.origin,
          stepX: this.stepX,
          stepY: this.stepY,
        },
      })
    )
  }

  draw(p: p5) {
    this.iterables.forEach((name: string) => {
      //@ts-ignore
      this[name].forEach((o: AnimObject) => o.draw(p))
    })
  }

  point(config: PointPlotProps): Point {
    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    let transitionOptions = config.transitionOptions
      ? config.transitionOptions
      : {}
    let point = transition<Point>(
      new Point({
        ...config,
        parentData: {
          stepX: this.stepX,
          stepY: this.stepY,
          origin: this.origin,
        },
      }),
      transitionOptions
    )
    this.points.push(point)
    return point
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
    let curve = transition<Curve>(
      new Curve({
        ...config,
        domain,
        range,
        sampleRate,
        parentData: {
          stepX: this.stepX,
          stepY: this.stepY,
          origin: this.origin,
        },
      }),
      transitionOptions
    )
    curve.updateTransitionQueueFunctions(
      this.queueTransition,
      this.unqueueTransition,
      this.waitBeforeTransition
    )
    this.curves.push(curve)
    return curve
  }

  plotImplicit(config: ImplicitCurvePlotProps): ImplicitCurve {
    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    let transitionOptions = config.transitionOptions
      ? config.transitionOptions
      : {}

    let implicitCurve = transition<ImplicitCurve>(
      new ImplicitCurve({
        ...config,
        parentData: {
          stepX: this.stepX,
          stepY: this.stepY,
          origin: this.origin,
        },
      }),
      transitionOptions
    )
    implicitCurve.updateTransitionQueueFunctions(
      this.queueTransition,
      this.unqueueTransition,
      this.waitBeforeTransition
    )
    this.implicitCurves.push(implicitCurve)
    return implicitCurve
  }

  async transform(lt: [[number, number], [number, number]] | Matrix) {
    let ltMatrix: any
    if (lt instanceof Matrix) ltMatrix = lt
    else ltMatrix = matrix(lt)
    this.iterables.forEach((name: string) => {
      //@ts-ignore
      this[name].forEach((o: AnimObject) => o.transform({ ltMatrix }))
    })
  }
}
