import { evaluate } from 'mathjs'
import p5 from 'p5'
import AnimObject from './../AnimObject'
import Line, { Lines } from './Line'

enum Quadrants {
  ne = 'ne',
  nw = 'nw',
  se = 'se',
  sw = 'sw',
}

class Quadrant {
  value: number = 0
  direction: Quadrants
  x: number
  y: number
  width: number
  height: number
  constructor({
    value,
    direction,
    x,
    y,
    width,
    height,
  }: {
    value: number
    direction: Quadrants
    x: number
    y: number
    width: number
    height: number
  }) {
    this.value = value
    this.direction = direction
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  setValue(val: number) {
    this.value = val
  }
}

class QuadTree {
  ne: QuadTree | Quadrant
  nw: QuadTree | Quadrant
  se: QuadTree | Quadrant
  sw: QuadTree | Quadrant
  depth: number
  maxDepth: number = 9
  x: number = 0
  y: number = 0
  width: number = 0
  height: number = 0
  definition: string = ''

  valueFunction: (bl: number, br: number, tr: number, tl: number) => number = (
    bl,
    br,
    tr,
    tl
  ) => {
    return bl + 2 * br + 4 * tr + 8 * tl
  }
  evalDefinition: (x: number, y: number) => number

  constructor({
    x,
    y,
    width,
    height,
    definition,
    depth,
    evalDefinition,
  }: {
    x: number
    y: number
    width: number
    height: number
    definition: string
    depth: number
    evalDefinition: (x: number, y: number) => number
  }) {
    console.log('calculating quadtree')
    this.x = x
    this.y = y
    this.depth = depth
    this.width = width
    this.height = height
    this.definition = definition
    this.evalDefinition = evalDefinition
    this.ne = new Quadrant({
      value: 0,
      direction: Quadrants.ne,
      x: this.x + this.width / 2,
      y: this.y,
      width: this.width / 2,
      height: this.height / 2,
    })
    this.nw = new Quadrant({
      value: 0,
      direction: Quadrants.nw,
      x: this.x,
      y: this.y,
      width: this.width / 2,
      height: this.height / 2,
    })
    this.se = new Quadrant({
      value: 0,
      direction: Quadrants.se,
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      width: this.width / 2,
      height: this.height / 2,
    })
    this.sw = new Quadrant({
      value: 0,
      direction: Quadrants.sw,
      x: this.x,
      y: this.y + this.height / 2,
      width: this.width / 2,
      height: this.height / 2,
    })

    this.subdivide(this.ne)
    this.subdivide(this.nw)
    this.subdivide(this.se)
    this.subdivide(this.sw)
  }

  setValue() {}

