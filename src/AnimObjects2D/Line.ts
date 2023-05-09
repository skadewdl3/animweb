import AnimObject from '@/core/AnimObject2D'
import { Observables } from '@/enums/AnimObjects2D'
import { Observer } from '@/interfaces/core'
import p5 from 'p5'
import { evaluate, derivative } from 'mathjs'
import Matrix from '@auxiliary/Matrix'
import { rangePerFrame, roundOff } from '@helpers/miscellaneous'
import Constants from '@helpers/Constants'
import { LinearTransformProps } from './NumberPlane'
import { createTransition } from '@core/Transition'
import { Lines } from '@/enums/AnimObjects2D'
import { LineProps } from '@/interfaces/AnimObjects2D'

export default class Line extends AnimObject {
  y: Function = (x: number) => {
    return this.slope * x + this.offset
  }
  x: Function = () => {
    return -this.offset / this.slope
  }
  parentData: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  } = {
    origin: { x: this.scene.width / 2, y: this.scene.height / 2 },
    stepX: 1,
    stepY: 1,
  }
  slope: number = 1
  domain: [number, number] = [-this.scene.width / 2, this.scene.width / 2]
  range: [number, number] = [-this.scene.height / 2, this.scene.height / 2]
  thickness: number = 1
  definition: string = ''
  length: number = Infinity
  offset: number = 0
  point1: { x: number; y: number } = { x: 0, y: 0 }
  point2: { x: number; y: number } = { x: 0, y: 0 }

  constructor(config: LineProps) {
    super(config.scene)
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
      if (this.color.rgbaVals[3] > this.maxAlpha) {
        this.color.setAlpha(this.maxAlpha)
      }
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
        let { x: x1, y: y1 } = this.getAbsolutePosition({ x: X1, y: Y1 })
        y1 *= -1
        let s = (Y2 - Y1) / (X2 - X1)
        this.setSlope(s)
        let c = y1 - this.slope * x1
        this.offset = c
        this.point1 = { x: x1, y: y1 }
        this.point2 = { x: X2, y: Y2 }
        break
      case Lines.SlopePoint:
        let { point } = config
        let { x, y } = this.getAbsolutePosition(point)

        this.setSlope(config.slope)
        this.offset = y - this.slope * x

        this.point1 = { x, y }
        if (
          this.slope == Constants.Infinity ||
          this.slope == -Constants.Infinity
        ) {
          this.point2 = { x: this.point1.x, y: this.point1.y + 1 }
        }
        if (this.slope == 0) {
          this.point2 = { x: this.point1.x + 1, y: this.point1.y }
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

  transform(ltMatrix: Matrix, { duration }: LinearTransformProps) {
    let x1 = this.point1.x
    let y1 = this.point1.y
    let x2 = this.point2.x
    let y2 = this.point2.y

    let pInitial1 = Matrix.fromColumns([x1, y1])
    let pInitial2 = Matrix.fromColumns([x2, y2])
    let pFinal1 = ltMatrix.multiply(pInitial1).toArray()
    let pFinal2 = ltMatrix.multiply(pInitial2).toArray()

    let newX1 = parseFloat(pFinal1[0].toString())
    let newY1 = parseFloat(pFinal1[1].toString())
    let newX2 = parseFloat(pFinal2[0].toString())
    let newY2 = parseFloat(pFinal2[1].toString())

    let x1Speed = rangePerFrame(newX1 - x1, duration)
    let y1Speed = rangePerFrame(newY1 - y1, duration)
    let x2Speed = rangePerFrame(newX2 - x2, duration)
    let y2Speed = rangePerFrame(newY2 - y2, duration)

    this.transition = createTransition({
      onProgress: () => {
        x1 += x1Speed
        y1 += y1Speed
        x2 += x2Speed
        y2 += y2Speed
        let s = (y2 - y1) / (x2 - x1)
        if (s >= Constants.Infinity) s = Constants.Infinity
        if (s <= -Constants.Infinity) s = -Constants.Infinity
        this.setSlope(s)
        this.offset = y1 - this.slope * x1
      },
      onEnd: () => {
        this.point1 = { x: newX1, y: newY1 }
        this.point2 = { x: newX2, y: newY2 }
      },
      endCondition: () =>
        roundOff(x1, 2) == roundOff(newX1, 2) &&
        roundOff(y1, 2) == roundOff(newY1, 2) &&
        roundOff(x2, 2) == roundOff(newX2, 2) &&
        roundOff(y2, 2) == roundOff(newY2, 2),

      object: this,
    })
  }

  draw(p: p5) {
    if (this.transition) this.transition()
    p.stroke(this.color.rgba)
    p.strokeWeight(this.thickness)
    p.translate(this.parentData.origin.x, this.parentData.origin.y)
    if (this.slope == Constants.Infinity || this.slope == -Constants.Infinity) {
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

    p.translate(-this.parentData.origin.x, -this.parentData.origin.y)
    p.noStroke()
  }
}