import AnimObject, { AnimObjectProps, AnimObjects } from '../AnimObject'
import p5 from 'p5'
import Point, { PointProps } from '../AnimObjects/Point'
import Curve from './../AnimObjects/Curve'
import Line, { Lines } from './Line'
import StandardColors from '../helpers/StandardColors'
import Color from '../helpers/Color'
import TransitionProps, { Transition, Transitions } from '../Transition'
import Constants from '../helpers/Constants'
import ImplicitCurve from './ImplicitCurve'
import { matrix, multiply } from 'mathjs'

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
  grid: boolean = false

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
    this.grid = grid

    // +ve x-axis
    if (this.showTicks) {
      for (let i = 0; i < Math.floor(this.width / (2 * this.stepX)); i++) {
        this.xTicks.push(
          new Point({
            x: this.origin.x + this.stepX * i,
            y: this.origin.y,
            // color: new Color(this.color.rgbaVals),
            color: StandardColors.Blue(),
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
          })
        )
      }

      // -ve x-axis
      for (let i = 1; i < Math.floor(this.width / (2 * this.stepX)); i++) {
        this.xTicks.unshift(
          new Point({
            x: this.origin.x - this.stepX * i,
            y: this.origin.y,
            // color: new Color(this.color.rgbaVals),
            color: StandardColors.Blue(),
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
      for (let i = 1; i < 2 * Math.floor(this.height / (2 * this.stepY)); i++) {
        this.yTicks.push(
          new Point({
            x: this.origin.x,
            y: this.origin.y - this.stepY * i,
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
      for (let i = 1; i < 2 * Math.floor(this.height / (2 * this.stepY)); i++) {
        this.yTicks.unshift(
          new Point({
            x: this.origin.x,
            y: this.origin.y + this.stepY * i,
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

    if (this.grid) {
      for (let i = 0; i < Math.floor(this.width / (2 * this.stepX)); i++) {
        this.xGrid.push(
          new Line({
            form: Lines.SlopePoint,
            slope: Infinity,
            point: { x: this.origin.x + this.stepX * i, y: this.origin.y },
            color: new Color(this.color.rgbaVals),
            maxAlpha: 0.3,
          })
        )
      }

      // -ve x-axis
      for (let i = 1; i < Math.floor(this.width / (2 * this.stepX)); i++) {
        this.xGrid.unshift(
          new Line({
            form: Lines.SlopePoint,
            slope: Infinity,
            point: { x: this.origin.x - this.stepX * i, y: this.origin.y },
            color: new Color(this.color.rgbaVals),
            maxAlpha: 0.3,
          })
        )
      }

      // +ve y-axis
      for (let i = 1; i < Math.floor(this.height / (2 * this.stepY)); i++) {
        this.yGrid.push(
          new Line({
            form: Lines.SlopePoint,
            slope: 0,
            point: { x: this.origin.x, y: this.origin.y - this.stepY * i },
            color: new Color(this.color.rgbaVals),
            maxAlpha: 0.3,
          })
        )
      }

      // -ve y-axis
      for (let i = 1; i < Math.floor(this.height / (2 * this.stepY)); i++) {
        this.yGrid.unshift(
          new Line({
            form: Lines.SlopePoint,
            slope: 0,
            point: { x: this.origin.x, y: this.origin.y + this.stepY * i },
            color: new Color(this.color.rgbaVals),
            maxAlpha: 0.3,
          })
        )
      }
    }

    this.axes.push(
      new Line({
        form: Lines.SlopePoint,
        slope: -Infinity,
        point: { x: 0, y: 0 },
        color: new Color(this.color.rgbaVals),
      })
    )
    this.axes.push(
      new Line({
        form: Lines.SlopePoint,
        slope: 0,
        point: { x: 0, y: 0 },
        // color: new Color(this.color.rgbaVals),
        color: StandardColors.Blue(),
      })
    )
  }

  draw(p: p5) {
    this.axes.forEach((axes) => {
      axes.draw(p)
    })

    this.xTicks.forEach((tick) => {
      tick.draw(p)
    })
    this.yTicks.forEach((tick) => {
      tick.draw(p)
    })

    p.translate(-this.width / 2, 0)
    this.xGrid.forEach((line) => line.draw(p))
    p.translate(this.width / 2, 0)

    p.translate(0, +this.height / 2)
    this.yGrid.forEach((line) => line.draw(p))
    p.translate(0, -this.height / 2)

    this.points.forEach((point) => {
      point.draw(p)
    })

    this.curves.forEach((curve) => {
      curve.draw(p)
    })

    this.implicitCurves.forEach((implicitCurve) => {
      implicitCurve.draw(p)
    })
  }

  async point(config: PointPlotProps): Promise<Point> {
    return new Promise(async (resolve, reject) => {
      if (config.transition) {
        let transition = Transition(config.transition)
        let transitionOptions = config.transitionOptions
          ? config.transitionOptions
          : {}
        let point = await transition(
          new Point({
            ...config,
            x: this.origin.x + config.x * this.stepX,
            y: this.origin.y - config.y * this.stepY,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
          }),
          transitionOptions
        )
        if (point instanceof Point) {
          this.points.push(point)
        }
      } else {
        this.points.push(
          new Point({
            ...config,
            x: this.origin.x + config.x * this.stepX,
            y: this.origin.y - config.y * this.stepY,
            parentData: {
              stepX: this.stepX,
              stepY: this.stepY,
              origin: this.origin,
            },
          })
        )
      }
      resolve(this.points[this.points.length - 1])
    })
  }

  async plot(config: CurvePlotProps): Promise<Curve> {
    return new Promise(async (resolve, reject) => {
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

      if (config.transition) {
        let transition = Transition(config.transition)
        let transitionOptions = config.transitionOptions
          ? config.transitionOptions
          : {}
        let curve = await transition(
          new Curve({
            ...config,
            domain,
            range,
            sampleRate,
            stepX: this.stepX,
            stepY: this.stepY,
            origin: this.origin,
          }),
          transitionOptions
        )
        curve.updateTransitionQueueFunctions(
          this.queueTransition,
          this.unqueueTransition,
          this.waitBeforeTransition
        )
        console.log(curve)
        if (curve instanceof Curve) {
          this.curves.push(curve)
        }
      } else {
        let curve = new Curve({
          ...config,
          domain,
          range,
          sampleRate,
          stepX: this.stepX,
          stepY: this.stepY,
          origin: this.origin,
        })
        curve.updateTransitionQueueFunctions(
          this.queueTransition,
          this.unqueueTransition,
          this.waitBeforeTransition
        )
        this.curves.push(curve)
      }
      resolve(this.curves[this.curves.length - 1])
    })
  }

  async plotImplicit(config: ImplicitCurvePlotProps): Promise<ImplicitCurve> {
    return new Promise(async (resolve, reject) => {
      if (config.transition) {
        let transition = Transition(config.transition)
        let transitionOptions = config.transitionOptions
          ? config.transitionOptions
          : {}

        let implicitCurve = await transition(
          new ImplicitCurve({
            ...config,
            stepX: this.stepX,
            stepY: this.stepY,
            origin: this.origin,
          }),
          transitionOptions
        )
        implicitCurve.updateTransitionQueueFunctions(
          this.queueTransition,
          this.unqueueTransition,
          this.waitBeforeTransition
        )
        if (implicitCurve instanceof ImplicitCurve) {
          this.implicitCurves.push(implicitCurve)
          resolve(implicitCurve)
          // console.log(implicitCurve)
        }
      } else {
        let implicitCurve = new ImplicitCurve({
          ...config,
          stepX: this.stepX,
          stepY: this.stepY,
          origin: this.origin,
        })
        implicitCurve.updateTransitionQueueFunctions(
          this.queueTransition,
          this.unqueueTransition,
          this.waitBeforeTransition
        )
        this.implicitCurves.push(implicitCurve)
        resolve(implicitCurve)
      }
    })
  }

  async transform(lt: [[number, number], [number, number]]) {
    console.log(lt)
    let ltMatrix = matrix(lt)
    for (let tick of this.xTicks) {
      tick.transform(ltMatrix)
    }
    for (let tick of this.yTicks) {
      tick.transform(ltMatrix)
    }
    for (let axis of this.axes) {
      axis.transform(ltMatrix)
    }
    for (let point of this.points) {
      point.transform(ltMatrix)
    }
  }
}
