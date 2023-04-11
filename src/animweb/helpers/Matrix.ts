import {
  matrix,
  Matrix as MatrixType,
  identity as identityMatrix,
  zeros as zeroMatrix,
  multiply as matmul,
} from 'mathjs'

const fromRows = (...args: Array<any>): MatrixType => {
  let m = matrix()

  args.forEach((row: Array<any>, rowIndex: number) => {
    row.forEach((el: number, colIndex: number) => {
      m.set([rowIndex, colIndex], el)
    })
  })
  return m
}

const fromColumns = (...args: Array<any>): MatrixType => {
  let m = matrix()

  args.forEach((col: Array<any>, colIndex: number) => {
    col.forEach((el: number, rowIndex: number) => {
      m.set([rowIndex, colIndex], el)
    })
  })
  return m
}

const identity = (order: number) => {
  return identityMatrix(order)
}

const zeros = (order: number) => {
  return zeroMatrix(order)
}

let matrixCreators = {
  fromRows,
  fromColumns,
  identity,
  zeros,
}

class MatrixClass {
  [matrixCreatorID: string]: Function

  constructor() {
    for (let [matrixCreatorID, matrixCreator] of Object.entries(
      matrixCreators
    )) {
      Object.defineProperty(this, matrixCreatorID, {
        // @ts-ignore
        get: () => matrixCreator,
      })
    }
  }
}

export default class Matrix {
  matrix: MatrixType = matrix()

  constructor(...args: Array<any>) {
    if (args.length === 0) return
    args.forEach((row: Array<any>, rowIndex: number) => {
      row.forEach((el: number, colIndex: number) => {
        this.matrix.set([rowIndex, colIndex], el)
      })
    })
  }

  set(position: Array<any>, element: number) {
    this.matrix.set(position, element)
  }

  static fromRows(...args: Array<any>) {
    return new Matrix(...args)
  }

  static fromColumns(...args: Array<any>): Matrix {
    let matrix = new Matrix([])
    args.forEach((col: Array<any>, colIndex: number) => {
      col.forEach((el: number, rowIndex: number) => {
        matrix.set([rowIndex, colIndex], el)
      })
    })
    return matrix
  }

  static fromMatrix(m: MatrixType) {
    let c = new Matrix([])
    c.matrix = m
    return c
  }

  multiply(r: Matrix | number): Matrix {
    if (typeof r === 'number') return Matrix.fromMatrix(matmul(this.matrix, r))
    else return Matrix.fromMatrix(matmul(this.matrix, r.matrix))
  }

  toArray() {
    return this.matrix.toArray()
  }
}
