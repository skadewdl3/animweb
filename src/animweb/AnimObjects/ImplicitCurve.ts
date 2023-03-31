import p5 from 'p5'
import { v4 as uuid } from 'uuid'
import Color from '../helpers/Color'
import StandardColors from '../helpers/StandardColors'
import AnimObject, { AnimObjectProps } from './../AnimObject'

interface ImplicitCurveProps extends AnimObjectProps {
  definition: string
  sampleRate?: number
  stepX: number
  stepY: number
  origin: { x: number; y: number }
  thickness?: number
  color?: Color
}

export class ImplicitCurve extends AnimObject {
  definition: string = ''
  stepX: number
  stepY: number
  origin: { x: number; y: number }
  quadTree?: any
  thickness: number = 1
  color: Color = StandardColors.Black()
  sampleRate: number = 9
  calculatingQuadtree: boolean = false
  id: string = uuid()
  webWorker: Worker = new Worker(
    new URL('./../helpers/QuadTree.worker.js', import.meta.url),
    { type: 'module' }
  )
  graphicsBuffer: any
  shouldRedraw: boolean = true

  constructor(config: ImplicitCurveProps) {
    super()
    this.definition = config.definition
    this.stepX = config.stepX
    this.stepY = config.stepY
    this.origin = config.origin
    if (config.thickness) this.thickness = config.thickness
    if (config.color) this.color = config.color
    if (config.sampleRate) this.sampleRate = config.sampleRate / 100
  }

  interpolate(x1: number, y1: number, x2: number, y2: number) {
    let r = -y2 / (y1 - y2)

    if (r >= 0 && r <= 1) return r * (x1 - x2) + x2
    return (x1 + x2) * 0.5
  }

  calculateQuadtree() {
    this.calculatingQuadtree = true
    if (this.webWorker) {
      this.webWorker.postMessage({
        x: 0,
        y: 0,
        width: this.sceneWidth,
        height: this.sceneHeight,
        definition: this.definition,
        depth: 0,
        origin: this.origin,
        stepX: this.stepX,
        stepY: this.stepY,
        maxDepth: this.sampleRate,
        id: this.id,
      })

      this.webWorker.onmessage = ({ data }) => {
        console.log(JSON.parse(data))
        this.quadTree = JSON.parse(data)
        this.calculatingQuadtree = false
        this.webWorker.terminate()
      }
    }
  }

  drawQuadtree(p: p5, q: any) {
    let xMid, xMid1, xMid2
    if (q.ne) {
      this.drawQuadtree(p, q.ne)
      this.drawQuadtree(p, q.nw)
      this.drawQuadtree(p, q.se)
      this.drawQuadtree(p, q.sw)
    } else {
      switch (q.value) {
        case 1:
        case 14:
          xMid = this.interpolate(
            q.x,
            q.y + q.height / 2,
            q.x + q.width / 2,
            q.y + q.height
          )
          this.graphicsBuffer.line(
            q.x,
            q.y + q.height / 2,
            xMid,
            q.y + q.height / 2
          )
          this.graphicsBuffer.line(
            xMid,
            q.y + q.height / 2,
            q.x + q.width / 2,
            q.y + q.height
          )

          break
        case 2:
        case 13:
          xMid = this.interpolate(
            q.x + q.width / 2,
            q.y + q.height,
            q.x + q.width,
            q.y + q.height / 2
          )
          this.graphicsBuffer.line(
            q.x + q.width / 2,
            q.y + q.height,
            xMid,
            q.y + q.height / 2
          )

          this.graphicsBuffer.line(
            xMid,
            q.y + q.height / 2,
            q.x + q.width,
            q.y + q.height / 2
          )
          break
        case 3:
        case 12:
          xMid = this.interpolate(
            q.x,
            q.y + q.height / 2,
            q.x + q.width,
            q.y + q.height / 2
          )
          this.graphicsBuffer.line(
            q.x,
            q.y + q.height / 2,
            xMid,
            q.y + q.height / 2
          )
          this.graphicsBuffer.line(
            xMid,
            q.y + q.height / 2,
            q.x + q.width,
            q.y + q.height / 2
          )
          break
        case 4:
        case 11:
          xMid = this.interpolate(
            q.x + q.width / 2,
            q.y,
            q.x + q.width,
            q.y + q.height / 2
          )
          this.graphicsBuffer.line(
            q.x + q.width / 2,
            q.y,
            xMid,
            q.y + q.height / 2
          )
          this.graphicsBuffer.line(
            xMid,
            q.y + q.height / 2,
            q.x + q.width,
            q.y + q.height / 2
          )
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
          this.graphicsBuffer.line(
            q.x,
            q.y + q.height / 2,
            xMid1,
            q.y + q.height
          )
          this.graphicsBuffer.line(
            xMid1,
            q.y + q.height,
            q.x + q.width / 2,
            q.y + q.height
          )
          this.graphicsBuffer.line(
            q.x + q.width / 2,
            q.y,
            xMid2,
            q.y + q.height / 2
          )
          this.graphicsBuffer.line(
            xMid2,
            q.y + q.height / 2,
            q.x + q.width,
            q.y + q.height / 2
          )
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
          this.graphicsBuffer.line(q.x, q.y + q.height / 2, xMid1, q.y)
          this.graphicsBuffer.line(xMid1, q.y, q.x + q.width / 2, q.y)
          this.graphicsBuffer.line(
            q.x + q.width / 2,
            q.y + q.height,
            xMid2,
            q.y + q.height / 2
          )
          this.graphicsBuffer.line(
            xMid2,
            q.y + q.height / 2,
            q.x + q.width,
            q.y + q.height / 2
          )
          break
        case 6:
        case 9:
          xMid = this.interpolate(
            q.x + q.width / 2,
            q.y + q.height,
            q.x + q.width / 2,
            q.y
          )
          this.graphicsBuffer.line(q.x + q.width / 2, q.y + q.height, xMid, q.y)
          this.graphicsBuffer.line(xMid, q.y, q.x + q.width / 2, q.y)
          break
        case 7:
        case 8:
          xMid = this.interpolate(
            q.x,
            q.y + q.height / 2,
            q.x + q.width / 2,
            q.y
          )
          this.graphicsBuffer.line(q.x, q.y + q.height / 2, xMid, q.y)
          this.graphicsBuffer.line(xMid, q.y, q.x + q.width / 2, q.y)
          break
        default:
          return
      }
    }
  }

  draw(p: p5) {
    if (!this.graphicsBuffer) {
      this.graphicsBuffer = p.createGraphics(this.sceneWidth, this.sceneHeight)
    }
    this.graphicsBuffer.stroke(this.color.rgba)
    this.graphicsBuffer.strokeWeight(this.thickness)
    if (this.quadTree && this.shouldRedraw) {
      this.drawQuadtree(p, this.quadTree.ne)
      this.drawQuadtree(p, this.quadTree.nw)
      this.drawQuadtree(p, this.quadTree.se)
      this.drawQuadtree(p, this.quadTree.sw)
      this.shouldRedraw = false
    } else {
      if (!this.calculatingQuadtree) this.calculateQuadtree()
    }
    p.image(this.graphicsBuffer, 0, 0)
    this.graphicsBuffer.noStroke()
  }
}
