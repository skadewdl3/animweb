import AnimObject, {
  AnimObjectProps,
  AnimObjects,
  Observables,
  Observer,
} from '../AnimObject'
import p5 from 'p5'
import Colors from '../helpers/StandardColors'
import {
  evaluate,
  derivative,
  round,
  unit,
  Matrix,
  matrix,
  multiply,
} from 'mathjs'
import { rangePerFrame, roundOff } from '../helpers/miscellaneous'

export enum Lines {
  DoublePoint,
  SlopePoint,
  SlopeIntercept,
  DoubleIntercept,
  Normal,
}

interface CommonLineProps extends AnimObjectProps {
  domain?: [number, number]
  range?: [number, number]
  thickness?: number
  parentData?: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  }
  definition?: string
  length?: number
}

interface DoublePointLineProps extends CommonLineProps {
  x1: number
  x2: number
  y1: number
  y2: number
  form: Lines.DoublePoint
}

interface SlopePointLineProps extends CommonLineProps {
  point: { x: number; y: number }
  slope: number
  form: Lines.SlopePoint
}

interface SlopeInterceptForm extends CommonLineProps {
  slope: number
  yIntercept?: number
  xIntercept?: number
  form: Lines.SlopeIntercept
}

interface DoubleInterceptForm extends CommonLineProps {
  xIntercept: number
  yIntercept: number
  form: Lines.DoubleIntercept
}

interface NormalForm extends CommonLineProps {
  distance: number
  alpha: number
  form: Lines.Normal
}

type LineProps =
  | DoublePointLineProps
  | SlopePointLineProps
  | SlopeInterceptForm
  | DoubleInterceptForm
  | NormalForm

