import p5 from 'p5'
import AnimObject, { AnimObjectProps } from '../AnimObject'
import Color from '../helpers/Color'
import Colors from '../helpers/Colors'
import { getQuadrant, radToDeg } from '../helpers/miscellaneous'

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
  head: { x: number; y: number } = { x: 0, y: 0 }
  tail: { x: number; y: number } = { x: 0, y: 0 }
  thickness: number = 1
  color: Color = Colors.black
  p: number = 5
  length: number = 0
  vertices: Array<{ x: number; y: number }> = []
  angle: number = 0

  constructor({
    form = Vectors.OriginCentered,
    x = 0,
    y = 0,
    head = { x: 0, y: 0 },
    tail = { x: 0, y: 0 },
    thickness = 1,
    color = Colors.black,
    parentData = {
      origin: { x: 0, y: 0 },
      stepX: 1,
      stepY: 1,
    },
  }) {
    super()
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

  calculateVertices() {
    let { x: headX, y: headY } = this.getAbsolutePosition(this.head)
    let { x: tailX, y: tailY } = this.getAbsolutePosition(this.tail)
    let distance = Math.sqrt((headX - tailX) ** 2 + (headY - tailY) ** 2)

    let t = distance / this.p
    let x = (1 - t) * headX + t * tailX
    let y = (1 - t) * headY + t * tailY

    let xAx = (headX - tailX) / (headY - tailY)
    let yAx = -1 / xAx
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
    let quadrant = getQuadrant(this.angle)
    if (quadrant == 2 || quadrant == 4 || (quadrant && quadrant < 0))
      p.rotate(Math.PI / 2 - this.angle)
    else p.rotate(this.angle)
    p.triangle(-this.p * 0.5, this.p, this.p * 0.5, this.p, 0, 0)
    p.pop()
    p.translate(-this.parentData.origin.x, -this.parentData.origin.y)
    p.noStroke()
    p.noFill()
  }
}
