import { evaluate, log, parse } from 'mathjs'
import { roundOff } from './miscellaneous'

class Quadrant {
  value = 0
  constructor({ value, direction, x, y, width, height }) {
    this.value = value
    this.direction = direction
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.contours = null
  }
  setValue(val) {
    this.value = val
  }
  setContours(contours) {
    this.contours = contours
  }
}

class QuadTree {
  x = 0
  y = 0
  width = 0
  height = 0
  definition = ''
  maxDepth = 9

  signum(val) {
    return val <= 0 ? 1 : 0
  }

  valueFunction = (bl, br, tr, tl) => {
    return (
      this.signum(bl) +
      2 * this.signum(br) +
      4 * this.signum(tr) +
      8 * this.signum(tl)
    )
  }

  constructor({
    x,
    y,
    width,
    height,
    definition,
    depth,
    evalDefinition,
    maxDepth,
  }) {
    this.x = x
    this.y = y
    this.depth = depth
    this.width = width
    this.height = height
    this.definition = definition
    this.evalDefinition = evalDefinition
    this.maxDepth = maxDepth
    this.ne = new Quadrant({
      value: 0,
      direction: 'ne',
      x: this.x + this.width / 2,
      y: this.y,
      width: this.width / 2,
      height: this.height / 2,
    })
    this.nw = new Quadrant({
      value: 0,
      direction: 'nw',
      x: this.x,
      y: this.y,
      width: this.width / 2,
      height: this.height / 2,
    })
    this.se = new Quadrant({
      value: 0,
      direction: 'se',
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      width: this.width / 2,
      height: this.height / 2,
    })
    this.sw = new Quadrant({
      value: 0,
      direction: 'sw',
      x: this.x,
      y: this.y + this.height / 2,
      width: this.width / 2,
      height: this.height / 2,
    })

    this.subdivide(this.ne)
    this.subdivide(this.nw)
    this.subdivide(this.se)
    this.subdivide(this.sw)
  }

  getT(x1, y1, x2, y2) {
    let v1 = this.evalDefinition(x1, y1)
    let v2 = this.evalDefinition(x2, y2)
    let t = (-v1) / (v2 - v1)
    return t
  }

  lerpY(x1, y1, x2, y2,  t = this.getT(x1, y1, x2, y2)) {
    return y1 + (y2 - y1) * t
  }

  lerpX(x1, y1, x2, y2, t = this.getT(x1, y1, x2, y2)) {
    return x1 + (x2 - x1) * t
  }

