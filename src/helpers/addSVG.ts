import { SVGData } from '@/interfaces/helpers'
import { svgData } from '@/ui/svg'

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
