import { Slider } from '@mixins/Slider.ts'
import { reactive } from 'vue'
import { SlidersReactive } from '@interfaces/ui.ts'

export const sliders: SlidersReactive = reactive<SlidersReactive>({
  sliders: [],
  addSlider(slider: Slider) {
    this.sliders.push(slider)
    console.log(slider)
  },
  removeSlider(id: string) {
    this.sliders = this.sliders.filter((slider: Slider) => slider.id !== id)
  },
  getSlider(id: string) {
    return this.sliders.find((slider: Slider) => slider.id === id)
  },
  clear() {
    this.sliders = []
  },
})

export const UserSliders = () => {
  return {
    $template: '#user-sliders-template',
  }
}
