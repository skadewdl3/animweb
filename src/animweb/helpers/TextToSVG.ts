// @ts-ignore
import vectorizeText from 'vectorize-text'
import calculateSize from 'calculate-size'

export const textToSVGTriangles = (text: string, config: any = {}) => {
  let dimensions = calculateSize(text, {
    font: config.font || 'Arial',
    fontSize: `${config.size}px`,
  })
  let complex = vectorizeText(text, {
    ...config,
    triangles: true,
    polygons: false,
    font: config.font || 'Arial',
    textBaseline: 'hanging',
    size: config.size,
    width: dimensions.width,
    height: `${dimensions.height}px`,
  })
  let svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="${dimensions.width}"  height="${dimensions.height}" >`,
  ]

  complex.cells.forEach(function (c: any) {
    for (let j = 0; j < 3; ++j) {
      let p0 = complex.positions[c[j]]
      let p1 = complex.positions[c[(j + 1) % 3]]
      svg.push(
        '<line x1="' +
          p0[0] +
          '" y1="' +
          p0[1] +
          '" x2="' +
          p1[0] +
          '" y2="' +
          p1[1] +
          '" stroke-width="1" stroke="black" />'
      )
    }
  })
  svg.push('</svg>')
  return svg.join(' ')
}

export const textToSVGPolygons = (text: string, config: any = {}) => {
  let dimensions = calculateSize(text, {
    font: config.font || 'Arial',
    fontSize: `${config.size}px`,
  })
  console.log(dimensions)
  let polygons = vectorizeText(text, {
    ...config,
    triangles: false,
    polygons: true,
    font: config.font || 'Arial',
    textBaseline: 'hanging',
    size: config.size,
    width: dimensions.width,
    height: `${dimensions.height}px`,
  })

  let svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="${dimensions.width}"  height="${dimensions.height}" >`,
  ]
  polygons.forEach(function (loops: any) {
    svg.push('<path d="')
    loops.forEach(function (loop: any) {
      let start = loop[0]
      svg.push('M ' + start[0] + ' ' + start[1])
      for (let i = 1; i < loop.length; ++i) {
        let p = loop[i]
        svg.push('L ' + p[0] + ' ' + p[1])
      }
      svg.push('L ' + start[0] + ' ' + start[1])
    })
    svg.push('" fill-rule="even-odd" stroke-width="1" fill="red"></path>')
  })
  svg.push('</svg>')
  return svg.join('')
}

export const textToSVGGraph = (text: string, config: any = {}) => {
  let dimensions = calculateSize(text, {
    font: config.font || 'Arial',
    fontSize: `${config.size}px`,
  })
  let graph = vectorizeText(text, {
    ...config,
    triangles: false,
    polygons: false,
    font: config.font || 'Arial',
    textBaseline: 'hanging',
    size: config.size,
    width: dimensions.width,
    height: `${dimensions.height}px`,
  })
  let svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="${dimensions.width}"  height="${dimensions.height}" >`,
  ]

  graph.edges.forEach(function (e: any) {
    let p0 = graph.positions[e[0]]
    let p1 = graph.positions[e[1]]
    svg.push(
      '<line x1="' +
        p0[0] +
        '" y1="' +
        p0[1] +
        '" x2="' +
        p1[0] +
        '" y2="' +
        p1[1] +
        '" stroke-width="1" stroke="black" />'
    )
  })
  svg.push('</svg>')
  return svg.join(' ')
}
