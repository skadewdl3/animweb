import p5 from 'p5'
import { v4 as uuid } from 'uuid'
import Color from '../helpers/Color'
import Colors from '../helpers/Colors'
import AnimObject, { AnimObjectProps } from './../AnimObject'
import { roundOff } from '../helpers/miscellaneous'

interface ImplicitCurveProps extends AnimObjectProps {
  definition: string
  sampleRate?: number
  thickness?: number
  color?: Color
}

export default class ImplicitCurve extends AnimObject {
  definition: string = ''
  quadTree?: any
  thickness: number = 1
  color: Color = Colors.black
  sampleRate: number = 9
  calculatingQuadtree: boolean = false
  webWorker: Worker = new Worker(
    new URL('./../helpers/QuadTree.worker.js', import.meta.url),
    { type: 'module' }
  )
  graphicsBuffer: any
  shouldRedraw: boolean = true

  constructor(config: ImplicitCurveProps) {
    super()
    this.definition = config.definition
    if (config.parentData) {
      this.parentData = {
        ...this.parentData,
        ...config.parentData,
      }
    }
    if (config.thickness) this.thickness = config.thickness
    if (config.color) this.color = config.color
    if (config.sampleRate) this.sampleRate = config.sampleRate / 100
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
        origin: this.parentData.origin,
        stepX: this.parentData.stepX,
        stepY: this.parentData.stepY,
        maxDepth: this.sampleRate,
        id: this.id,
      })

      this.webWorker.onmessage = ({ data }) => {
        this.quadTree = JSON.parse(data)
        this.calculatingQuadtree = false
        this.webWorker.terminate()
      }
    }
  }

  drawQuadtree(p: p5, q: any) {
    if (q.ne) {
      this.drawQuadtree(p, q.ne)
      this.drawQuadtree(p, q.nw)
      this.drawQuadtree(p, q.se)
      this.drawQuadtree(p, q.sw)
    } else {
      if (q.contours) {
        q.contours.forEach((contour: any) => {
          this.graphicsBuffer.line(
            contour.x1,
            contour.y1,
            contour.x2,
            contour.y2
          )
        })
      }
    }
  }

  draw(p: p5) {
    if (this.transition) this.transition()
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
    p.tint(255, roundOff(this.color.rgbaVals[3] * 255, 2))
    p.image(this.graphicsBuffer, 0, 0)
    this.graphicsBuffer.noStroke()
  }
}
