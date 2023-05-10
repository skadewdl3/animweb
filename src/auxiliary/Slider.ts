import { reactive } from 'petite-vue'
import { wait } from '@/helpers/miscellaneous'
import { Observables } from '@/enums/AnimObjects2D'
import { AnimObject } from '@/interfaces/core'
import AnimObject2D from '@/core/AnimObject2D'
import { v4 as uuid } from 'uuid'
import { Observer } from './Observer'

export const sliderData = reactive({
  sliders: [],
  async addSlider(slider: Slider) {
    let sliderItem = {
      value: slider.value,
      min: slider.min,
      max: slider.max,
      sliderElement: null,
      updateElement() {
        // @ts-ignore
        sliderItem.sliderElement = document.querySelector(`#${slider.id}`)
      },
    }
  },
})

export class Slider {
  private observer: any
  id: string
  min: number
  max: number
  step: number

  get value() {
    return this.observer.value
  }

  set value(val: any) {
    this.observer.executeMutation((o: any) => {
      o.value = val
    })
  }

  constructor(min: number, max: number, step: number, observer: any) {
    this.min = min
    this.max = max
    this.step = step
    this.observer = observer
    this.id = this.observer.onChange((val: any) => {
      console.log('value updated to: ', val)
    })
  }

  inc() {
    this.value += this.step
  }

  dec() {
    this.value -= this.step
  }
}

export default class CreateSlider {
  createSlider(min: number = 0, max: number = 100, step: number = 2) {
    return new Slider(min, max, step, this)
  }
}
