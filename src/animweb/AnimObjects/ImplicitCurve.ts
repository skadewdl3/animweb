import { evaluate } from 'mathjs'
import p5 from 'p5'
import AnimObject from './../AnimObject'
import Line, { Lines } from './Line'

export class ImplicitCurve extends AnimObject {
  definition: string = ''
  stepX: number
  stepY: number
  origin: { x: number; y: number }
  lines: Array<Line> = []
  quadTree?: any

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

    let worker = new Worker(
      new URL('./../helpers/QuadTree.worker.js', import.meta.url),
      { type: 'module' }
    )

    worker.postMessage({
      x: 0,
      y: 0,
      width: this.sceneWidth,
      height: this.sceneHeight,
      definition: this.definition,
      depth: 0,
      origin: this.origin,
      stepX: this.stepX,
      stepY: this.stepY,
      maxDepth: 9,
    })

    worker.onmessage = ({ data }) => {
      this.quadTree = JSON.parse(data)
    }
  }

  interpolate(x1: number, y1: number, x2: number, y2: number) {
    let r = -y2 / (y1 - y2)

    if (r >= 0 && r <= 1) return r * (x1 - x2) + x2
    return (x1 + x2) * 0.5
  }

  drawQuadtree(p: p5, q: any) {
    let xMid, xMid1, xMid2
    if (q.ne) {
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
          xMid = this.interpolate(
            q.x,
            q.y + q.height / 2,
            q.x + q.width / 2,
            q.y
          )
          p.line(q.x, q.y + q.height / 2, xMid, q.y)
          p.line(xMid, q.y, q.x + q.width / 2, q.y)
          break
        default:
          return
      }
    }
  }

  draw(p: p5) {
    p.stroke('#000')
    p.strokeWeight(3)
    if (this.quadTree) {
      this.drawQuadtree(p, this.quadTree.ne)
      this.drawQuadtree(p, this.quadTree.nw)
      this.drawQuadtree(p, this.quadTree.se)
      this.drawQuadtree(p, this.quadTree.sw)
    }
    p.noStroke()
  }
}
