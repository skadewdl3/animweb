import { applyMixins, throwError } from '@/helpers/miscellaneous'
import { Properties, Watchables } from '@/enums/mixins'
import { v4 as uuid } from 'uuid'
import CreateSlider, { Slider } from './Slider'
import CreateButton, { Button } from './Button'

export class Watcher {
  private listeners: { [id: string]: Function } = {}
  private property: Watchables
  private id: string = uuid()
  private target: any
  sliders: Array<Slider> = []
  buttons: Array<Button> = []
  value: any

  constructor(target: any, property: Watchables) {
    this.property = property
    this.value = target[property]
    this.target = target
    target.watchables[this.id] = this
    let watcher = this

    Object.defineProperty(target, property, {
      get() {
        return watcher.value
      },
      set(value) {
        watcher.value = value
        watcher.executeListeners()
      },
    })
  }

  onChange(callback: Function) {
    let id = `${this.id}-${Object.keys(this.listeners).length}`
    this.listeners[id] = callback
    return id
  }

  removeListener(id: string) {
    delete this.listeners[id]
  }

  executeListeners() {
    for (let listener of Object.values(this.listeners)) listener(this.value)
  }

  executeMutation(mutation: Function) {
    mutation(this)
    this.target[this.property] = this.value
  }

  destroy() {
    for (let listener in this.listeners) {
      delete this.listeners[listener]
    }
    this.sliders.forEach((slider: any) => slider.destroy())
  }
}

applyMixins(Watcher, [CreateSlider, CreateButton])

export default class CreateWatcher {
  watch(property: Properties) {
    console.log(property in Watchables)
    if (property in Watchables) {
      console.log('this ran')
      return new Watcher(this, property as unknown as Watchables)
    } else {
      throwError('WatcherError', `Property ${property} cannot be watched.`)
      return undefined
    }
  }
}
