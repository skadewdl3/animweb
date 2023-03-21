import { evaluate, round } from 'mathjs'
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

export interface PointProps extends AnimObjectProps {
  x: number
  y: number
  z?: number
  size?: number
  definition?: string
  parentData?: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  }
}

class Point extends AnimObject {
  x: number
  y: number
  z?: number
  size: number
  definition: string = ''
  parentData: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  } = { origin: { x: 0, y: 0 }, stepX: 1, stepY: 1 }

  constructor({
    x,
    y,
    z = 0,
    size = 5,
    color,
    definition,
    parentData,
  }: PointProps) {
    super()
    this.x = x
    this.y = y
    this.z = z
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
      if (observer.property == Observables.x)
        observer.handler(
          (this.x - this.parentData.origin.x) / this.parentData.stepX
        )
    })
  }

  setY(y: number) {
    console.log('this ran')
    this.y = y
    this.observers.forEach((observer: Observer) => {
      console.log('this ran 2')
      if (observer.property == Observables.y)
        observer.handler(
          (this.parentData.origin.y - this.y) / this.parentData.stepY
        )
    })
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer)
    switch (observer.property) {
      case Observables.x:
        observer.handler(
          (this.x - this.parentData.origin.x) / this.parentData.stepX
        )
        break
      case Observables.y:
        observer.handler(
          (this.parentData.origin.y - this.y) / this.parentData.stepY
        )
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
        this.queueTransition(transitionQueueItem)
        queued = true
        if (roundOff(this.x, 0) < roundOff(newX, 0)) {
          if (this.x + speed > newX) {
            this.setX(newX)
            this.setY(newY)
            this.transition = null
            this.unqueueTransition(transitionQueueItem)
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
            this.unqueueTransition(transitionQueueItem)
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

  draw(p: p5) {
    if (this.transition) {
      this.transition()
    }
    p.stroke(this.color.rgba)
    p.strokeWeight(this.size)
    p.point(this.x, this.y)
    p.noStroke()
  }
}

export default Point
