import { Prompt } from '@/mixins/Prompt'
import { reactive } from 'vue'
import { PromptsReactive } from '@/interfaces/ui'

export const prompts: PromptsReactive = reactive<PromptsReactive>({
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
  getPrompt() {},
})