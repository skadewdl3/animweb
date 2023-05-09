import { reactive } from 'petite-vue'

const code = reactive({
  hidden: false,
  show() {
    code.hidden = false
  },
  hide() {
    code.hidden = true
  },
})

export default code