  calculateContour(val, [blX, blY], [brX, brY], [trX, trY], [tlX, tlY]) {
    let results = []
    let result = {}
    let result1 = {}
    let result2 = {}
    switch (val) {
      case 0:
      case 15:
        results = null
      case 1:
        result.x1 = blX
        result.y1 = this.lerpY(tlX, tlY, blX, blY)

        result.x2 = this.lerpX(brX, brY, blX, blY)
        result.y2 = blY
        results.push(result)
        break
      case 14:
        result.x1 = tlX
        result.y1 = this.lerpY(blX, blY, tlX, tlY)

        result.x2 = this.lerpX(blX, blY, brX, brY)
        result.y2 = brY
        results.push(result)
        break
      case 2:
        result.x1 = this.lerpX(blX, blY, brX, brY)
        result.y1 = brY

        result.x2 = trX
        result.y2 = this.lerpY(brX, brY, trX, trY)
        results.push(result)
        break
      case 13:
        result.x1 = this.lerpX(brX, brY, blX, blY)
        result.y1 = brY

        result.x2 = brX
        result.y2 = this.lerpY(brX, brY, trX, trY)
        results.push(result)
        break
      case 3:
        result.x1 = blX
        result.y1 = this.lerpY(tlX, tlY, blX, blY)

        result.x2 = brX
        result.y2 = this.lerpY(trX, trY, brX, brY)

        results.push(result)
        break
      case 12:
        result.x1 = tlX
        result.y1 = this.lerpY(blX, blY, tlX, tlY)

        result.x2 = trX
        result.y2 = this.lerpY(brX, brY, trX, trY)

        results.push(result)
        break
      case 4:
        result.x1 = this.lerpX(tlX, tlY, trX, trY)
        result.y1 = trY

        result.x2 = trX
        result.y2 = this.lerpY(brX, brY, trX, trY)
        results.push(result)
        break
      case 11:
        result.x1 = this.lerpX(trX, trY, tlX, tlY)
        result.y1 = trY

        result.x2 = trX
        result.y2 = this.lerpY(trX, trY, brX, brY)
        results.push(result)
        break
      case 5:
        result1.x1 = blX
        result1.y1 = this.lerpY(tlX, tlY, blX, blY)

        result1.x2 = this.lerpX(brX, brY, blX, blY)
        result1.y2 = blY
        results.push(result1)

        result2.x1 = this.lerpX(tlX, tlY, trX, trY)
        result2.y1 = trY

        result2.x2 = trX
        result2.y2 = this.lerpY(brX, brY, trX, trY)
        results.push(result2)
        break
      case 10:
        result1.x1 = blX
        result1.y1 = this.lerpY(blX, blY, tlX, tlY)

        result1.x2 = this.lerpX(blX, blY, brX, brY)
        result1.y2 = blY

        results.push(result1)

        result2.x1 = this.lerpX(trX, trY, tlX, tlY)
        result2.y1 = trY

        result2.x2 = trX
        result2.y2 = this.lerpY(trX, trY, brX, brY)
        results.push(result2)
        break
      case 6:
        result.x1 = this.lerpX(tlX, tlY, trX, trY)
        result.y1 = tlY

        result.x2 = this.lerpX(blX, blY, brX, brY)
        result.y2 = blY
        results.push(result)
        break
      case 9:
        result.x1 = this.lerpX(trX, trY, tlX, tlY)
        result.y1 = trY

        result.x2 = this.lerpX(brX, brY, blX, blY)
        result.y2 = brY
        results.push(result)
        break
      case 7:
        result.x1 = tlX
        result.y1 = this.lerpY(tlX, tlY, blX, blY)

        result.x2 = this.lerpX(tlX, tlY, trX, trY)
        result.y2 = tlY

        results.push(result)
        break
      case 8:
        result.x1 = tlX
        result.y1 = this.lerpY(blX, blY, tlX, tlY)

        result.x2 = this.lerpX(trX, trY, tlX, tlY)
        result.y2 = tlY

        results.push(result)
        break
    }
    return results
  }

