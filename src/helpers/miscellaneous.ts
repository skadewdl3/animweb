// @ts-nocheck
import { create, all } from 'mathjs'
import Constants from '@/helpers/Constants'
const math = create(all)

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const roundOff = (num, scale) => {
  if (!('' + num).includes('e')) {
    return +(Math.round(num + 'e+' + scale) + 'e-' + scale)
  } else {
    var arr = ('' + num).split('e')
    var sig = ''
    if (+arr[1] + scale > 0) {
      sig = '+'
    }
    return +(Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) + 'e-' + scale)
  }
}

export const degToRad = (deg) => {
  return (deg * Math.PI) / 180
}

export const radToDeg = (rad) => {
  return (rad * 180) / Math.PI
}

export const rangePerFrame = (range, duration) => {
  let fps = Constants.FrameRate
  let rangePerSecond = range / duration
  let rangePerFrame = rangePerSecond / fps
  return rangePerFrame
}

export const getQuadrant = (config: number | { x: number; y: number }) => {
  let angle = null,
    x = null,
    y = null
  if (typeof config == 'number') angle = config
  else {
    x = config.x
    y = config.y
  }
  if (angle) {
    // find quadrant from angle
    console.log('this ran')
    if (angle == 0) return -3
    if (angle == 90) return -1
    if (angle == 180 || angle == -180) return -4
    if (angle == -90) return -2

    if (angle > 0 && angle < 90) return 1
    if (angle > 90 && angle < 180) return 2
    if (angle < -90 && angle > -180) return 3
    if (angle < 0 && angle > -90) return 4
  } else {
    if (x == 0 && y > 0) return -1
    if (x == 0 && y < 0) return -2
    if (y == 0 && x > 0) return -3
    if (y == 0 && x < 0) return -4

    if (x > 0) {
      if (y > 0) return 1
      if (y < 0) return 4
    }
    if (x < 0) {
      if (y > 0) return 2
      if (y < 0) return 3
    }
  }
}

const sigma = (args, math, userScope) => {
  let [expression, lower, higher, variable = 'n'] = args.map((arg) =>
    arg.toString()
  )

  let scope = {}

  for (let [v, value] of userScope) {
    scope[v] = value
  }
  let sum = 0

  for (
    let i = parseInt(math.evaluate(lower, userScope));
    i <= parseInt(roundOff(parseFloat(math.evaluate(higher, userScope)), 6));
    i++
  ) {
    sum += math.evaluate(expression, {
      [variable]: i,
      ...scope,
    })
  }
  return sum
}
sigma.rawArgs = true

const product = (args, math, userScope) => {
  let [expression, lower, higher, variable = 'n'] = args.map((arg) =>
    arg.toString()
  )

  let scope = {}

  for (let [v, value] of userScope) {
    scope[v] = value
  }
  let product = 1

  for (
    let i = parseInt(math.evaluate(lower, userScope));
    i <= parseInt(roundOff(parseFloat(math.evaluate(higher, userScope)), 6));
    i++
  ) {
    product *= math.evaluate(expression, {
      [variable]: i,
      ...scope,
    })
  }
  return product
}
product.rawArgs = true

math.import({ sigma, product })

export const evaluate = (expression: string, scope = {}) => {
  return math.evaluate(expression, scope)
}

export const getElement = (selector: string) => {
  return document.querySelector(selector)
}

export const getInlineCode = (codeEditor: EditorView) => {
  let defaultExports = ''
  for (let name in window.WebAnim) {
    defaultExports = defaultExports.concat(
      `var ${name} = window.WebAnim.${name}\n`
    )
  }
  let inlineCode = document.createTextNode(
    `try {\n${defaultExports}${codeEditor.state.doc.toString()}\n}\ncatch (err) {
            let [errLineNumber, errLineColumn] = err.stack.split(':').slice(-2).map((i) => parseInt(i))
            let errType = err.stack.split(':')[0]
            showError(errType, err.message, parseInt(errLineNumber - ${
              defaultExports.split('\n').length
            }))
        }`
  )
  return inlineCode
}

export const throwError = (name: string, message: string) => {
  let err = new Error(message)
  err.name = name
  throw err
}

export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype || Object.getPrototypeOf(derivedCtor),
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      )
    })
  })
}

export const parseDefinition = (definition: string) => {
  let temp = definition
  let parts = temp.split('=')
  if (parts.length == 1) return definition
  else {
    temp = parts[0]
    for (let part of parts) {
      if (part == parts[0]) continue
      temp = `${temp} - (${part})`
    }
    return temp
  }
}

export const isNearlyEqual = (
  a: number,
  b: number,
  epsilon = Number.EPSILON
) => {
  return Math.abs(a - b) < epsilon
}