import {
  matrix,
  Matrix as MatrixType,
  identity as identityMatrix,
  zeros as zeroMatrix,
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

const Matrix = new MatrixClass()
export default Matrix
