import { reactive } from 'vue'
import { ErrorReactive } from '@interfaces/ui.ts'

const error: ErrorReactive = reactive<ErrorReactive>({
  hidden: true,
  message: '',
  lineNumber: 0,
  type: '',
  show(errType: string, errMessage: string, errLineNumber?: number) {
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

export default error
