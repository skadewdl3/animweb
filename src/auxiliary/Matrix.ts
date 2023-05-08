import {
  matrix,
  Matrix as MatrixType,
  rotationMatrix,
  identity as identityMatrix,
  zeros as zeroMatrix,
  multiply as matmul,
  add as matadd,
  det as matdet,
  transpose as mattranspose,
  inv as matinv,
  trace as mattrace,
} from 'mathjs'

export default class Matrix {
  matrix: MatrixType = matrix()

  constructor(...args: Array<any>) {
    if (args.length === 0) return
    args.forEach((row: Array<any>, rowIndex: number) => {
      row.forEach((el: number, colIndex: number) => {
        this.matrix.set([rowIndex, colIndex], el)
      })
    })

    Object.defineProperties(this, {
      determinant: {
        get: () => matdet(this.matrix),
      },
      transpose: {
        get: () => Matrix.fromMatrix(mattranspose(this.matrix)),
      },
      inverse: {
        get: () => Matrix.fromMatrix(matinv(this.matrix)),
      },
      trace: {
        get: () => mattrace(this.matrix),
      },
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

  static fromAngle(angle: number) {
    return Matrix.fromMatrix(rotationMatrix(angle))
  }

  static identity(order: number) {
    // @ts-ignore
    return Matrix.fromMatrix(identityMatrix(order))
  }

  static zeros(order: number) {
    // @ts-ignore
    return Matrix.fromMatrix(zeroMatrix(order))
  }

  private static fromMatrix(m: MatrixType) {
    let c = new Matrix([])
    c.matrix = m
    return c
  }

  multiply(r: Matrix | number): Matrix {
    if (typeof r === 'number') return Matrix.fromMatrix(matmul(this.matrix, r))
    else return Matrix.fromMatrix(matmul(this.matrix, r.matrix))
  }

  add(r: Matrix) {
    return Matrix.fromMatrix(matadd(this.matrix, r.matrix))
  }

  subtract(r: Matrix) {
    return Matrix.fromMatrix(matadd(this.matrix, r.multiply(-1).matrix))
  }

  pow(n: number) {
    let result = Matrix.fromMatrix(this.matrix)
    for (let i = 1; i < n; i++) {
      result = result.multiply(result)
    }
    return result
  }

  toArray() {
    return this.matrix.toArray()
  }
}
