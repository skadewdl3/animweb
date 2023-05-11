import { Prompt } from '@/mixins/Prompt'
import { reactive } from 'petite-vue'

export const prompts = reactive({
  prompts: [],
  addPrompt(prompt: Prompt) {
    this.prompts.push(prompt)
    console.log(prompt)
  },
  removePrompt(id: string) {
    this.prompts = this.prompts.filter((prompt: Prompt) => prompt.id !== id)
  },
  clear() {
    this.prompts = []
  },
})

export const UserPrompts = () => {
  return {
    $template: '#user-prompts-template',
  }
}
