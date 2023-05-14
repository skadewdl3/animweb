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
  toggle() {
    code.hidden = !code.hidden
    console.log(this.hidden)
  },
})

export default code
