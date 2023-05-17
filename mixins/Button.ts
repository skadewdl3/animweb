import { Watchables } from '@/enums/mixins'
import { v4 as uuid } from 'uuid'
import { ButtonProps } from '@/interfaces/mixins'
//@ts-ignore
import debounce from 'lodash.debounce'
import { buttons } from '@/reactives/buttons'
import { throwError } from '@/helpers/miscellaneous'
import error from '@/reactives/error'

export class Button {
  private watcher: any
  id: string
  element?: HTMLElement
  x: number
  y: number
  text: string
  private property?: Watchables
  private independent: boolean = true
  private clickLiseners: Array<{ listener: Function; id: string }> = []

  constructor({ text, x = 0, y = 0 }: ButtonProps, watcher?: any) {
    this.text = text
    this.x = x
    this.y = y
    this.watcher = watcher
    if (watcher) {
      this.property = watcher.property
      this.independent = false
    }
    this.id = uuid()
  }

  private executeClickListeners(o?: any) {
    for (let listener of this.clickLiseners) {
      if (o) {
        let newValue = listener.listener()
        if (typeof newValue != typeof this.watcher.value) {
          throwError(
            'TypeError',
            `You tried to assign a ${typeof newValue} to a ${typeof this.watcher
              .value}.`
          )
          return
        } else {
          o.value = newValue
        }
      } else listener.listener()
    }
  }

  updateElement() {
    this.element = document.getElementById(this.id) as HTMLElement
    let button = this.element.querySelector('button') as HTMLButtonElement
    button.addEventListener(
      'click',
      debounce(
        () => {
          if (!this.independent) {
            this.watcher.executeMutation((o: any) => {
              try {
                this.executeClickListeners(o)
              } catch (err: any) {
                error.show(err.name, err.message)
              }
            })
          } else this.executeClickListeners()
        },
        100,
        { leading: false }
      )
    )
  }

  private executeClickListener(id: string) {
    let listener = this.clickLiseners.find((listener) => listener.id == id)
    if (listener) {
      if (!this.independent) {
        this.watcher.executeMutation((o: any) => {
          try {
            let newValue = (
              listener as { id: string; listener: Function }
            ).listener(o)
            if (typeof newValue != typeof this.watcher.value) {
              throwError(
                'TypeError',
                `You tried to assign a ${typeof newValue} to a ${typeof this
                  .watcher.value}.`
              )
              return
            }
          } catch (err: any) {
            error.show(err.name, err.message)
          }
        })
      } else listener.listener()
    }
  }

  onClick(listener: Function) {
    if (!this.independent && this.clickLiseners.length > 0) return
    let id = uuid()
    this.clickLiseners.push({ listener, id })
    return () => this.executeClickListener(id)
  }

  destroy() {
    buttons.removeButton(this.id)
  }
}

export default class CreateButton {
  [key: string]: any
  createButton(config: ButtonProps) {
    let button = new Button(config, this)
    buttons.addButton(button)
    this.buttons.push(button)
    return buttons.getButton(button.id)
  }
}

export const createButton = (config: ButtonProps) => {
  let button = new Button(config)
  buttons.addButton(button)
  return buttons.getButton(button.id)
}
