import { reactive } from 'petite-vue'
import Color from '../animweb/helpers/Color'
import Complex from '../animweb/helpers/Complex'
import Matrix from '../animweb/helpers/Matrix'

export const code = reactive({
  hidden: false,
  show() {
    this.hidden = false
  },
  hide() {
    this.hidden = true
  },
})

export const error = reactive({
  hidden: true,
  message: '',
  lineNumber: 0,
  type: '',
  show(errType: string, errMessage: string, errLineNumber: number) {
    console.log(arguments)
    this.message = errMessage
    this.lineNumber = errLineNumber
    this.type = errType
    this.hidden = false
  },
  hide() {
    this.hidden = true
  },
})

export const logger = reactive({
  logs: [],
  logComplex(complex: Complex) {
    this.logs.push({
      title: 'Complex Number',
      string: complex.toString(),
      type: 'complex',
    })
  },
  logMatrix(matrix: Matrix) {},
  logColor(color: Color) {
    this.logs.push({
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
    this.logs = []
  },
})
