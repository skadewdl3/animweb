/*
Since it can be a pain in the ass to manually specify colors every time, especially
when we want to use the same color multiple times, we can use the predefined colors below.

The following object provides different variations of Blue, Red, Green, Yellow, etc colors.
They can be used as follows - 

1. StandardColors.Red(1) - specifying a number inside the Red functions returns the 1st accent of red.
2. StandardColors.Red() - not specifying anything returns a default accent (usually the middle one)
3. StandardColors.White() - some colors dont have any accents.
3. StandardColors.White(1) - passing a number into such colors wont have any effect. output will be the same.
*/

import Color from './Color'

export default {
  Blue(acc: number = 2): Color {
    let accent = acc > 4 || acc < 0 ? 2 : acc
    const blues = ['#c7e9f1', '#9cdceb', '#58c4dd', '#29abca', '#1c758a']
    return new Color(blues[accent])
  },

  Red(acc: number = 2): Color {
    let accent = acc > 4 || acc < 0 ? 2 : acc
    const reds = ['#f7a1a3', '#ff8080', '#fc6255', '#e65a4c', '#cf5044']
    return new Color(reds[accent])
  },

  Green(acc: number = 2): Color {
    let accent = acc > 4 || acc < 0 ? 2 : acc
    const greens = ['#c9e2ae', '#a6cf8c', '#83c167', '#77b05d', '#699c52']
    return new Color(greens[accent])
  },

  Yellow(acc: number = 2): Color {
    let accent = acc > 4 || acc < 0 ? 2 : acc
    const yellows = ['#fff1b6', '#ffea94', '#ffff00', '#f4d345', '#e8c11c']
    return new Color(yellows[accent])
  },

  Teal(acc: number = 0): Color {
    let accent = acc > 4 || acc < 0 ? 0 : acc
    const teals = ['#acead7', '#76ddc0', '#5cd0b3', '#55c1a7', '#49a88f']
    return new Color(teals[accent])
  },

  Purple(acc: number = 0): Color {
    let accent = acc > 4 || acc < 0 ? 0 : acc
    const purples = ['#caa3e8', '#b189c6', '#9a72ac', '#715582', '#644172']
    return new Color(purples[accent])
  },

  Maroon(acc: number = 0): Color {
    let accent = acc > 4 || acc < 0 ? 0 : acc
    const maroons = ['#ecabc1', '#ec92ab', '#c55f73', '#a24d61', '#94424f']
    return new Color(maroons[accent])
  },

  Gray(acc: number = 0): Color {
    let accent = acc > 4 || acc < 0 ? 0 : acc
    const grays = ['#eeeeee', '#cccccc', '#bbbbbb', '#888888', '#444444']
    return new Color(grays[accent])
  },

  Grey(acc: number = 0): Color {
    let accent = acc > 4 || acc < 0 ? 0 : acc
    const greys = ['#eeeeee', '#cccccc', '#bbbbbb', '#888888', '#444444']
    return new Color(greys[accent])
  },

  Brown(acc: number = 1): Color {
    let accent = acc > 2 || acc < 0 ? 1 : acc
    const browns = ['#cd853f', '#8b4513', '#736357']
    return new Color(browns[accent])
  },

  Black(acc: number = 0): Color {
    return new Color('#000000')
  },

  White(acc: number = 0): Color {
    return new Color('#ffffff')
  },

  Transparent(acc: number = 0): Color {
    return new Color([0, 0, 0, 0])
  },

  Pink(acc: number = 0): Color {
    return new Color('#d147bd')
  },

  GreenScreen(acc: number = 0): Color {
    return new Color('#00ff00')
  },

  Orange(acc: number = 0): Color {
    return new Color('#ff862f')
  },

  PureRed(acc: number = 0): Color {
    return new Color('#ff0000')
  },

  PureGreen(acc: number = 0): Color {
    return new Color('#00ff00')
  },

  PureBlue(acc: number = 0): Color {
    return new Color('#0000ff')
  },
}
