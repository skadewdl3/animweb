import { evaluate } from 'mathjs'
import p5 from 'p5'
import { v4 as uuid } from 'uuid'
import AnimObject from '@/core/AnimObject2D'
import { roundOff, rangePerFrame } from '@helpers/miscellaneous'
import Matrix from '@auxiliary/Matrix'
import { createTransition } from '@core/Transition'
import { PointProps, LinearTransformProps } from '@/interfaces/AnimObjects2D'

class Point extends AnimObject {
  x: number
  y: number
  size: number
  definition: string = ''

  constructor({
    x,
    y,
    size = 5,
    color,
    definition,
    parentData,
    scene,
  }: PointProps) {
    super(scene)
    this.x = x
    this.y = y
    this.size = size
    if (definition) this.definition = definition
    if (color) this.color = color
    if (this.parentData) {
      this.parentData = {
        ...this.parentData,
        ...parentData,
      }
    }
  }

  moveTo({ x, duration = 1 }: { x: number; duration?: number }): Promise<void> {
    let transitionQueueItem = {
      id: uuid(),
    }
    let queued = false
    return new Promise((resolve, reject) => {
      let y = evaluate(this.definition, { x })
      let newX = this.parentData.origin.x + x * this.parentData.stepX
      let newY = this.parentData.origin.y - y * this.parentData.stepY
      let speed = rangePerFrame(Math.abs(this.x - newX), duration)
      this.transition = () => {
        this.scene.enqueueTransition(transitionQueueItem)
        queued = true
        if (roundOff(this.x, 0) < roundOff(newX, 0)) {
          if (this.x + speed > newX) {
            this.x = newX
            this.y = newY
            this.transition = null
            this.scene.dequeueTransition(transitionQueueItem)
            resolve()
          } else {
            this.x = this.x + speed
            this.y =
              this.parentData.origin.y -
              evaluate(this.definition, {
                x: (this.x - this.parentData.origin.x) / this.parentData.stepX,
              }) *
                this.parentData.stepY
          }
        }
        if (roundOff(this.x, 0) > roundOff(newX, 0)) {
          if (this.x - speed < newX) {
            this.x = newX
            this.y = newY
            this.transition = null
            this.scene.dequeueTransition(transitionQueueItem)
            resolve()
          } else {
            this.x = this.x - speed
            this.y =
              this.parentData.origin.y -
              evaluate(this.definition, {
                x: (this.x - this.parentData.origin.x) / this.parentData.stepX,
              }) *
                this.parentData.stepY
          }
        }
      }
    })
  }

  transform(ltMatrix: Matrix, { duration }: LinearTransformProps) {
    let pInitial = Matrix.fromColumns([this.x, this.y])
    let pFinal = ltMatrix.multiply(pInitial).toArray()
    let newX = parseFloat(pFinal[0].toString())
    let newY = parseFloat(pFinal[1].toString())
    let distance = Math.sqrt((newX - this.x) ** 2 + (newY - this.y) ** 2)

    let speed = rangePerFrame(Math.abs(distance), duration)

    this.transition = createTransition({
      onEnd: () => {
        this.x = newX
        this.y = newY
      },
      endCondition: () => {
        let currentDistance = Math.sqrt(
          (newX - this.x) ** 2 + (newY - this.y) ** 2
        )
        return roundOff(currentDistance, 2) == 0
      },
      onProgress: () => {
        let angle = Math.atan2(newY - this.y, newX - this.x)
        this.x += speed * Math.cos(angle)
        this.y += speed * Math.sin(angle)
      },
      object: this,
    })
  }

  draw(p: p5) {
    if (this.transition) {
      this.transition()
    }
    p.stroke(this.color.rgba)
    p.strokeWeight(this.size)
    p.translate(this.parentData.origin.x, this.parentData.origin.y)
    let { x, y } = this.getAbsolutePosition({ x: this.x, y: this.y })
    p.point(x, y)
    p.translate(-this.parentData.origin.x, -this.parentData.origin.y)
    p.noStroke()
  }
}

export default Point
