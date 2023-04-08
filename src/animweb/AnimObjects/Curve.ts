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
  thickness?: number
}

export default class Curve extends AnimObject {
  y: string
  sampleRate: number
  sections: Array<Line> = []
  domain: [number, number]
  range: [number, number]
  points: Array<{ x: number; y: number }> = []
  lines: Array<Line>
  thickness: number
  anchorPoints: Array<Point> = []
  anchorLines: Array<Line> = []
  iterables = ['lines', 'anchorPoints', 'anchorLines']

  constructor({
    definition,
    sampleRate,
    domain,
    color,
    range,
    thickness = 1,
    parentData,
  }: CurveProps) {
    super()
    this.y = definition
    this.sampleRate = sampleRate
    this.domain = domain
    this.range = range
    this.thickness = thickness
    this.lines = []
    if (parentData) {
      this.parentData = {
        ...this.parentData,
        ...parentData,
      }
    }
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
      this.points.push({ x, y })
    }
  }

  getLines() {
    for (let i = 0; i < this.points.length - 1; i++) {
      let p1 = this.points[i]
      let p2 = this.points[i + 1]
      this.lines.push(
        new Line({
          form: Lines.DoublePoint,
          x1: p1.x,
          x2: p2.x,
          y1: p1.y,
          y2: p2.y,
          domain: this.getAbsoluteDomain([p1.x, p2.x]),
          range: this.getAbsoluteRange([p1.y, p2.y]),
          color: new Color(this.color.rgbaVals),
          thickness: this.thickness,
          parentData: this.parentData,
        })
      )
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
          x: this.parentData.origin.x + x * this.parentData.stepX,
          y: this.parentData.origin.y - y * this.parentData.stepY,
          definition: this.y,
          parentData: {
            origin: this.parentData.origin,
            stepX: this.parentData.stepX,
            stepY: this.parentData.stepY,
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

  addTangent(config: CurveAnchorLineProps): Line {
    let x = config.x
    let y = evaluate(this.y, { x })
    let point = {
      x: x * this.parentData.stepX,
      y: y * this.parentData.stepY,
    }
    let parts = this.y.split('=')
    let rhs = parts[parts.length - 1]
    console.log(parts)
    // let length = config.length ? config.length : this.parentData.stepX * 2
    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    let line = transition<Line>(
      new Line({
        ...config,
        form: Lines.SlopePoint,
        slope: derivative(rhs, 'x').evaluate({ x }),
        point,
        definition: this.y,
        parentData: {
          stepX: this.parentData.stepX,
          stepY: this.parentData.stepY,
          origin: this.parentData.origin,
        },
      }),
      config.transitionOptions ? config.transitionOptions : {}
    )
    if (line instanceof Line) {
      this.anchorLines.push(line)
    }
    return line
  }

  draw(p: p5) {
    if (this.transition) {
      this.transition()
    }
    this.lines.forEach((line) => {
      line.draw(p)
    })
    this.anchorPoints.forEach((point) => {
      point.draw(p)
    })
    this.anchorLines.forEach((line) => {
      line.draw(p)
    })
  }
}
