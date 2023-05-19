import LaTeX from '@AnimObjects2D/LaTeX'
import Text from '@AnimObjects2D/Text'
import AnimObject2D from '@core/AnimObject2D'
import { createTransition } from '@core/Transition'
import { isNearlyEqual, rangePerFrame } from '@helpers/miscellaneous'
import anime from 'animejs'
import { interpolate } from 'polymorph-js'

const Morph = <O1 extends AnimObject2D, O2 extends AnimObject2D>(
  source: O1,
  target: O2,
  config: any = {}
) => {
  if (source instanceof Text && target instanceof Text) {
    console.log(document.querySelector(`#${source.id}`)?.querySelector('path'))
    console.log(
      document
        .querySelector(`#${target.id}`)
        ?.querySelector('path') as SVGPathElement
    )
    const interpolator = interpolate([
      document
        .querySelector(`#${source.id}`)
        ?.querySelector('path') as SVGPathElement,
      document
        .querySelector(`#${target.id}`)
        ?.querySelector('path') as SVGPathElement,
    ])

    let speed = rangePerFrame(1, config.duration || 1)
    let morphProgress = 0

    source.transition = createTransition(
      {
        onStart() {
          source.animating = true
          ;(source.svgEl?.querySelector('svg') as SVGElement).setAttribute(
            'width',
            `${(target.svgEl?.querySelector('svg') as SVGElement).getAttribute(
              'width'
            )}px`
          )
          ;(source.svgEl?.querySelector('svg') as SVGElement).setAttribute(
            'height',
            `${(target.svgEl?.querySelector('svg') as SVGElement).getAttribute(
              'height'
            )}px`
          )
          source.svgEl
            ?.querySelectorAll('path')
            .forEach((path: SVGPathElement) => {
              path.setAttribute('stroke', source.color.rgba)
              path.setAttribute('fill', source.color.rgba)
            })
        },
        onEnd() {
          source.text = target.text
          anime({
            targets: `#${source.id}`,
            opacity: [1, 0],
            duration: 1000,
          })
          source.animating = false
        },
        onProgress() {
          morphProgress += speed
          ;(source.svgEl?.querySelector('path') as SVGPathElement).setAttribute(
            'd',
            interpolator(morphProgress)
          )
        },
        endCondition() {
          return isNearlyEqual(morphProgress, 1, 0.01)
        },
      },
      source
    )
  }
}

export default Morph
