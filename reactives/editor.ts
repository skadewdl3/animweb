import { basicSetup, EditorView } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorReactive } from '@interfaces/ui.ts'
import { reactive } from 'vue'
import { getInlineCode, getElement } from '@helpers/miscellaneous.ts'

declare global {
  interface Window {
    WebAnim: any
  }
}

export const editor: EditorReactive = reactive<EditorReactive>({
  editor: null,
  disabled: true,
  create() {
    let defaultCode = `var plane = Create(NumberPlane())
await wait(2000)`
    this.editor = new EditorView({
      parent: document.querySelector(
        '.codemirror-editor-container'
      ) as HTMLElement,
      doc: defaultCode,
      extensions: [basicSetup, javascript(), EditorView.lineWrapping],
    })
    console.log(this.editor)
  },
  run() {
    // @ts-ignore
    window.WebAnim.resetScene()
    let inlineCode = getInlineCode(this.editor)
    let script = document.createElement('script')
    script.type = 'module'
    script.className = 'user-script'
    script.appendChild(inlineCode)
    let prevScript = getElement('.user-script')
    if (prevScript) document.body.removeChild(prevScript)
    document.body.appendChild(script)
  },
  clear() {
    window.WebAnim.resetScene()
  },
})
