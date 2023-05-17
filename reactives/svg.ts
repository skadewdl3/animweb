import { reactive } from 'vue'
import { SVGData } from '@interfaces/helpers.ts'
import { wait } from '@helpers/miscellaneous.ts'
import { SVGReactive } from '@interfaces/ui.ts'

export const svgData: SVGReactive = reactive<SVGReactive>({
  svgs: [],
  async addSVG(svg: string, data: SVGData) {
    let svgItem = {
      svg,
      ...data,
      styles: {
        top: `${data.y}px`,
        left: `${data.x}px`,
        position: 'absolute',
        display: data.hide ? 'none' : 'block',
      },
      svgElement: null,
      updateElement() {
        // @ts-ignore
        svgItem.svgElement = document.querySelector(`#${data.id}`)
      },
    }
    this.svgs.push(svgItem)
    while (!svgItem.svgElement) {
      await wait(100)
    }
    return svgItem.svgElement
  },
  clear() {
    this.svgs = []
  },
})

export const UserSVGs = () => {
  return {
    $template: '#user-svgs-template',
  }
}
