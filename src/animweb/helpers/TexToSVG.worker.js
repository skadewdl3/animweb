import { mathjax } from 'mathjax-full/js/mathjax.js'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { SVG } from 'mathjax-full/js/output/svg.js'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js'
import { AssistiveMmlHandler } from 'mathjax-full/js/a11y/assistive-mml.js'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'

const DEFAULT_OPTIONS = {
  width: 1280,
  ex: 20,
  em: 300,
}

const TeXToSVG = (str, opts) => {
  const options = opts ? { ...DEFAULT_OPTIONS, ...opts } : DEFAULT_OPTIONS

  const ASSISTIVE_MML = false,
    FONT_CACHE = true,
    INLINE = false,
    CSS = false,
    packages = AllPackages.sort()

  const adaptor = liteAdaptor()
  const handler = RegisterHTMLHandler(adaptor)
  if (ASSISTIVE_MML) AssistiveMmlHandler(handler)

  const tex = new TeX({ packages })
  const svg = new SVG({ fontCache: FONT_CACHE ? 'local' : 'none' })
  const html = mathjax.document('', { InputJax: tex, OutputJax: svg })

  const node = html.convert(str, {
    display: !INLINE,
    em: options.em,
    ex: options.ex,
    containerWidth: options.width,
    scale: 1,
  })

  const svgString = CSS
    ? adaptor.textContent(svg.styleSheet(html))
    : adaptor.outerHTML(node)

  return svgString.replace(/<mjx-container.*?>(.*)<\/mjx-container>/gi, '$1')
}



self.onmessage = ({ data }) => {
  if (data.type == 'latex') {
    self.postMessage(TeXToSVG(data.latex))
  }
}
