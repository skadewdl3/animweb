import { Slider } from '@/auxiliary/Slider'
import { reactive } from 'petite-vue'

export const sliders = reactive({
  sliders: [],
  addSlider(slider: Slider) {
    this.sliders.push(slider)
    console.log(slider)
  },
})

export const UserSliders = () => {
  return {
    $template: '#user-sliders-template',
  }
}
