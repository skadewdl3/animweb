// Similar to the lines enum, this enum is used to pass a transition to an AnimObject (if we aren't applying it externally)
export enum Transitions {
  FadeIn = 'FadeIn',
  FadeOut = 'FadeOut',
  Create = 'Create',
  None = 'None',
}

export enum TransitionTypes {
  single = 'single',
  group = 'group',
}
