import { Watchables } from '@/enums/auxiliary'
import { v4 as uuid } from 'uuid'
import { sliders } from '@/ui/sliders'

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
