import { Watchables } from '@/enums/auxiliary'
import { v4 as uuid } from 'uuid'
import { sliders } from '@/ui/slider'
//@ts-ignore
import debounce from 'lodash.debounce'

export class Slider {
  private watcher: any
  id: string
  min: number
  max: number
  step: number
  element?: HTMLElement
  property: Watchables
  x: number
  y: number
  title: string

  get value() {
    return this.watcher.value
  }

  set value(val: any) {
    this.watcher.executeMutation((o: any) => {
      o.value = val
    })
  }

  constructor(
    { min = 1, max = 100, step = 1, x = 0, y = 0, title }: SliderProps,
    watcher: any
  ) {
    this.min = min
    this.max = max
    this.step = step
    this.x = x
    this.y = y
    this.watcher = watcher
    this.property = watcher.property
    this.title = title || this.property
    this.id = uuid()
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

  destroy() {
    sliders.removeSlider(this.id)
    this.element?.remove()
  }
}

export default class CreateSlider {
  [key: string]: any
  createSlider(config: SliderProps = {}) {
    let slider = new Slider(config, this)
    sliders.addSlider(slider)
    this.sliders.push(slider)
    return slider
  }
}