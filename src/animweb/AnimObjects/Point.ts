import { evaluate, matrix } from 'mathjs'
import p5 from 'p5'
import { v4 as uuid } from 'uuid'
import AnimObject, {
  AnimObjectProps,
  AnimObjects,
  Observables,
  Observer,
} from '../AnimObject'
import Color from '../helpers/Color'
import { roundOff } from '../helpers/miscellaneous'
import { rangePerFrame } from './../helpers/miscellaneous'
import Matrix from '../helpers/Matrix'
import { LinearTransformProps } from './NumberPlane'

export interface PointProps extends AnimObjectProps {
  x: number
  y: number
  size?: number
  definition?: string
}

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

  setX(x: number) {
    this.x = x
    this.observers.forEach((observer: Observer) => {
      if (observer.property == Observables.x) observer.handler(this.x)
    })
  }

  setY(y: number) {
    this.y = y
    this.observers.forEach((observer: Observer) => {
      if (observer.property == Observables.y) observer.handler(this.y)
    })
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer)
    switch (observer.property) {
      case Observables.x:
        observer.handler(this.x)
        break
      case Observables.y:
        observer.handler(this.y)
        break
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
            this.setX(newX)
            this.setY(newY)
            this.transition = null
            this.scene.dequeueTransition(transitionQueueItem)
            resolve()
          } else {
            this.setX(this.x + speed)
            this.setY(
              this.parentData.origin.y -
                evaluate(this.definition, {
                  x:
                    (this.x - this.parentData.origin.x) / this.parentData.stepX,
                }) *
                  this.parentData.stepY
            )
          }
        }
        if (roundOff(this.x, 0) > roundOff(newX, 0)) {
          if (this.x - speed < newX) {
            this.setX(newX)
            this.setY(newY)
            this.transition = null
            this.scene.dequeueTransition(transitionQueueItem)
            resolve()
          } else {
            this.setX(this.x - speed)
            this.setY(
              this.parentData.origin.y -
                evaluate(this.definition, {
                  x:
                    (this.x - this.parentData.origin.x) / this.parentData.stepX,
                }) *
                  this.parentData.stepY
            )
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
    let transitionQueueItem = {
      id: uuid(),
    }
    let queued = false
    this.transition = () => {
      let currentDistance = Math.sqrt(
        (newX - this.x) ** 2 + (newY - this.y) ** 2
      )
      if (!queued) {
        this.scene.enqueueTransition(transitionQueueItem)
        queued = true
      }
      if (roundOff(currentDistance, 2) == 0) {
        this.scene.dequeueTransition(transitionQueueItem)
        this.x = newX
        this.y = newY
        this.transition = null
      } else {
        let angle = Math.atan2(newY - this.y, newX - this.x)
        this.x += speed * Math.cos(angle)
        this.y += speed * Math.sin(angle)
      }
    }
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
