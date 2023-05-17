import { Watchables } from '@enums/mixins.ts'
import { v4 as uuid } from 'uuid'
import { sliders } from '@reactives/sliders.ts'
import { SliderProps } from '@interfaces/mixins.ts'
//@ts-ignore
import debounce from 'lodash.debounce'

export class Slider {
  private watcher: any
  id: string
  min: number
  max: number
  step: number
  element?: HTMLElement
  property?: Watchables
  x: number
  y: number
  title: string
  slideListeners: Array<{ id: string; listener: Function }> = []
  tempValue: number = 0

  get value() {
    return this.watcher ? this.watcher.value : this.tempValue
  }

  set value(val: any) {
    if (!this.watcher) this.executeSlideListeners(val)
  }

  constructor(
    { min = 1, max = 100, step = 1, x = 0, y = 0, title, value }: SliderProps,
    watcher?: any
  ) {
    this.min = min
    this.max = max
    this.step = step
    this.x = x
    this.y = y
    this.watcher = watcher
    this.property = this.watcher ? watcher.property : null
    this.title = title || this.property || ''
    this.id = uuid()
    console.log(value)
    this.value =
      typeof value == 'number'
        ? value > this.max
          ? this.max
          : value < this.min
          ? this.min
          : value
        : this.watcher
        ? this.watcher.value
        : this.min
  }

  inc() {
    this.value += this.step
  }

  dec() {
    this.value -= this.step
  }

  updateElement() {
    this.element = document.getElementById(this.id) as HTMLElement
    let textbox = this.element.querySelector(
      '.slider-textbox'
    ) as HTMLInputElement
    let slider = this.element.querySelector('.slider-bar') as HTMLInputElement
    textbox.value = this.value
    slider.addEventListener('input', (e: any) => {
      this.value = parseFloat(e.target.value)
      textbox.value = this.value
    })
    textbox.addEventListener(
      'input',
      debounce(
        (e: any) => {
          this.value = isNaN(parseFloat(e.target.value))
            ? this.value
            : parseFloat(e.target.value)
        },
        { leading: false }
      )
    )
  }

  executeSlideListeners(val: number) {
    if (this.watcher) {
      this.watcher.executeMutation((o: any) => {
        o.value = val
        for (let listener of this.slideListeners) {
          listener.listener(val)
        }
      })
    } else {
      for (let listener of this.slideListeners) {
        listener.listener(val)
      }
      this.tempValue = val
    }
  }

  executeSlideListener(id: string) {
    this.slideListeners = this.slideListeners.filter(listener => {
      if (listener.id == id) {
        listener.listener()
        return false
      }
      return true
    })
  }

  onSlide(slideListener: Function) {
    let id = uuid()
    this.slideListeners.push({ listener: slideListener, id })
    return () => this.executeSlideListener(id)
  }

  destroy() {
    sliders.removeSlider(this.id)
  }
}

export default class CreateSlider {
  [key: string]: any
  createSlider(config: SliderProps = {}) {
    let slider = new Slider(config, this)
    sliders.addSlider(slider)
    this.sliders.push(slider)
    return sliders.getSlider(slider.id)
  }
}

export const createSlider = (config: SliderProps = {}) => {
  let slider = new Slider(config)
  sliders.addSlider(slider)

  return sliders.getSlider(slider.id)
}
