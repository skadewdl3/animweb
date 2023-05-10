import { reactive } from 'petite-vue'
import { wait } from '@/helpers/miscellaneous'
import { Watchables } from '@/enums/auxiliary'
import { AnimObject } from '@/interfaces/core'
import AnimObject2D from '@/core/AnimObject2D'
import { v4 as uuid } from 'uuid'
import { sliders } from '@/ui/sliders'

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
  private watcher: any
  id: string
  min: number
  max: number
  step: number
  element?: HTMLElement

  get value() {
    return this.watcher.value
  }

  set value(val: any) {
    this.watcher.executeMutation((o: any) => {
      o.value = val
    })
  }

  constructor(min: number, max: number, step: number, watcher: any) {
    this.min = min
    this.max = max
    this.step = step
    this.watcher = watcher
    this.id = this.watcher.onChange((val: any) => {
      // console.log('value updated to: ', val)
    })
  }

  inc() {
    this.value += this.step
  }

  dec() {
    this.value -= this.step
  }

  updateElement() {
    this.element = document.getElementById(this.id) as HTMLElement
    console.log(this.element)
  }
}

export default class CreateSlider {
  createSlider(min: number = 0, max: number = 100, step: number = 2) {
    let slider = new Slider(min, max, step, this)
    sliders.addSlider(slider)
    return slider
  }
}
