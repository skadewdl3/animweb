import { reactive } from 'petite-vue'
import { applyMixins, wait } from '@/helpers/miscellaneous'
import { Observables } from '@/enums/AnimObjects2D'
import { AnimObject } from '@/interfaces/core'
import AnimObject2D from '@/core/AnimObject2D'
import { v4 as uuid } from 'uuid'
import CreateSlider from './Slider'

export class Observer {
  private listeners: { [id: string]: Function } = {}
  private property: Observables
  private id: string = uuid()
  private target: any
  value: any

  constructor(target: any, property: Observables) {
    this.property = property
    this.value = target[property]
    this.target = target
    target.observables[this.id] = this
    let observer = this

    Object.defineProperty(target, property, {
      get() {
        return observer.value
      },
      set(value) {
        observer.value = value
        observer.executeListeners()
      },
    })
  }

  onChange(callback: Function) {
    let id = `${this.id}-${Object.keys(this.listeners).length}`
    this.listeners[id] = callback
    return id
  }

  executeListeners() {
    for (let listener of Object.values(this.listeners)) listener(this.value)
  }

  executeMutation(mutation: Function) {
    mutation(this)
    this.target[this.property] = this.value
  }
}

applyMixins(Observer, [CreateSlider])

export default class CreateObserver {
  observe(property: Observables, onchange?: Function) {
    return new Observer(this, property)
  }
}
