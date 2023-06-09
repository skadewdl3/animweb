import { createTransition } from '@core/Transition'
import Constants from '@helpers/Constants'
import { isNearlyEqual, rangePerFrame, roundOff } from '@helpers/miscellaneous'
import { evaluate, derivative } from 'mathjs'

export class AnchorPoint {
  [key: string]: any

  moveTo({ duration = 1, x }: { duration?: number; x: number }) {
    this.moveAlong({ definition: this.definition, duration, x })
  }
}

export class Tangent {
  [key: string]: any

  moveTo({ duration = 1, x }: { duration: number; x: number }) {
    let parts = this.definition.split('=')
    let rhs = parts[parts.length - 1]

    let finalPoint = {
      x,
      y: -evaluate(rhs, {
        x,
        y: 0,
      }),
    }

    let finalSlope = derivative(rhs, 'x').evaluate({ x, y: 0 })

    let xSpeed = rangePerFrame(x - this.currentX, 50)

    this.transition = createTransition(
      {
        onProgress: () => {
          let nextX = this.currentX + xSpeed
          let nextY = -evaluate(rhs, {
            x: nextX,
            y: 0,
          })
          this.slope = -derivative(rhs, 'x').evaluate({
            x: nextX,
            y: 0,
          })
          this.x = (y: number) => nextX * this.parentData.stepX
          this.y = (x: number) =>
            this.slope * x +
            (nextY * this.parentData.stepY -
              this.slope * (nextX * this.parentData.stepX))
          this.currentX = nextX
        },
        onEnd: () => {
          this.slope = finalSlope
          this.x = (y: number) => finalPoint.x * this.parentData.stepX
          this.y = (x: number) =>
            this.slope * x +
            (finalPoint.y * this.parentData.stepY -
              this.slope * finalPoint.x * this.parentData.stepX)
          this.currentX = finalPoint.x
        },
        endCondition: () => {
          return isNearlyEqual(this.currentX, finalPoint.x, 0.01)
        },
      },
      this
    )
  }
}