  subdivide(q) {
    if (!q.ne) {
      let bl, br, tr, tl, val
      switch (q.direction) {
        case 'ne':
          ;[bl, br, tr, tl] = [
            this.evalDefinition(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
            this.evalDefinition(this.x + this.width, this.y + this.height / 2),
            this.evalDefinition(this.x + this.width, this.y),
            this.evalDefinition(this.x + this.width / 2, this.y),
          ]
          val = this.valueFunction(bl, br, tr, tl)

          if (val == 0 || val == 15) this.ne.setValue(val)
          else {
            if (this.depth <= this.maxDepth)
              this.ne = new QuadTree({
                definition: this.definition,
                x: this.x + this.width / 2,
                y: this.y,
                width: this.width / 2,
                height: this.height / 2,
                depth: this.depth + 1,
                evalDefinition: this.evalDefinition,
                maxDepth: this.maxDepth,
              })
            else {
              this.ne.setValue(val)
              this.ne.setContours(
                this.calculateContour(
                  val,
                  [this.x + this.width / 2, this.y + this.height / 2],
                  [this.x + this.width, this.y + this.height / 2],
                  [this.x + this.width, this.y],
                  [this.x + this.width / 2, this.y]
                )
              )
            }
          }
          break
        case 'nw':
          ;[bl, br, tr, tl] = [
            this.evalDefinition(this.x, this.y + this.height / 2),
            this.evalDefinition(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
            this.evalDefinition(this.x + this.width / 2, this.y),
            this.evalDefinition(this.x, this.y),
          ]
          val = this.valueFunction(bl, br, tr, tl)
          if (val == 0 || val == 15) this.nw.setValue(val)
          else {
            if (this.depth <= this.maxDepth)
              this.nw = new QuadTree({
                definition: this.definition,
                x: this.x,
                y: this.y,
                width: this.width / 2,
                height: this.height / 2,
                depth: this.depth + 1,
                evalDefinition: this.evalDefinition,
                maxDepth: this.maxDepth,
              })
            else {
              this.nw.setValue(val)
              this.nw.setContours(
                this.calculateContour(
                  val,
                  [this.x, this.y + this.height / 2],
                  [this.x + this.width / 2, this.y + this.height / 2],
                  [this.x + this.width / 2, this.y],
                  [this.x, this.y]
                )
              )
            }
          }
          break
        case 'se':
          ;[bl, br, tr, tl] = [
            this.evalDefinition(this.x + this.width / 2, this.y + this.height),
            this.evalDefinition(this.x + this.width, this.y + this.height),
            this.evalDefinition(this.x + this.width, this.y + this.height / 2),
            this.evalDefinition(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
          ]
          val = this.valueFunction(bl, br, tr, tl)
          if (val == 0 || val == 15) this.se.setValue(val)
          else {
            if (this.depth <= this.maxDepth)
              this.se = new QuadTree({
                definition: this.definition,
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                width: this.width / 2,
                height: this.height / 2,
                depth: this.depth + 1,
                evalDefinition: this.evalDefinition,
                maxDepth: this.maxDepth,
              })
            else {
              this.se.setValue(val)
              this.se.setContours(
                this.calculateContour(
                  val,
                  [this.x + this.width / 2, this.y + this.height],
                  [this.x + this.width, this.y + this.height],
                  [this.x + this.width, this.y + this.height / 2],
                  [this.x + this.width / 2, this.y + this.height / 2]
                )
              )
            }
          }
          break
        case 'sw':
          ;[bl, br, tr, tl] = [
            this.evalDefinition(this.x, this.y + this.height),
            this.evalDefinition(this.x + this.width / 2, this.y + this.height),
            this.evalDefinition(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
            this.evalDefinition(this.x, this.y + this.height / 2),
          ]
          val = this.valueFunction(bl, br, tr, tl)
          if (val == 0 || val == 15) this.sw.setValue(val)
          else {
            if (this.depth <= this.maxDepth)
              this.sw = new QuadTree({
                definition: this.definition,
                x: this.x,
                y: this.y + this.height / 2,
                width: this.width / 2,
                height: this.height / 2,
                depth: this.depth + 1,
                evalDefinition: this.evalDefinition,
                maxDepth: this.maxDepth,
              })
            else {
              this.sw.setValue(val)
              this.sw.setContours(
                this.calculateContour(
                  val,
                  [this.x, this.y + this.height],
                  [this.x + this.width / 2, this.y + this.height],
                  [this.x + this.width / 2, this.y + this.height / 2],
                  [this.x, this.y + this.height / 2]
                )
              )
            }
          }
          break
      }
    }
  }
}
self.onmessage = ({ data }) => {
  let {
    definition,
    depth,
    height,
    width,
    x,
    y,
    origin,
    stepX,
    stepY,
    maxDepth,
  } = data

  const node = parse(definition)
  const code = node.compile()

  let evalDefinition = (x, y) => {
    let c = {
      x: (x - origin.x) / stepX,
      y: (origin.y - y) / stepY,
    }
    
    let val = code.evaluate({
      x: (x - origin.x) / stepX,
      y: (origin.y - y) / stepY,
    })
    return val
  }

  let quadTree = new QuadTree({
    x,
    y,
    width,
    height,
    definition,
    depth,
    evalDefinition,
    maxDepth,
  })
  self.postMessage(JSON.stringify(quadTree))
  quadTree = undefined
  definition = undefined
  depth = undefined
  height = undefined
  width = undefined
  x = undefined
  y = undefined
  origin = undefined
  stepX = undefined
  stepY = undefined
  maxDepth = undefined
  evalDefinition = undefined
}
