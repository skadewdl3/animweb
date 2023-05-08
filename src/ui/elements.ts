import { reactive } from 'petite-vue'
import Color from '../auxiliary/Color'
import Complex from '../auxiliary/Complex'
import Matrix from '../auxiliary/Matrix'

export const code = reactive({
  hidden: false,
  show() {
    code.hidden = false
  },
  hide() {
    code.hidden = true
  },
})

export const error = reactive({
  hidden: true,
  message: '',
  lineNumber: 0,
  type: '',
  show(errType: string, errMessage: string, errLineNumber: number) {
    console.log(arguments)
    error.message = errMessage
    error.lineNumber = errLineNumber
    error.type = errType
    error.hidden = false
  },
  hide() {
    error.hidden = true
  },
})

export const logger = reactive({
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
