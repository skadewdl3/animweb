import { prompts } from '@reactives/prompts'
import { PromptProps } from '@interfaces/mixins'

import { v4 as uuid } from 'uuid'

export class Prompt {
  id: string
  submitListeners: Array<{ id: string; listener: Function }> = []
  inputListeners: Array<{ id: string; listener: Function }> = []

  constructor(config: PromptProps, watcher?: any) {
    this.id = uuid()
  }
}

export default class CreatePrompt {
  [key: string]: any
  createPrompt(config: PromptProps = {}) {
    let prompt = new Prompt(config, this)
    prompts.addPrompt(prompt)
    this.prompts.push(prompt)
    return prompt
  }
}

export const createPrompt = (config: PromptProps = {}) => {
  let prompt = new Prompt(config)
  prompts.addPrompt(prompt)
  return prompt
}