export default class Line extends AnimObject {
  y: (x: number) => number = () => 0
  x: (y: number) => number = () => 0
  parentData: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  } = {
    origin: { x: this.sceneWidth / 2, y: this.sceneHeight / 2 },
    stepX: 1,
    stepY: 1,
  }
  slope: number = 1
  domain: [number, number] = [-this.sceneWidth / 2, this.sceneWidth / 2]
  range: [number, number] = [-this.sceneHeight / 2, this.sceneHeight / 2]
  thickness: number = 1
  definition: string = ''
  length: number = Infinity
  offset: number = 0

  constructor(config: LineProps) {
    super()
    if (config.domain) {
      this.domain = this.getAbsoluteDomain(config.domain)
    }
    if (config.color) {
      this.color = config.color
    }
    if (config.range) {
      this.range = this.getAbsoluteRange(config.range)
    }
    if (config.thickness) {
      this.thickness = config.thickness
    }
    if (config.maxAlpha) {
      this.maxAlpha = config.maxAlpha
      this.color.setAlpha(this.maxAlpha)
    }
    if (config.parentData) {
      this.parentData = {
        ...this.parentData,
        ...config.parentData,
      }
    }
    if (config.length) {
      this.length = config.length
    }
    if (config.definition) this.definition = config.definition
    switch (config.form) {
      case Lines.DoublePoint:
        let { x1: X1, y1: Y1, x2: X2, y2: Y2 } = config
        console.log(X1, Y1, X2, Y2)
        let { x: x1, y: y1 } = this.getAbsolutePosition({ x: X1, y: Y1 })
        let { x: x2, y: y2 } = this.getAbsolutePosition({ x: X2, y: Y2 })
        // console.log(this.getAbsolutePosition({ x: X1, y: Y1 }))
        let s = (y2 - y1) / (x2 - x1)
        this.setSlope(s)
        let c = y1 - this.slope * x1
        console.log(s, c)
        this.offset = c
        this.x = (y: number) => x1
        this.y = (x: number) => {
          return this.slope * x + this.offset
        }
        break
      case Lines.SlopePoint:
        let { point } = config
        let { x, y } = this.getAbsolutePosition(point)
        console.log(point, { x, y })

        this.setSlope(config.slope)
        this.offset = y - this.slope * x
        this.x = (y: number) => x
        this.y = (x: number) => {
          return this.slope * x + this.offset
        }
        break
      // woll fix whatever the fuck i did here when i understand what i did
      // case Lines.SlopeIntercept:
      //   let { xIntercept = 0, yIntercept = 0 } = config
      //   this.setSlope(config.slope)
      //   this.offset = yIntercept
      //   this.x = (y: number) =>
      //     xIntercept == Infinity || xIntercept == -Infinity
      //       ? yIntercept
      //       : xIntercept
      //   this.y = (x: number) => {
      //     return this.slope * x + this.offset
      //   }
      //   break
      case Lines.DoubleIntercept:
        let { xIntercept: relativeA, yIntercept: relativeB } = config
        let { a, b } = this.getAbsolutePosition(relativeA, relativeB)
        this.setSlope(-b / a)
        this.offset = b
        this.y = (x: number) => {
          return this.slope * x + this.offset
        }
        this.x = (y: number) => (a == Infinity || b == -Infinity ? b : a)
        break
      // case Lines.Normal:
      //   let { alpha, distance } = config
      //   this.y = (x: number) => {
      //     this.setSlope(-1 / Math.tan((3 * Math.PI) / 2 + alpha))
      //     return distance / Math.sin(alpha) + x * this.slope
      //   }
      // bug: case of slope = Infinty
      // fix this go awful code later
    }
    this.y = (x: number) => {
      return this.slope * x + this.offset
    }

    console.log('this ran')
  }

  setSlope(slope: number) {
    this.slope = slope
    this.observers.forEach((observer: Observer) => {
      if (observer.property == Observables.slope) observer.handler(this.slope)
    })
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer)
    switch (observer.property) {
      case Observables.slope:
        observer.handler(this.slope)
        break
    }
  }

  getLimitsFromLength(
    x: number,
    y: number
  ): {
    domain: [number, number]
    range: [number, number]
  } {
    if (this.length == Infinity) {
      return {
        domain: this.domain,
        range: this.range,
      }
    }
    let vector = {
      x: this.parentData.origin.x + x,
      y: this.parentData.origin.y + y,
    }
    let unitVector = {
      x: vector.x / (vector.x ** 2 + vector.y ** 2) ** 0.5,
      y: vector.y / (vector.x ** 2 + vector.y ** 2) ** 0.5,
    }
    let lengthVector = {
      x: unitVector.x * (this.length / 2) * this.parentData.stepX,
      y: unitVector.y * (this.length / 2) * this.parentData.stepY,
    }
    return {
      domain: [x - lengthVector.x, x + lengthVector.x],
      range: [y - lengthVector.y, y + lengthVector.y],
    }
  }

  moveTo({ x, duration = 1 }: { x: number; duration: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      let finalPoint = {
        x: x * this.parentData.stepX,
        y: evaluate(this.definition, { x }) * this.parentData.stepY,
      }

      let parts = this.definition.split('=')
      let rhs = parts[parts.length - 1]

      let finalSlope = derivative(rhs, 'x').evaluate({ x })
      this.transition = () => {
        let pointSpeed = rangePerFrame(
          Math.abs(this.x(1) - finalPoint.x),
          duration
        )

        if (roundOff(this.x(1), 0) < roundOff(finalPoint.x, 0)) {
          let nextPoint = {
            x: this.x(1) + pointSpeed,
            y:
              evaluate(rhs, {
                x: (this.x(1) + pointSpeed) / this.parentData.stepX,
              }) * this.parentData.stepY,
          }
          if (roundOff(this.x(1) + pointSpeed, 0) < roundOff(finalPoint.x, 0)) {
            this.setSlope(
              derivative(rhs, 'x').evaluate({
                x: nextPoint.x / this.parentData.stepX,
              })
            )
            this.x = (y: number) => nextPoint.x
            this.y = (x: number) => {
              return this.slope * x + (nextPoint.y - this.slope * nextPoint.x)
            }
            let { range, domain } = this.getLimitsFromLength(
              this.x(1),
              this.y(this.x(1))
            )
            this.domain = domain
            this.range = range
          } else {
            this.setSlope(finalSlope)
            this.x = (y: number) => finalPoint.x
            this.y = (x: number) => {
              return this.slope * x + (finalPoint.y - this.slope * finalPoint.x)
            }
            let { range, domain } = this.getLimitsFromLength(
              this.x(1),
              this.y(this.x(1))
            )
            this.domain = domain
            this.range = range
            this.transition = null
            resolve()
          }
        } else if (roundOff(this.x(1), 0) > roundOff(finalPoint.x, 0)) {
          let nextPoint = {
            x: this.x(1) - pointSpeed,
            y:
              evaluate(rhs, {
                x: (this.x(1) - pointSpeed) / this.parentData.stepX,
              }) * this.parentData.stepY,
          }
          if (roundOff(this.x(1) - pointSpeed, 0) > roundOff(finalPoint.x, 0)) {
            this.setSlope(
              derivative(rhs, 'x').evaluate({
                x: nextPoint.x / this.parentData.stepX,
              })
            )
            this.x = (y: number) => nextPoint.x
            this.y = (x: number) => {
              return this.slope * x + (nextPoint.y - this.slope * nextPoint.x)
            }
            let { range, domain } = this.getLimitsFromLength(
              this.x(1),
              this.y(this.x(1))
            )
            this.domain = domain
            this.range = range
          } else {
            this.setSlope(finalSlope)
            this.x = (y: number) => finalPoint.x
            this.y = (x: number) => {
              return this.slope * x + (finalPoint.y - this.slope * finalPoint.x)
            }
            let { range, domain } = this.getLimitsFromLength(
              this.x(1),
              this.y(this.x(1))
            )
            this.domain = domain
            this.range = range
            this.transition = null
            resolve()
          }
        }
      }
    })
  }

  transform(ltMatrix: Matrix): Promise<void> {
    return new Promise((resolve, reject) => {
      let x1: number, x2: number, y1: number, y2: number
      if (this.slope == Infinity || this.slope == -Infinity) {
        console.log('x', this.x(0))
        ;[x1, y1, x2, y2] = [this.x(0), 1, this.x(0), 2]
        let s = (y2 - y1) / (x2 - x1)
      } else if (this.slope == 0) {
        ;[x1, y1, x2, y2] = [1, this.y(this.x(0)), 2, this.y(this.x(0))]
        let s = (y2 - y1) / (x2 - x1)
      } else {
        ;[x1, y1, x2, y2] = [0, this.offset, this.x(0), this.y(this.x(0))]
      }
      console.log(x1, y1, x2, y2)

      let pInitial1 = matrix([[x1], [y1]])
      let pInitial2 = matrix([[x2], [y2]])
      let pFinal1 = multiply(ltMatrix, pInitial1).toArray()
      let pFinal2 = multiply(ltMatrix, pInitial2).toArray()
      // @ts-ignore
      x1 = pFinal1[0]
      // @ts-ignore
      y1 = pFinal1[1]
      // @ts-ignore
      x2 = pFinal2[0]
      // @ts-ignore
      y2 = pFinal2[1]
      let s = (y2 - y1) / (x2 - x1)
      this.setSlope(s)
      let c = y1 - this.slope * x1
      this.offset = c
      this.y = (x: number) => {
        return this.slope * x + c
      }
      this.x = (y: number) => x1
      resolve()
    })
  }

  draw(p: p5) {
    if (this.transition) this.transition()
    p.stroke(this.color.rgba)
    p.strokeWeight(this.thickness)
    p.translate(this.parentData.origin.x, this.parentData.origin.y)
    if (this.slope == Infinity || this.slope == -Infinity) {
      p.line(
        this.x(this.range[0]),
        -this.range[0],
        this.x(this.range[1]),
        -this.range[1]
      )
    } else {
      p.line(
        this.domain[0],
        -this.y(this.domain[0]),
        this.domain[1],
        -this.y(this.domain[1])
      )
    }

    let p1 = this.getAbsolutePosition({ x: 1, y: 1 })
    let p2 = this.getAbsolutePosition({ x: 2, y: 2 })
    p.line(p1.x, p1.y, p2.x, p2.y)
    p.translate(-this.parentData.origin.x, -this.parentData.origin.y)
    p.noStroke()
  }
}
