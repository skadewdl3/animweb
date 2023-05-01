import {
  complex,
  Complex as ComplexType,
  add as addComplex,
  multiply as mulComplex,
  conj as conjComplex,
  inv as invComplex,
  arg as argComplex,
} from 'mathjs'

export default class Complex {
  complex: ComplexType

  constructor(c: any) {
    this.complex = complex(c)
  }

  get re() {
    return this.complex.re
  }

  get im() {
    return this.complex.im
  }

  set re(re: number) {
    this.complex.re = re
  }

  set im(im: number) {
    this.complex.im = im
  }

  get conjugate() {
    return new Complex(conjComplex(this.complex).toString())
  }

  get inverse() {
    return new Complex(invComplex(this.complex).toString())
  }

  get isReal() {
    return this.complex.im == 0
  }

  get isImaginary() {
    return this.complex.re == 0
  }

  get isComplex() {
    return this.complex.im != 0 && this.complex.re != 0
  }

  get arg() {
    return argComplex(this.complex)
  }

  add(c: any): Complex {
    let z = complex(this.complex.toString())
    let q = c instanceof Complex ? complex(c.complex.toString()) : complex(c)
    return new Complex(addComplex(z, q).toString())
  }

  multiply(c: any): Complex {
    let z = complex(this.complex.toString())
    if (typeof c == 'number') {
      return new Complex(mulComplex(z, c).toString())
    }
    let q = c instanceof Complex ? complex(c.complex.toString()) : complex(c)
    return new Complex(mulComplex(z, q).toString())
  }

  sub(c: any): Complex {
    let z = complex(this.complex.toString())
    let q = c instanceof Complex ? complex(c.complex.toString()) : complex(c)
    return new Complex(addComplex(z, mulComplex(q, -1)).toString())
  }

  isEqual(c: any) {
    let z = complex(this.complex.toString())
    let q = !(c instanceof Complex) ? new Complex(complex(c)) : c
    return (
      Math.abs(z.re - q.re) <= Number.EPSILON * 10 &&
      Math.abs(z.im - q.im) <= Number.EPSILON * 10
    )
  }

  static fromComplex(c: ComplexType) {
    return new Complex(c.toString())
  }
}
