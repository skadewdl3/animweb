import p5 from 'p5'
import AnimObject, { AnimObjectProps, AnimObjects } from './../AnimObject'
import Line, { Lines } from './Line'
import Color from './../helpers/Color'
import { derivative, evaluate } from 'mathjs'
import Point from './Point'
import TransitionProps, { Transitions } from '../Transition'
import { Transition } from '../Transition'

interface CurveAnchorPointProps extends AnimObjectProps {
  x: number
  size?: number
  color?: Color
  transition?: Transitions
  transitionOptions?: TransitionProps
}

interface CurveAnchorLineProps extends AnimObjectProps {
  x: number
  length?: number
  thickness?: number
  color?: Color
  transition?: Transitions
  transitionOptions?: TransitionProps
}

export interface CurveProps extends AnimObjectProps {
  definition: string
  sampleRate: number
  domain: [number, number]
  range: [number, number]
  stepX: number
  stepY: number
  origin: { x: number; y: number }
  thickness?: number
}

export default class Curve extends AnimObject {
  y: string
  sampleRate: number
  sections: Array<Line> = []
  domain: [number, number]
  range: [number, number]
  stepX: number
  stepY: number
  points: Array<{ x: number; y: number }> = []
  lines: Array<Line>
  thickness: number
  anchorPoints: Array<Point> = []
  anchorLines: Array<Line> = []
  origin: { x: number; y: number }
  iterables = ['lines', 'anchorPoints', 'anchorLines']

  constructor({
    definition,
    sampleRate,
    domain,
    stepX,
    stepY,
    color,
    range,
    thickness = 1,
    origin,
  }: CurveProps) {
    super()
    this.y = definition
    this.sampleRate = sampleRate
    this.domain = domain
    this.range = range
    this.stepX = stepX
    this.stepY = stepY
    this.thickness = thickness
    this.lines = []
    this.origin = origin
    if (color) {
      this.color = color
    }
    this.getFunctionValues()
    this.getLines()
  }

  getFunctionValues() {
    let h = (this.domain[1] - this.domain[0]) / this.sampleRate
    let rhs = this.y
    if (rhs.includes('=')) rhs = rhs.split('=')[1]
    for (let x = this.domain[0]; x <= this.domain[1]; x += h) {
      let y = evaluate(rhs, { x })
      this.points.push({ x: x * this.stepX, y: y * this.stepY })
    }
  }

  getLines() {
    for (let i = 0; i < this.points.length - 1; i++) {
      let p1 = this.points[i]
      let p2 = this.points[i + 1]
      if (!(p2.y < -this.sceneHeight / 2 || p1.y > this.sceneHeight / 2)) {
        this.lines.push(
          new Line({
            form: Lines.DoublePoint,
            x1: p1.x,
            x2: p2.x,
            y1: p1.y,
            y2: p2.y,
            domain: [p1.x, p2.x],
            range: [p1.y, p2.y],
            color: new Color(this.color.rgbaVals),
            thickness: this.thickness,
          })
        )
      }
    }
  }

  async addAnchorPoint(config: CurveAnchorPointProps): Promise<Point> {
    return new Promise(async (resolve, reject) => {
      let x = config.x
      let y = evaluate(this.y, { x })
      let transition = Transition(
        config.transition ? config.transition : Transitions.None
      )
      let point = await transition(
        new Point({
          ...config,
          x: this.origin.x + x * this.stepX,
          y: this.origin.y - y * this.stepY,
          definition: this.y,
          parentData: {
            origin: this.origin,
            stepX: this.stepX,
            stepY: this.stepY,
          },
        }),
        config.transitionOptions ? config.transitionOptions : {}
      )
      if (point instanceof Point) {
        this.anchorPoints.push(point)
        resolve(point)
      } else {
        reject()
      }
    })
  }

  addAnchorLine(config: CurveAnchorLineProps): Promise<Line> {
    return new Promise(async (resolve, reject) => {
      let x = config.x
      let y = evaluate(this.y, { x })
      let point = {
        x: x * this.stepX,
        y: y * this.stepY,
      }
      let parts = this.y.split('=')
      let rhs = parts[parts.length - 1]
      let length = config.length ? config.length : this.stepX * 2
      let transition = Transition(
        config.transition ? config.transition : Transitions.None
      )
      let line = await transition(
        new Line({
          ...config,
          form: Lines.SlopePoint,
          slope: derivative(rhs, 'x').evaluate({ x }),
          point,
          definition: this.y,
          parentData: {
            stepX: this.stepX,
            stepY: this.stepY,
            origin: this.origin,
          },
        }),
        config.transitionOptions ? config.transitionOptions : {}
      )
      if (line instanceof Line) {
        this.anchorLines.push(line)
        resolve(line)
      } else {
        reject()
      }
    })
  }

  draw(p: p5) {
    if (this.transition) {
      this.transition()
    }
    this.lines.forEach(line => {
      line.draw(p)
    })
    this.anchorPoints.forEach(point => {
      point.draw(p)
    })
    this.anchorLines.forEach(line => {
      line.draw(p)
    })
  }
}
