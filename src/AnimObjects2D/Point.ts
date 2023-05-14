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

  // make point move along the curve
  moveTo({ x, duration = 1 }: { x: number; duration?: number }) {
    let newX = x
    let newY = -evaluate(this.definition, { x, y: 0 })
    let xSpeed = rangePerFrame(newX - this.x, duration)

    this.transition = createTransition({
      onProgress: () => {
        this.x += xSpeed
        this.y = -evaluate(this.definition, { x: this.x, y: 0 })
      },
      endCondition: () => {
        return (
          roundOff(this.x, 1) === roundOff(newX, 1) &&
          roundOff(this.y, 1) === roundOff(newY, 1)
        )
      },
      object: this,
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
