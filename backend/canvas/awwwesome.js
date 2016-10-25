'use strict'

import { Canvas, Image, PNGStream } from 'canvas'

const canvas = new Canvas(233, 889)
const context = canvas.getContext('2d')

function random_rect(rect_no) {
  context.font = '30px Roboto'
  context.fillText('Lorem ipsum', 50, 100, 2)
}

const genFrom = (min, max) => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
}

export default (str) => {
  background_random(genFrom(1, 4))
  random_rect(genFrom(2, 3))
  big_rect_with_words(str)
}
