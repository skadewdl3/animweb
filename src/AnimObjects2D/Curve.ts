import p5 from 'p5'
import AnimObject2D from '@/core/AnimObject2D'
import Line from '@AnimObjects2D/Line'
import Color from '@auxiliary/Color'
import { derivative } from 'mathjs'
import { evaluate } from '@helpers/miscellaneous'
import Point from '@AnimObjects2D/Point'
import { Transitions } from '@/enums/transitions'
import { Transition } from '@core/Transition'
import {
  CurveAnchorPointProps,
  CurveAnchorLineProps,
  CurveProps,
} from '@interfaces/AnimObjects2D'
import { Lines } from '@/enums/AnimObjects2D'

export default class Curve extends AnimObject2D {
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
    scene,
  }: CurveProps) {
    super(scene)
    let temp = definition
    let parts = temp.split('=')
    if (parts.length == 1) this.y = definition
    else {
      temp = parts[0]
      for (let part of parts) {
        if (part == parts[0]) continue
        temp = `${temp} - (${part})`
      }
      this.y = temp
    }
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
    for (let x = this.domain[0]; x <= this.domain[1]; x += h) {
      let y = evaluate(rhs, { x, y: 0 })
      this.points.push({ x, y: -y })
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
          scene: this.scene,
        })
      )
    }
  }

  addAnchorPoint(config: CurveAnchorPointProps): Point {
    let x = config.x
    let y = evaluate(this.y, { x })
    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    let point = transition(
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
    return point as Point
  }

  addTangent(config: CurveAnchorLineProps): Line {
    let x = config.x
    let y = evaluate(this.y, { x })
    let parts = this.y.split('=')
    let rhs = parts[parts.length - 1]
    // let length = config.length ? config.length : this.parentData.stepX * 2
    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    let line = transition(
      new Line({
        ...config,
        form: Lines.SlopePoint,
        slope: derivative(rhs, 'x').evaluate({ x }),
        point: { x, y },
        definition: this.y,
        parentData: {
          stepX: this.parentData.stepX,
          stepY: this.parentData.stepY,
          origin: this.parentData.origin,
        },
      }),
      config.transitionOptions ? config.transitionOptions : {}
    )
    this.anchorLines.push(line as Line)
    return line as Line
  }

  transform(lt: any) {}

  draw(p: p5) {
    if (this.transition) {
      this.transition()
    }
    this.iterables.forEach((name: string) => {
      // @ts-ignore
      this[name].forEach((o: AnimObject2D) => o.draw(p))
    })
  }
}