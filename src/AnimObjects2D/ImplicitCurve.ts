import p5 from 'p5'
import Color from '@auxiliary/Color'
import Colors from '@helpers/Colors'
import AnimObject from '@/core/AnimObject2D'
import { ImplicitCurveProps } from '@/interfaces/AnimObjects2D'
import { createSVG, removeSVG } from '@/helpers/addSVG'
// @ts-ignore
import createKDTree from 'static-kdtree'

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

      let points: Array<[number, number]> = []

      this.webWorker.onmessage = ({ data }) => {
        this.quadTree = JSON.parse(data)
        this.calculatingQuadtree = false
        this.webWorker.terminate()
        let svg = [
          `<svg width="${this.scene.width}" height="${this.scene.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="`,
        ]
        let c = (q: any) => {
          if (q.ne) {
            c(q.ne)
            c(q.nw)
            c(q.se)
            c(q.sw)
          } else {
            if (q.contours) {
              q.contours.forEach((contour: any) => {
                points.push([contour.x1, contour.y1], [contour.x2, contour.y2])
                svg.push(
                  `M${contour.x1} ${contour.y1} L${contour.x2} ${contour.y2} `
                )
              })
            }
          }
        }
        c(this.quadTree)
        svg.push(
          '" stroke-width="1" fill="transparent" stroke="transparent"></path></svg>'
        )
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
