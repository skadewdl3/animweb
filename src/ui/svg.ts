import { reactive } from 'petite-vue'
import { SVGData } from '@/interfaces/helpers'
import { wait } from '@/helpers/miscellaneous'

export const svgData = reactive({
  svgs: [],
  async addSVG(svg: string, data: SVGData) {
    let svgItem = {
      svg,
      ...data,
      styles: {
        top: `${data.y}px`,
        left: `${data.x}px`,
        position: 'absolute',
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
