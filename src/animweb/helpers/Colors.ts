/*
Since it can be a pain in the ass to manually specify colors every time, especially
when we want to use the same color multiple times, we can use the predefined colors below.

The following object provides different variations of Blue, Red, Green, Yellow, etc colors.
They can be used as follows - 

1. Colors.red1 - specifying a number inside the Red functions returns the 1st accent of red.
2. Colors.red - not specifying anything returns a default accent (usually the middle one)
3. Colors.white - some colors dont have any accents.
*/

import Color from './Color'

const blues = {
  blue: '#58c4dd',
  blue1: '#c7e9f1',
  blue2: '#58c4dd',
  blue3: '#29abca',
  blue4: '#1c758a',
}

const reds = {
  red: '#fc6255',
  red1: '#f7a1a3',
  red2: '#ff8080',
  red3: '#fc6255',
  red4: '#e65a4c',
  red5: '#cf5044',
}

const greens = {
  green: '#83c167',
  green1: '#c9e2ae',
  green2: '#a6cf8c',
  green3: '#83c167',
  green4: '#77b05d',
  green5: '#699c52',
}

const yellows = {
  yellow: '#ffff00',
  yellow1: '#fff1b6',
  yellow2: '#ffea94',
  yellow3: '#ffff00',
  yellow4: '#f4d345',
  yellow5: '#e8c11c',
}

const teals = {
  teal: '#5cd0b3',
  teal1: '#acead7',
  teal2: '#76ddc0',
  teal3: '#5cd0b3',
  teal4: '#55c1a7',
  teal5: '#49a88f',
}

const purples = {
  purple: '#9a72ac',
  purple1: '#caa3e8',
  purple2: '#b189c6',
  purple3: '#9a72ac',
  purple4: '#715582',
  purple5: '#644172',
}

const maroon = {
  maroon: '#c55f73',
  maroon1: '#ecabc1',
  maroon2: '#ec92ab',
  maroon3: '#c55f73',
  maroon4: '#a24d61',
  maroon5: '#94424f',
}

const grays = {
  gray: '#888888',
  gray1: '#eeeeee',
  gray2: '#cccccc',
  gray3: '#bbbbbb',
  gray4: '#888888',
  gray5: '#444444',
}

const greys = {
  grey: '#888888',
  grey1: '#eeeeee',
  grey2: '#cccccc',
  grey3: '#bbbbbb',
  grey4: '#888888',
  grey5: '#444444',
}

const browns = {
  brown: '#8b4513',
  brown1: '#cd853f',
  brown2: '#8b4513',
  brown3: '#736357',
}

const others = {
  black: '#000000',
  white: '#ffffff',
  transparent: [0, 0, 0, 0],
  pink: '#d147bd',
  greenScreen: '#00ff00',
  orange: '#ff862f',
  pureRed: '#ff0000',
  pureGreen: '#00ff00',
  pureBlue: '#0000ff',
}

const colors = {
  blues,
  reds,
  greens,
  yellows,
  teals,
  purples,
  maroon,
  grays,
  browns,
  others,
}

class ColorsClass {
  [colorID: string]: Color

  constructor() {
    for (let color of Object.values(colors)) {
      for (let [key, colorCode] of Object.entries(color)) {
        Object.defineProperty(this, key, {
          // @ts-ignore
          get: () => new Color(colorCode),
        })
      }
    }
  }
}

const Colors = new ColorsClass()

export default Colors
