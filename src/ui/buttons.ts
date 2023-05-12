import { Button } from '@/mixins/Button'
import { reactive } from 'petite-vue'

export const buttons = reactive({
  buttons: [],
  addButton(button: Button) {
    this.buttons.push(button)
    console.log(button)
  },
  getButton(id: string) {
    return this.buttons.find((button: Button) => button.id === id)
  },
  removeButton(id: string) {
    this.buttons = this.buttons.filter((button: Button) => button.id !== id)
  },
  clear() {
    this.buttons = []
  },
})

export const UserButtons = () => {
  return {
    $template: '#user-buttons-template',
  }
}
