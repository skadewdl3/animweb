import p5 from 'p5'
import Color from '@auxiliary/Color'
import Colors from '@helpers/Colors'
import AnimObject from '@/core/AnimObject2D'
import { ImplicitCurveProps } from '@/interfaces/AnimObjects2D'
import { createSVG, removeSVG } from '@/helpers/addSVG'
// @ts-ignore
import createKDTree from 'static-kdtree'
import { roundOff } from '@/helpers/miscellaneous'

export default class ImplicitCurve extends AnimObject {
  definition: string = ''
  quadTree?: any
  thickness: number = 1
  color: Color = Colors.black
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
        minDepth: 0,
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
            `<path d="M${leftPoint.x} ${leftPoint.y} L${rightPoint.x} ${rightPoint.y}" stroke-width="1" fill="transparent" stroke="transparent"></path> `
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
  }
}
