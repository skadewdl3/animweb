import { reactive } from 'vue'
import { CodeReactive } from '@interfaces/ui.ts'
import { editor } from './editor'

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
  async toggleMode() {
    code.mode = code.mode == '2D' ? '3D' : '2D'
    if (code.mode == '3D' && !window.WebAnim.scene3DInitialised()) {
      editor.disabled = true
      await window.WebAnim.init3DScene()
      editor.disabled = false
    }
    window.WebAnim.render(code.mode, () => (editor.disabled = !editor.disabled))
  },
})

export default code
