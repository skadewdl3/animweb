import { reactive } from 'petite-vue'
import Color from '@auxiliary/Color'
import Complex from '@auxiliary/Complex'
import Matrix from '@auxiliary/Matrix'

const logger = reactive({
  logs: [],
  logComplex(complex: Complex) {
    logger.logs.push({
      title: 'Complex Number',
      string: complex.toString(),
      type: 'complex',
    })
  },
  logMatrix(matrix: Matrix) {},
  logColor(color: Color) {
    logger.logs.push({
      type: 'color',
      title: 'Color',
      rgba: color.rgba,
      r: color.rgbaVals[0],
      g: color.rgbaVals[1],
      b: color.rgbaVals[2],
      a: color.rgbaVals[3],
      hex: color.hex,
    })
  },
  logArray(array: Array<any>) {},
  logObject(obj: object) {},
  log(config: any) {},
  clear() {
    logger.logs = []
  },
})

export default logger
