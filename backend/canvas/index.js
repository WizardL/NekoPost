'use strict'

import { Canvas } from 'canvas'

const fonts = {
  '新細明體': 'PMingLiU',
  '標楷體': 'AR PL KaitiM Big5',
  '微軟正黑粗體': 'Microsoft JhengHei',
  '思源黑體': 'Noto Sans CJK TC Regular',
  '思源黑粗體': 'Noto Sans CJK TC Black',
  '蒙納繁圓點陣': 'MBitmapRoundHK',
  '書體仿蘭亭體': 'SCFwxz',
  '新蒂金鐘體': 'Senty Golden Bell 新蒂金钟体'
}

const themes = {
  'black-blue': {
    'name': '黑底蓝字',
    'text': '#0000FF',
    'background': '#000000'
  },
  'blue-white': {
    'name': '蓝底白字',
    'text': '#FFFFFF',
    'background': '#0000FF'
  },
  'black-green': {
    'name': '黑底绿字',
    'text': '#00FF00',
    'background': '#000000'
  },
  'black-white': {
    'name': '黑底白字',
    'text': '#FFFFFF',
    'background': '#000000'
  },
  'white-black': {
    'name': '白底黑字',
    'text': '#000000',
    'background': '#FFFFFF'
  }
}

function StringWidthHeight(string, fontFamilyKey, fontSize) {
  const tmpCanvas = new Canvas(10, 10)
  const tmpCtx = tmpCanvas.getContext('2d')
  tmpCtx.textBaseline = 'top'
  tmpCtx.font = fontSize + 'px \'' + fonts[fontFamilyKey] + '\''
  const tmpBox = tmpCtx.measureText(string)
  const result = {
    'width': tmpBox.width,
    'height': tmpBox.actualBoundingBoxDescent - tmpBox.actualBoundingBoxAscent
  }
  return result
}

/**
 * Turn string into picture.
 * @function
 * @param {number} minWidth - The minimum width of the picture.
 * @param {number} minHeight - The minimum height of the picture.
 * @param {number} padding - Padding of the picture.
 * @param {string} mainString - String to be drawn in the middle of the picture.
 * @param {string} signString - String to be drawn in lower right corner of the picture.
 * @param {string} themeKey - Theme used by the picture.
 * @param {string} fontFamilyKey - Font used by mainString.
 * @param {string} mainFontSize - Size of mainString.
 * @param {string} signFontSize - Size of signString.
 * @param {Object} customTheme - Custom theme.
 * @param {string} customTheme.text - Text color of the picture.
 * @param {string} customTheme.background - Background color of the picture.
 */
export default function(minWidth, minHeight, padding, mainString, signString, themeKey, fontFamilyKey, mainFontSize, signFontSize, customTheme) {
  // Measure text width height.
  const mainStringBox = StringWidthHeight(mainString, fontFamilyKey, mainFontSize)
  const signStringBox = StringWidthHeight(signString, fontFamilyKey, signFontSize)

  // Set canvas width and height.
  if (minWidth < mainStringBox.width) {
    minWidth = mainStringBox.width
  }
  if (minHeight < mainStringBox.height + signStringBox.height) {
    minHeight = mainStringBox.height + signStringBox.height
  }
  minWidth += padding * 2
  minHeight += padding * 2

  // Create Canvas object.
  const canvas = new Canvas(minWidth, minHeight)
  const ctx = canvas.getContext('2d')

  // Set background color.
  if (customTheme)
    ctx.fillStyle = customTheme['background']
  else
    ctx.fillStyle = themes[themeKey]['background']
  ctx.fillRect(0, 0, minWidth, minHeight)

  // Set current text baseline used when drawing text.
  ctx.textBaseline = 'top'

  // Drawing text.
  if (customTheme)
    ctx.fillStyle = customTheme['text']
  else
    ctx.fillStyle = themes[themeKey]['text']
  ctx.font = mainFontSize + 'px \'' + fonts[fontFamilyKey] + '\''
  ctx.fillText(mainString,
    (minWidth - mainStringBox.width) / 2,
    (minHeight - signStringBox.height - mainStringBox.height) / 2)

  // Drawing signature.
  ctx.font = signFontSize + 'px \'' + fonts[fontFamilyKey] + '\''
  ctx.fillText(signString,
    minWidth - signStringBox.width - padding,
    minHeight - signStringBox.height - padding)

  return canvas
}
