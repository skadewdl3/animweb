import { basicSetup, EditorView } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorReactive } from '@interfaces/ui.ts'
import { reactive } from 'vue'
import { getInlineCode, getElement } from '@helpers/miscellaneous.ts'

const resetScene = (c?: boolean) => {}

export const editor: EditorReactive = reactive<EditorReactive>({
  editor: null,
  create() {
    let defaultCode = `render('3D')
var plane = Create(NumberPlane())
await wait(2000)`
    // @ts-ignore
    this.editor = new EditorView({
      //@ts-ignore
      parent: document.querySelector('.codemirror-editor-container'),
      doc: defaultCode,
      extensions: [basicSetup, javascript(), EditorView.lineWrapping],
    })
    console.log(this.editor)
    // this.editor.setOption('theme', '3024-night')
  },
  run() {
    resetScene(true)
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
    resetScene()
  },
})
