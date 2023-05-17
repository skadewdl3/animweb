import p5 from 'p5'
import AnimObject from '@core/AnimObject2D.ts'
import { createSVG, removeSVG } from '@helpers/addSVG.ts'
import { LaTeXProps } from '@interfaces/AnimObjects2D.ts'

export default class LaTeX extends AnimObject {
  latex: string = ''
  latexSVG: string = ''
  size: number = 16
  parentDiv?: p5.Element
  rendered: boolean = false
  position: { x: number; y: number } = { x: 0, y: 0 }
  webWorker: Worker = new Worker(
    new URL('@workers/TexToSVG.worker.js', import.meta.url),
    { type: 'module' }
  )
  svg?: string
  svgEl?: SVGElement
  x: number
  y: number

  constructor(config: LaTeXProps) {
    super(config.scene)
    this.latex = config.latex
    this.x = config.x
    this.y = config.y
    let temp = JSON.stringify(this.latex).split('')
    temp.splice(0, 1)
    temp.splice(-1, 1)
    this.webWorker.onmessage = ({ data }) => {
      // console.log(data)
      let template = document.createElement('template')
      template.innerHTML = data
      let svgElement = template.content.firstChild as SVGElement
      let uses = svgElement.querySelectorAll('use')
      svgElement.style.transform = `scale(${(this.size * 1.8) / 16})`
      svgElement.style.transformOrigin = `0 0`
      svgElement.querySelectorAll('rect').forEach((rect: SVGRectElement) => {
        let rectPath = document.createElement('path')
        console.log(getComputedStyle(rect))
        let x = rect.getAttribute('x')
          ? parseFloat(rect.getAttribute('x') || '0')
          : 0
        let y = rect.getAttribute('y')
          ? parseFloat(rect.getAttribute('y') || '0')
          : 0
        let width = rect.getAttribute('width')
          ? parseFloat(rect.getAttribute('width') || '0')
          : 0
        let height = rect.getAttribute('height')
          ? parseFloat(rect.getAttribute('height') || '0')
          : 0

        rectPath.setAttribute(
          'd',
          `M${x} ${y} h${width} v${height} h-${width} v-${height}`
        )
        rectPath.setAttribute('fill', 'transparent')
        rectPath.setAttribute('stroke', 'transparent')
        rectPath.setAttribute('stroke-width', '1rem')
        rect.parentElement?.appendChild(rectPath)
        rect.remove()
      })
      uses.forEach((use: any) => {
        let path = svgElement.querySelector(use.getAttribute('xlink:href'))
        path.style.fill = 'transparent'
        path.style.stroke = 'transparent'
        path.style.strokeWidth = '1rem'
        use.parentNode.prepend(path.cloneNode())
        use.remove()
      })
      let defs = svgElement.querySelector('defs')
      defs?.remove()
      template.innerHTML = ''
      template.content.appendChild(svgElement)
      createSVG(template.innerHTML, {
        id: this.id,
        y: this.parentData.origin.x + this.y,
        x: this.parentData.origin.y + this.x,
      }).then((el) => {
        this.svgEl = el
        this.remove = () => removeSVG(this.id)
      })
    }
    this.webWorker.postMessage({ latex: temp.join(''), type: 'latex' })
    if (config.color) this.color = config.color
    if (config.size) this.size = config.size
    if (config.parentData) {
      this.parentData = {
        ...this.parentData,
        ...config.parentData,
      }
    }
  }

  draw(p: p5) {
    if (this.transition) this.transition()
  }
}
