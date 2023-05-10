import { reactive } from 'petite-vue'
import { wait } from './miscellaneous'
import { SVGData } from '@/interfaces/helpers'


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
export const removeSVG = (identifier: string) => {
  svgData.svgs = svgData.svgs.filter((s: any) => {
    if (s.id === identifier) {
      s.svgElement.remove()
      return false
    }
    return true
  })
}

export const createSVG = async (
  svg: string,
  data: SVGData
): Promise<SVGElement> => {
  return await svgData.addSVG(svg, data)
}

export const UserSVGs = () => {
  return {
    $template: '#user-svgs-template',
  }
}