  subdivide(q: Quadrant) {
    if (q instanceof Quadrant) {
      let bl, br, tr, tl, val
      switch (q.direction) {
        case Quadrants.ne:
          ;[bl, br, tr, tl] = [
            this.evalDefinition(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
            this.evalDefinition(this.x + this.width, this.y + this.height / 2),
            this.evalDefinition(this.x + this.width, this.y),
            this.evalDefinition(this.x, this.y),
          ]
          val = this.valueFunction(bl, br, tr, tl)
          if (val == 0 || val == 15) this.ne.setValue(val)
          else {
            if (this.depth <= this.maxDepth)
              this.ne = new QuadTree({
                definition: this.definition,
                x: this.x + this.width / 2,
                y: this.y,
                width: this.width / 2,
                height: this.height / 2,
                depth: this.depth + 1,
                evalDefinition: this.evalDefinition,
              })
            else this.ne.setValue(val)
          }
          break
        case Quadrants.nw:
          ;[bl, br, tr, tl] = [
            this.evalDefinition(this.x, this.y + this.height / 2),
            this.evalDefinition(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
            this.evalDefinition(this.x + this.width / 2, this.y),
            this.evalDefinition(this.x, this.y),
          ]
          val = this.valueFunction(bl, br, tr, tl)
          if (val == 0 || val == 15) this.nw.setValue(val)
          else {
            if (this.depth <= this.maxDepth)
              this.nw = new QuadTree({
                definition: this.definition,
                x: this.x,
                y: this.y,
                width: this.width / 2,
                height: this.height / 2,
                depth: this.depth + 1,
                evalDefinition: this.evalDefinition,
              })
            else this.nw.setValue(val)
          }
          break
        case Quadrants.se:
          ;[bl, br, tr, tl] = [
            this.evalDefinition(this.x + this.width / 2, this.y + this.height),
            this.evalDefinition(this.x + this.width, this.y + this.height),
            this.evalDefinition(this.x + this.width, this.y + this.height / 2),
            this.evalDefinition(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
          ]
          val = this.valueFunction(bl, br, tr, tl)
          if (val == 0 || val == 15) this.se.setValue(val)
          else {
            if (this.depth <= this.maxDepth)
              this.se = new QuadTree({
                definition: this.definition,
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                width: this.width / 2,
                height: this.height / 2,
                depth: this.depth + 1,
                evalDefinition: this.evalDefinition,
              })
            this.se.setValue(val)
          }
          break
        case Quadrants.sw:
          ;[bl, br, tr, tl] = [
            this.evalDefinition(this.x, this.y + this.height),
            this.evalDefinition(this.x + this.width / 2, this.y + this.height),
            this.evalDefinition(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
            this.evalDefinition(this.x, this.y + this.height / 2),
          ]
          val = this.valueFunction(bl, br, tr, tl)
          if (val == 0 || val == 15) this.sw.setValue(val)
          else {
            if (this.depth <= this.maxDepth)
              this.sw = new QuadTree({
                definition: this.definition,
                x: this.x,
                y: this.y + this.height / 2,
                width: this.width / 2,
                height: this.height / 2,
                depth: this.depth + 1,
                evalDefinition: this.evalDefinition,
              })
            else this.sw.setValue(val)
          }
          break
      }
    }
  }
}

export class ImplicitCurve extends AnimObject {
  definition: string = ''
  stepX: number
  stepY: number
  origin: { x: number; y: number }
  lines: Array<Line> = []
  quadTree: QuadTree

  constructor({
    definition,
    stepX,
    stepY,
    origin,
  }: {
    definition: string
    stepX: number
    stepY: number
    origin: { x: number; y: number }
  }) {
    super()
    this.definition = definition
    this.stepX = stepX
    this.stepY = stepY
    this.origin = origin
    this.quadTree = new QuadTree({
      x: 0,
      y: 0,
      width: this.sceneWidth,
      height: this.sceneHeight,
      definition: this.definition,
      depth: 0,
      evalDefinition: (x: number, y: number) => {
        let val = evaluate(this.definition, {
          x: (x - this.origin.x) / this.stepX,
          y: (this.origin.y - y) / this.stepY,
        })
        return val >= 0 ? 0 : 1
      },
    })
    console.log(this.quadTree)
  }

  interpolate(x1: number, y1: number, x2: number, y2: number) {
    let r = -y2 / (y1 - y2)

    if (r >= 0 && r <= 1) return r * (x1 - x2) + x2
    return (x1 + x2) * 0.5
  }

  drawQuadtree(p: p5, q: QuadTree | Quadrant) {
    let xMid, xMid1, xMid2
    if (q instanceof QuadTree) {
      // p.fill('#ff0000')
      this.drawQuadtree(p, q.ne)
      // p.fill('#00ff00')
      this.drawQuadtree(p, q.nw)
      // p.fill('#0000ff')
      this.drawQuadtree(p, q.se)
      // p.fill('#f0ff0f')
      this.drawQuadtree(p, q.sw)
      // p.noFill()
    } else {
      // p.rect(q.x, q.y, q.width, q.height)
      switch (q.value) {
        case 1:
        case 14:
          xMid = this.interpolate(
            q.x,
            q.x + q.width / 2,
            q.x + q.width / 2,
            q.y + q.height
          )
          p.line(q.x, q.y + q.height / 2, xMid, q.y + q.height / 2)
          p.line(xMid, q.y + q.height / 2, q.x + q.width / 2, q.y + q.height)

          break
        case 2:
        case 13:
          xMid = this.interpolate(
            q.x + q.width / 2,
            q.y + q.height,
            q.x + q.width,
            q.y + q.height / 2
          )
          p.line(q.x + q.width / 2, q.y + q.height, xMid, q.y + q.height / 2)

          p.line(xMid, q.y + q.height / 2, q.x + q.width, q.y + q.height / 2)
          break
        case 3:
        case 12:
          xMid = this.interpolate(
            q.x,
            q.y + q.height / 2,
            q.x + q.width,
            q.y + q.height / 2
          )
          p.line(q.x, q.y + q.height / 2, xMid, q.y + q.height / 2)
          p.line(xMid, q.y + q.height / 2, q.x + q.width, q.y + q.height / 2)
          break
        case 4:
        case 11:
          xMid = this.interpolate(
            q.x + q.width / 2,
            q.y,
            q.x + q.width,
            q.y + q.height / 2
          )
          p.line(q.x + q.width / 2, q.y, xMid, q.y + q.height / 2)
          p.line(xMid, q.y + q.height / 2, q.x + q.width, q.y + q.height / 2)
          break
        case 5:
          xMid1 = this.interpolate(
            q.x,
            q.y + q.height / 2,
            q.x + q.width / 2,
            q.y + q.height
          )
          xMid2 = this.interpolate(
            q.x + q.width / 2,
            q.y,
            q.x + q.width,
            q.y + q.height / 2
          )
          p.line(q.x, q.y + q.height / 2, xMid1, q.y + q.height)
          p.line(xMid1, q.y + q.height, q.x + q.width / 2, q.y + q.height)
          p.line(q.x + q.width / 2, q.y, xMid2, q.y + q.height / 2)
          p.line(xMid2, q.y + q.height / 2, q.x + q.width, q.y + q.height / 2)
          break
        case 10:
          xMid1 = this.interpolate(
            q.x,
            q.y + q.height / 2,
            q.x + q.width / 2,
            q.y
          )
          xMid2 = this.interpolate(
            q.x + q.width / 2,
            q.y + q.height,
            q.x + q.width,
            q.y + q.height / 2
          )
          p.line(q.x, q.y + q.height / 2, xMid1, q.y)
          p.line(xMid1, q.y, q.x + q.width / 2, q.y)
          p.line(q.x + q.width / 2, q.y + q.height, xMid2, q.y + q.height / 2)
          p.line(xMid2, q.y + q.height / 2, q.x + q.width, q.y + q.height / 2)
          break
        case 6:
        case 9:
          xMid = this.interpolate(
            q.x + q.width / 2,
            q.y + q.height,
            q.x + q.width / 2,
            q.y
          )
          p.line(q.x + q.width / 2, q.y + q.height, xMid, q.y)
          p.line(xMid, q.y, q.x + q.width / 2, q.y)
          break
        case 7:
        case 8:
          // xMid = this.interpolate(
          //   q.x,
          //   q.y + q.height / 2,
          //   q.x + q.width / 2,
          //   q.y
          // )
          // p.line(q.x, q.y + q.height / 2, xMid, q.y)
          // p.line(xMid, q.y, q.x + q.width / 2, q.y)
          // p.line(q.x, q.y + q.height / 2, q.x + q.width / 2, q.y)
          break
        default:
          return
      }
    }
  }

  draw(p: p5) {
    p.stroke('#000')
    p.strokeWeight(1)
    this.drawQuadtree(p, this.quadTree.ne)
    this.drawQuadtree(p, this.quadTree.nw)
    this.drawQuadtree(p, this.quadTree.se)
    this.drawQuadtree(p, this.quadTree.sw)
    p.noStroke()
  }
}
