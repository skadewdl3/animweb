import p5 from 'p5'
import AnimObject from '@core/AnimObject2D.ts'
import { ImplicitCurveProps } from '@interfaces/AnimObjects2D.ts'
import { createSVG, removeSVG } from '@helpers/addSVG.ts'

export default class ImplicitCurve extends AnimObject {
  definition: string = ''
  quadTree?: any
  thickness: number = 1
  sampleRate: number = 6
  calculatingQuadtree: boolean = false
  webWorker: Worker = new Worker(
    new URL('@workers/QuadTree.worker.js', import.meta.url),
    { type: 'module' }
  )
  graphicsBuffer: any
  shouldRedraw: boolean = true
  svgEl?: SVGElement
  contours: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
  animating?: boolean = false
  redraw: boolean = true
  show: boolean = true

  constructor(config: ImplicitCurveProps) {
    super(config.scene)
    let temp = config.definition
    let parts = temp.split('=')
    if (parts.length == 1) this.definition = config.definition
    else {
      temp = parts[0]
      for (let part of parts) {
        if (part == parts[0]) continue
        temp = `${temp} - (${part})`
      }
      this.definition = temp
    }
    if (config.parentData) {
      this.parentData = {
        ...this.parentData,
        ...config.parentData,
      }
    }
    if (config.thickness) this.thickness = config.thickness
    if (config.color) this.color = config.color
    if (config.sampleRate) this.sampleRate = config.sampleRate / 100
    this.calculateQuadtree()
  }

  calculateQuadtree() {
    this.calculatingQuadtree = true
    if (this.webWorker) {
      this.webWorker.postMessage({
        x: 0,
        y: 0,
        width: this.scene.width,
        height: this.scene.height,
        definition: this.definition,
        depth: 0,
        origin: this.parentData.origin,
        stepX: this.parentData.stepX,
        stepY: this.parentData.stepY,
        maxDepth: this.sampleRate,
        minDepth: 6,
        id: this.id,
      })

      this.webWorker.onmessage = ({ data }) => {
        this.contours = JSON.parse(data)
        this.calculatingQuadtree = false
        let svg = [
          `<svg width="${this.scene.width}" height="${this.scene.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`,
        ]
        for (let contour of this.contours) {
          let leftPoint = { x: contour.x1, y: contour.y1 }
          let rightPoint = { x: contour.x2, y: contour.y2 }
          if (contour.x1 > contour.x2) {
            leftPoint = { x: contour.x2, y: contour.y2 }
            rightPoint = { x: contour.x1, y: contour.y1 }
          }
          svg.push(
            `<path d="M${leftPoint.x} ${leftPoint.y} L${rightPoint.x} ${rightPoint.y}" stroke-width="${this.thickness}" fill="transparent" stroke="transparent"></path> `
          )
        }

        svg.push('</svg>')
        createSVG(svg.join(''), {
          id: this.id,
          x: 0,
          y: 0,
        }).then((el) => {
          this.svgEl = el
          this.remove = () => removeSVG(this.id)
        })
      }
    }
  }

  draw(p: p5) {
    if (this.transition) this.transition()
    if (!this.animating && this.redraw && this.contours.length != 0) {
      if (!this.graphicsBuffer)
        this.graphicsBuffer = p.createGraphics(
          this.scene.width,
          this.scene.height
        )
      this.graphicsBuffer.strokeWeight(this.thickness)
      this.graphicsBuffer.stroke(this.color.rgba)
      this.graphicsBuffer.noFill()
      for (let contour of this.contours) {
        this.graphicsBuffer.line(contour.x1, contour.y1, contour.x2, contour.y2)
      }
      this.redraw = false
    }
    if (this.show && this.graphicsBuffer) {
      p.image(this.graphicsBuffer, 0, 0)
    }
  }
}
