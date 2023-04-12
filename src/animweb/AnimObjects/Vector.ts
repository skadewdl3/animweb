import p5 from 'p5'
import AnimObject, { AnimObjectProps } from '../AnimObject'
import Color from '../helpers/Color'
import Colors from '../helpers/Colors'
import {
  degToRad,
  getQuadrant,
  radToDeg,
  rangePerFrame,
  roundOff,
} from '../helpers/miscellaneous'
import { multiply } from 'mathjs'
import Matrix from '../helpers/Matrix'
import { v4 as uuid } from 'uuid'
import { LinearTransformProps } from './NumberPlane'

export enum Vectors {
  OriginCentered = 'OriginCentered',
  Free = 'Free',
}

interface CommonVectorProps extends AnimObjectProps {
  form?: Vectors
}

interface OriginCenteredVectorProps extends CommonVectorProps {
  x: number
  y: number
}

interface FreeVectorProps extends CommonVectorProps {
  head: { x: number; y: number }
  tail: { x: number; y: number }
}

export type VectorProps = OriginCenteredVectorProps | FreeVectorProps

export default class Vector extends AnimObject {
  form: Vectors = Vectors.OriginCentered
  head: { x: number; y: number } = { x: 0, y: 0 }
  tail: { x: number; y: number } = { x: 0, y: 0 }
  thickness: number = 1
  p: number = 5
  length: number = 0
  vertices: Array<{ x: number; y: number }> = []
  angle: number = 0
  arrowApexAngle: number = Math.PI / 6
  arrowSideLength: number = 10

  constructor({
    form = Vectors.OriginCentered,
    x = 0,
    y = 0,
    head = { x: 0, y: 0 },
    tail = { x: 0, y: 0 },
    thickness = 3,
    color = Colors.black,
    parentData = {
      origin: { x: 0, y: 0 },
      stepX: 1,
      stepY: 1,
    },
  }) {
    super()
    this.form = form
    if (form == Vectors.OriginCentered) {
      this.head = { x, y }
      this.tail = { x: 0, y: 0 }
      this.length = Math.sqrt(x * x + y * y)
    } else if (form == Vectors.Free) {
      this.head = head
      this.tail = tail
      this.length = Math.sqrt((head.x - tail.x) ** 2 + (head.y - tail.y) ** 2)
    }
    this.angle = Math.atan2(
      this.head.y - this.tail.y,
      this.head.x - this.tail.x
    )
    this.thickness = thickness
    this.color = color
    this.parentData = parentData
  }

  calculateArrowVertices() {
    let quadrant = getQuadrant(radToDeg(this.angle))
    console.log(radToDeg(this.angle), quadrant)
    return quadrant
  }

  transform(ltMatrix: Matrix, { duration }: LinearTransformProps) {
    let headMatrix = Matrix.fromColumns([this.head.x, this.head.y])
    let newHeadMatrix = ltMatrix.multiply(headMatrix).toArray()

    let newHeadX = parseFloat(newHeadMatrix[0].toString())
    let newHeadY = parseFloat(newHeadMatrix[1].toString())

    let tailMatrix = Matrix.fromColumns([this.tail.x, this.tail.y])
    let newTailMatrix = ltMatrix.multiply(tailMatrix).toArray()

    let newTailX = parseFloat(newTailMatrix[0].toString())
    let newTailY = parseFloat(newTailMatrix[1].toString())

    let transitionQueueItem = {
      id: uuid(),
    }
    let queued = false

    let headXSpeed = rangePerFrame(newHeadX - this.head.x, duration)
    let headYSpeed = rangePerFrame(newHeadY - this.head.y, duration)
    let tailXSpeed = rangePerFrame(newTailX - this.tail.x, duration)
    let tailYSpeed = rangePerFrame(newTailY - this.tail.y, duration)

    this.transition = () => {
      if (!queued) {
        this.queueTransition(transitionQueueItem)
        queued = true
      }
      if (
        roundOff(this.head.x, 2) == roundOff(newHeadX, 2) &&
        roundOff(this.head.y, 2) == roundOff(newHeadY, 2) &&
        roundOff(this.tail.x, 2) == roundOff(newTailX, 2) &&
        roundOff(this.tail.y, 2) == roundOff(newTailY, 2)
      ) {
        this.transition = null
        this.unqueueTransition(transitionQueueItem)
        this.head.x = newHeadX
        this.head.y = newHeadY
        this.tail.x = newTailX
        this.tail.y = newTailY
        this.angle = Math.atan2(
          this.head.y - this.tail.y,
          this.head.x - this.tail.x
        )
      } else {
        this.head.x += headXSpeed
        this.head.y += headYSpeed
        this.tail.x += tailXSpeed
        this.tail.y += tailYSpeed
        this.angle = Math.atan2(
          this.head.y - this.tail.y,
          this.head.x - this.tail.x
        )
      }
    }
  }

  scale(scalar: number) {
    let linearTransform = Matrix.identity(2).multiply(scalar)
    this.transform(linearTransform, { duration: 1 })
  }

  rotate(angle: number) {
    let radians = degToRad(angle)
    let linearTransform = Matrix.fromAngle(radians)
    this.transform(linearTransform, { duration: 1 })
  }

  copy() {
    let newVector = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    )
    return newVector
  }

  draw(p: p5) {
    if (this.transition) this.transition()
    p.stroke(this.color.rgba)
    p.fill(this.color.rgba)
    p.strokeWeight(this.thickness)
    p.translate(this.parentData.origin.x, this.parentData.origin.y)
    let { x: headX, y: headY } = this.getAbsolutePosition(this.head)
    let { x: tailX, y: tailY } = this.getAbsolutePosition(this.tail)
    p.line(tailX, tailY, headX, headY)

    p.push()
    p.translate(headX, headY)
    let v1 = p.createVector(1, 0)
    v1.setHeading(Math.PI - this.angle - this.arrowApexAngle)
    v1.setMag(this.arrowSideLength)
    let v2 = p.createVector(1, 0)
    v2.setHeading(Math.PI - this.angle + this.arrowApexAngle)
    v2.setMag(this.arrowSideLength)

    p.beginShape()
    p.vertex(0, 0)
    p.vertex(v1.x, v1.y)
    p.vertex(v2.x, v2.y)
    p.endShape()

    p.pop()
    p.translate(-this.parentData.origin.x, -this.parentData.origin.y)
    p.noStroke()
    p.noFill()
  }
}
