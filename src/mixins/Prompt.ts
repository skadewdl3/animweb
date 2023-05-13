import { prompts } from '@reactives/prompts'
import { PromptProps } from '@interfaces/mixins'

import { v4 as uuid } from 'uuid'
import { Watcher } from './Watcher'
import { Properties } from '@/enums/mixins'
//@ts-ignore
import debounce from 'lodash.debounce'
import error from '@/reactives/error'

export class Prompt {
  id: string
  submitListeners: Array<{ id: string; listener: Function }> = []
  inputListeners: Array<{ id: string; listener: Function }> = []
  private watcher?: any
  description: string = ''
  title: string
  x: number
  y: number
  private property?: Properties
  private independent: boolean = true
  element?: HTMLElement
  tempValue: string = ''

  get value() {
    return this.watcher ? this.watcher.value : this.tempValue
  }

  set value(val: string) {
    if (this.watcher) this.watcher.value = val
    else this.tempValue = val
  }

  constructor(config: PromptProps, watcher?: any) {
    watcher && (this.watcher = watcher)
    this.title = config.title || ''
    config.description && (this.description = config.description)
    this.x = config.x || 0
    this.y = config.y || 0
    this.watcher = watcher
    if (watcher) {
      this.property = watcher.property
      this.independent = false
    }
    this.id = uuid()
  }

  executeSubmitListeners(val: any) {
    if (this.watcher) {
      this.watcher.executeMutation((o: any) => {
        o.value = val
        for (let listener of this.submitListeners) {
          listener.listener(val)
        }
      })
    } else {
      for (let listener of this.submitListeners) {
        listener.listener(val)
      }
      this.tempValue = val
    }
  }

  executeInputListeners(val: any) {
    if (this.watcher) {
      this.watcher.executeMutation((o: any) => {
        o.value = val
        for (let listener of this.inputListeners) {
          listener.listener(val)
        }
      })
    } else {
      for (let listener of this.inputListeners) {
        listener.listener(val)
      }
      this.tempValue = val
    }
  }

  executeSubmitListener(id: string) {}

  executeInputListener(id: string) {}

  onSubmit(listener: Function) {
    let id = uuid()
    this.submitListeners.push({ id, listener })
    return this.executeSubmitListener(id)
  }

  onInput(listener: Function) {
    let id = uuid()
    this.inputListeners.push({ id, listener })
    return this.executeInputListener(id)
  }

  updateElement() {
    this.element = document.getElementById(this.id) as HTMLElement
    let input = this.element.querySelector('input') as HTMLInputElement
    let button = this.element.querySelector('button') as HTMLButtonElement
    input.addEventListener(
      'input',
      debounce(
        (e: any) => {
          if (!this.independent) {
            this.value = e.target.value.toString()
            this.watcher.executeMutation((o: any) => {
              try {
                this.executeInputListeners(e.target.value)
              } catch (err: any) {
                error.show(err.name, err.message)
              }
            })
          } else {
            this.executeInputListeners(e.target.value)
          }
        },
        100,
        { leading: false }
      )
    )
    console.log(button)
    button.addEventListener(
      'click',
      debounce(
        () => {
          if (!this.independent) {
            this.watcher.executeMutation((o: any) => {
              try {
                o.value = input.value
                this.executeSubmitListeners(input.value)
              } catch (err: any) {
                error.show(err.name, err.message)
              }
            })
          } else {
            this.executeSubmitListeners(input.value)
          }
        },
        100,
        { leading: false }
      )
    )
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
