const heightCompensation = (window.outerHeight - window.innerHeight) / 4
// const heightCompensation = 0

export const Width = {
  full: document.body.clientWidth,
  half: document.body.clientWidth / 2,
  percent(x: number): number {
    return (x * document.body.clientWidth) / 100
  },
}

export const Height = {
  full: window.innerHeight  - heightCompensation,
  half: (window.innerHeight  - heightCompensation) / 2,
  percent(x: number): number {
    return (x * (window.innerHeight  - heightCompensation)) / 100
  },
}
