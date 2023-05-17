export interface SliderProps {
  min?: number
  max?: number
  step?: number
  x?: number
  y?: number
  title?: string
  value?: number
}

export interface ButtonProps {
  text: string
  x?: number
  y?: number
}

export interface PromptProps {
  title?: string
  description?: string
  placeholder?: string
  x?: number
  y?: number
  value?: string
}
