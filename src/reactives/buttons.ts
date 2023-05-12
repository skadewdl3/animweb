import { Button } from '@/mixins/Button'
import { reactive } from 'vue'
import { ButtonsReactive } from '@/interfaces/ui'

export const buttons: ButtonsReactive = reactive<ButtonsReactive>({
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
