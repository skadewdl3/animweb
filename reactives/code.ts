import { reactive } from 'vue'
import { CodeReactive } from '@interfaces/ui.ts'

const code: CodeReactive = reactive<CodeReactive>({
  hidden: false,
  mode: '2D',
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
  toggleMode() {
    code.mode = code.mode == '2D' ? '3D' : '2D'
  },
})

export default code
