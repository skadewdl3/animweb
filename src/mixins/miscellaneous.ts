export class AnchorPoint {
  [key: string]: any

  moveTo({ duration = 1, x }: { duration?: number; x: number }) {
    this.moveAlong({ definition: this.definition, duration, x })
  }
}
