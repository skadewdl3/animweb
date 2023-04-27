/*
In order to abstract away the complexity of converting between hex color codes, rgba, rgb, etc,
every AnimObject will only every accept a Color class for the color/backgroundColor poperties.

This Color class can be initialized with:
1.  Hex code - new Color('#ff0000')

2.  RGB values - new Color([255, 0, 0])
    When initialised with a hex code or rgb values, the transparency of the color is 0% (alpha = 1) by default.

3.  RGBA values - new COlor([255, 0, 0, 0.5]) 
    When using RGBA values, we can specify trannsparency of the color.
    The alpha part (4th element of RGBA) represents transparency.
    
    alpha = 0   --->  100% transparency i.e. completely invisible
    alpha = 1   --->  0% transparency i.e. comlpetely visible
*/

import { v4 as uuid } from 'uuid'

/*
The following functions do exactly what they say. They convert colors between different formats.

Hex         --->  '#ff0000'
RGB         --->  [255, 0, 0]
RGBA        --->  [255, 0, 0, 0.5]

RGBString   --->  'rgb(255, 0, 0)'
RGBString   --->  'rgba(255, 0, 0, 0.5)'

Since we will always use RGBA strings internally, we don't need to worry about handling transparency separately.

*/

const RGBToRGBString = (color: [number, number, number]): string => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

const RGBToRGBAString = (color: [number, number, number]): string => {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
}

const RGBAToRGBString = (color: [number, number, number, number]): string => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

const RGBAToRGBAString = (color: [number, number, number, number]): string => {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
}

const hexToRGB = (hex: string): [number, number, number] => {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0]
}

const RGBToHex = (rgb: [number, number, number]) => {
  return (
    '#' +
    rgb
      .map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

const RGBAToHex = (rgba: [number, number, number, number]) => {
  let rgb = rgba.slice(0, 3)
  return (
    '#' +
    rgb
      .map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export default class Color {
  hex: string = '' // Hex color code string - '#ff0000'
  rgb: string = '' // RGB string - 'rgb(255, 0, 0)'
  rgba: string = '' // RGBA string - 'rgba(255, 0, 0, 0.5)'
  id: string = uuid() // A unique id to identify the color (like AnimObject.id)
  hexNumber: number = 0 // Hex color code as a number - 0xff0000
  rgbaVals: [number, number, number, number] = [0, 0, 0, 0] // Store separate R, G, B, A values
  opacity: number = 1 // Opacity of the color (0 - 1)

  // Color can be initialised with the following formats
  constructor(
    color:
      | string // Hex string '#ffffff'
      | [number, number, number] // RGB rgb(255, 255, 255)
      | [number, number, number, number] // RGBA rgba(255, 255, 255, 0.5)
      | { r: number; g: number; b: number } // RGB object
  ) {
    // The following code basically converts the input format into hex, rgb, rgba and rgbaVals.
    // We simply use the functions defined above

    if (Array.isArray(color)) {
      if (color.length == 3) {
        this.rgb = RGBToRGBString(color)
        this.rgba = RGBToRGBAString(color)
        this.hex = RGBToHex(color)
        this.hexNumber = parseInt(this.hex.replace('#', '0x'))
        this.rgbaVals = [color[0], color[1], color[2], 1]
        this.opacity = 1
      }
      if (color.length == 4) {
        this.rgb = RGBAToRGBString(color)
        this.rgba = RGBAToRGBAString(color)
        this.hex = RGBToHex([color[0], color[1], color[2]])
        this.hexNumber = parseInt(this.hex.replace('#', '0x'))
        this.rgbaVals = [color[0], color[1], color[2], color[3]]
        this.opacity = color[3]
      }
    } else if (typeof color == 'object') {
      this.rgb = RGBToRGBString([color.r, color.g, color.b])
      this.rgba = RGBAToRGBAString([color.r, color.g, color.b, 1])
      this.hex = RGBToHex([color.r, color.g, color.b])
      this.hexNumber = parseInt(this.hex.replace('#', '0x'))
      this.rgbaVals = [color.r, color.g, color.b, 1]
      this.opacity = 1
    } else if (typeof color == 'string' && !color.includes('r')) {
      this.hex = color
      this.hexNumber = parseInt(this.hex.replace('#', '0x'))
      this.rgbaVals = [...hexToRGB(color), 1]
      this.rgb = RGBAToRGBString(this.rgbaVals)
      this.rgba = RGBAToRGBAString(this.rgbaVals)
      this.opacity = 1
    }

    Object.defineProperties(this, {
      isTransparent: {
        get: () =>
          this.rgbaVals[0] == 0 &&
          this.rgbaVals[1] == 0 &&
          this.rgbaVals[2] == 0 &&
          this.rgbaVals[3] == 0,
      },
    })
  }

  /*
  If we want to edit the Color instance, we only ever do so by changing rgbaVals.
  We can do this directly or use the setRed, setBlue, setGreen adn setAlpha functions below.

  After making a change, to see it reflected in the drawing, we must refresh the color.
  The refresh method recalculates values for hex, rgb and rgba based on rgbaVals

  If we use the setRed, setBlue, etc function, refresh is called automatically.
  */
  refresh(): void {
    this.hex = RGBAToHex(this.rgbaVals)
    this.rgb = RGBAToRGBString(this.rgbaVals)
    this.rgba = RGBAToRGBAString(this.rgbaVals)
    this.hexNumber = parseInt(this.hex.replace('#', '0x'))
  }

  setRed(red: number) {
    this.rgbaVals[0] = red
    this.refresh()
  }

  setBlue(blue: number) {
    this.rgbaVals[1] = blue
    this.refresh()
  }

  setGreen(green: number) {
    this.rgbaVals[2] = green
    this.refresh()
  }

  setAlpha(alpha: number) {
    this.rgbaVals[3] = alpha
    this.refresh()
  }

  copy(): Color {
    let color = new Color(this.rgbaVals)
    return color
  }
}
