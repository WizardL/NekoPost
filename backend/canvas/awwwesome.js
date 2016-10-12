'use strict'

import { Canvas, Image, PNGStream } from 'canvas'

const canvas = new Canvas(233, 889)
const context = canvas.getContext('2d')

context.font = '30px Roboto'
context.fillText('Lorem ipsum', 50, 100, 2)

const te = context.measureText('Lorem ipsum')
