import { evaluate } from 'mathjs'

class Quadrant {
  value = 0
  constructor({ value, direction, x, y, width, height }) {
    this.value = value
    this.direction = direction
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  setValue(val) {
    this.value = val
  }
}

class QuadTree {
  maxDepth = 5
  x = 0
  y = 0
  width = 0
  height = 0
  definition = ''
  maxDepth = 9

  valueFunction = (bl, br, tr, tl) => {
    return bl + 2 * br + 4 * tr + 8 * tl
  }

  constructor({ x, y, width, height, definition, depth, evalDefinition, maxDepth }) {
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

  setValue() {}

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
            this.evalDefinition(this.x, this.y),
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
                maxDepth: this.maxDepth
              })
            else this.ne.setValue(val)
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
                maxDepth: this.maxDepth
              })
            else this.nw.setValue(val)
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
                maxDepth: this.maxDepth
              })
            this.se.setValue(val)
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
                maxDepth: this.maxDepth
              })
            else this.sw.setValue(val)
          }
          break
      }
    }
  }
}
self.onmessage = ({ data }) => {
  let { definition, depth, height, width, x, y, origin, stepX, stepY, maxDepth } = data

  let evalDefinition = (x, y) => {
    let val = evaluate(definition, {
      x: (x - origin.x) / stepX,
      y: (origin.y - y) / stepY,
    })
    return val > 0 ? 0 : 1
  }

  console.log(maxDepth)
  let biggerDimension = width > height ? width : height
  console.log(biggerDimension)
  let quadTree = new QuadTree({ x, y, width: biggerDimension, height: biggerDimension, definition, depth, evalDefinition, maxDepth })
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
  biggerDimension = undefined
  evalDefinition = undefined
}
