import { reactive } from 'vue'
import { CodeReactive } from '@/interfaces/ui'

const code: CodeReactive = reactive<CodeReactive>({
  hidden: false,
  show() {
    code.hidden = false
  },
  hide() {
    code.hidden = true
  },
})

export default code
