import p5 from 'p5'
import AnimObject2D from '@core/AnimObject2D.ts'
import Line from '@AnimObjects2D/Line.ts'
import Color from '@auxiliary/Color.ts'
import { apply, derivative } from 'mathjs'
import {
  applyMixins,
  evaluate,
  parseDefinition,
} from '@helpers/miscellaneous.ts'
import Point from '@AnimObjects2D/Point.ts'
import { Transitions } from '@enums/transitions.ts'
import { Transition } from '@core/Transition.ts'
import {
  CurveAnchorPointProps,
  CurveAnchorLineProps,
  CurveProps,
} from '@interfaces/AnimObjects2D.ts'
import { Lines } from '@enums/AnimObjects2D.ts'
import { AnchorPoint } from '@mixins/miscellaneous.ts'

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
    this.y = parseDefinition(definition)
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
    let y = evaluate(this.y, { x, y: 0 })
    let point = new Point({
      ...config,
      x,
      y: -y,
      definition: this.y,
      parentData: {
        origin: this.parentData.origin,
        stepX: this.parentData.stepX,
        stepY: this.parentData.stepY,
      },
      scene: this.scene,
    })
    applyMixins(point, [AnchorPoint])
    this.anchorPoints.push(point as Point)
    console.log(this.anchorPoints)
    return point as Point
  }

  addTangent(config: CurveAnchorLineProps): Line {
    console.log(this.y)
    let x = config.x
    let y = evaluate(this.y, { x, y: 0 })
    let parts = this.y.split('=')
    let rhs = parts[parts.length - 1]
    // let length = config.length ? config.length : this.parentData.stepX * 2
    let transition = Transition(
      config.transition ? config.transition : Transitions.None
    )
    console.log(derivative(rhs, 'x').evaluate({ x }))
    let line = transition(
      new Line({
        ...config,
        form: Lines.SlopePoint,
        slope: -derivative(rhs, 'x').evaluate({ x }),
        point: { x, y },
        definition: this.y,
        parentData: {
          stepX: this.parentData.stepX,
          stepY: this.parentData.stepY,
          origin: this.parentData.origin,
        },
        scene: this.scene,
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
      ;(this as any)[name].forEach((o: AnimObject2D) => o.draw(p))
    })
  }
}
