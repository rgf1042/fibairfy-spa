import { fabric } from 'fabric'
import { forEach } from 'lodash-es'
/* eslint-disable */

function Pfusion(cnvs, vue) {
  // We add reference to Vue subsystem
  this.vue = vue

  this.site = this.vue.$store.getters['projects/currentSite']
  this.boxes = this.vue.$store.getters['projects/boxesIndexes'](this.site)
  this.cables = this.vue.$store.getters['projects/cablesIndexes'](this.site) || []
  this.fusions = this.vue.$store.getters['projects/getFusions']

  this.tubesCables = {}
  this.tubes = {}
  this.tubesCount = 0
  for (let x in this.cables) {
    let cable = this.cables[x]
    this.tubesCables[cable] = this.vue.$store.getters['projects/tubesIndexes'](cable)
    for (let y in this.tubesCables[cable]) {
      let tube = this.tubesCables[cable][y]
      this.tubes[tube] = this.vue.$store.getters['projects/findTubeById'](tube)
      ++this.tubesCount
    }
  }
  this.fibersTubes = {}
  this.fibers = {}
  for (let x in this.tubesCables) {
    if (this.tubesCables.hasOwnProperty(x)) {
      for (let y in this.tubesCables[x]) {
        let tube = this.tubesCables[x][y]
        this.fibersTubes[tube] = this.vue.$store.getters['projects/fibersIndexes'](tube)
        for (let z in this.fibersTubes[tube]) {
          let fiber = this.fibersTubes[tube][z]
          this.fibers[fiber] = this.vue.$store.getters['projects/findFiberById'](fiber)
        }
      }
    }
  }

  // We define global data and constants
  this.defaultHeightCable = 30
  this.defaultHeightTube = 50
  this.defaultHeightFiber = 80
  this.defaultHeightBox = 100
  this.defaultWidthBox = this.defaultHeightBox * 2
  this.defaultWidthCable1Tube = 90
  this.defaultWidthTube = 80
  this.defaultMarginTube = (this.defaultWidthCable1Tube - this.defaultWidthTube)/2
  this.defaultMarginCables = 70
  this.defaultMarginBox = 70
  this.defaultWidthStrokeFiber = 3
  this.defaultOffsetCables = this.defaultHeightBox + this.defaultMarginBox * 2 + this.defaultHeightFiber
  this.defaultFusionOffset = 15
  this.defaultFusionChunk = 6
  this.fontsize = 14

  let cablesWidth = (this.defaultOffsetCables * 2) + (this.tubesCount * (this.defaultWidthTube + (this.defaultMarginTube * 2))
    + (this.defaultMarginCables * (this.cables.length/2)))
  let boxesWidth = ((this.boxes.length + 1) * this.defaultWidthBox)
  this.defaultCanvasWidth = (boxesWidth > cablesWidth) ? boxesWidth : cablesWidth
  this.defaultCanvasHeight = this.defaultCanvasWidth

  // Fabric.js
  this.canvas = new fabric.StaticCanvas(cnvs)
  this.canvas.setHeight(this.defaultCanvasHeight)
  this.canvas.setWidth(this.defaultCanvasWidth)
  this.canvas.backgroundColor = '#FFF8DC'
  this.canvas.renderAll()

  this.fibersBoxesGraphics = {}

  console.log(this.fibers)
}

Pfusion.prototype.draw = function () {
  this.drawCables()
  this.drawBoxes()
  this.drawFusions()
}

Pfusion.prototype.drawBoxes = function () {
  let top = this.defaultMarginBox
  let left = this.defaultCanvasWidth - (this.defaultMarginBox + this.defaultWidthBox)
  let width = this.defaultWidthBox
  let height = this.defaultHeightBox

  for (let x in this.boxes) {
    let box = this.vue.$store.getters['projects/findBoxById'](this.boxes[x])
    let rectBox = new fabric.Rect({
      left: left,
      top: top,
      fill: 'black',
      width: width,
      height: height
    })
    let text = new fabric.Text('box ' + box.id, {
      left: left,
      top: top + (height / 2),
      fontSize: 20,
      stroke: 'white'
    })
    this.canvas.add(rectBox)
    this.canvas.add(text)
    this.drawFibersBoxes(box, rectBox)
    left -= (this.defaultMarginBox + this.defaultWidthBox)
  }
}

Pfusion.prototype.drawFibersBoxes = function (box, rectBox) {
  let defaultChunk = (rectBox.width /2) / box.inputFO
  let top = rectBox.top + rectBox.height
  let left = rectBox.left

  for (let i = 1; i <= box.inputFO; ++i) {
    let lineFiber = new fabric.Line([left, top, left, top + this.defaultHeightFiber], {
      stroke: 'grey',
      strokeWidth: this.defaultWidthStrokeFiber
    })
    this.fibersBoxesGraphics[box.id] = this.fibersBoxesGraphics[box.id] || {}
    this.fibersBoxesGraphics[box.id].inputs = this.fibersBoxesGraphics[box.id].inputs || {}
    this.fibersBoxesGraphics[box.id].inputs[i] = lineFiber

    this.canvas.add(lineFiber)
    left += defaultChunk
  }

  defaultChunk = (rectBox.width /2) / box.outputFO
  top = rectBox.top + rectBox.height
  left = rectBox.left + (rectBox.width /2)
  for (let i = 1; i <= box.outputFO; ++i) {
    let lineFiber = new fabric.Line([left, top, left, top + this.defaultHeightFiber], {
      stroke: 'brown',
      strokeWidth: this.defaultWidthStrokeFiber
    })
    this.fibersBoxesGraphics[box.id] = this.fibersBoxesGraphics[box.id] || {}
    this.fibersBoxesGraphics[box.id].outputs = this.fibersBoxesGraphics[box.id].outputs || {}
    this.fibersBoxesGraphics[box.id].outputs[i] = lineFiber

    this.canvas.add(lineFiber)
    left += defaultChunk
  }
}

Pfusion.prototype.drawCables = function () {
  let top = this.defaultOffsetCables
  let left = this.defaultCanvasWidth - this.defaultMarginCables
  let width, height
  for (let x in this.cables) {
    let cable = this.cables[x]
    let name = 'cable ' + this.vue.$store.getters['projects/findCableById'](cable).id
    let rectCable
    if (x % 2) { // odd
      // We draw it vertical
      let length = this.tubesCables[cable] ? this.tubesCables[cable].length : 1
      width = this.defaultHeightCable
      height = this.defaultWidthCable1Tube * length
      rectCable = new fabric.Rect({
        left: 0,
        top: top,
        fill: 'black',
        width: width,
        height: height
      })
      let text = new fabric.Text(name, {
        left: (width / 2) + 12,
        top: top + this.defaultMarginTube,
        fontSize: 20,
        stroke: 'white'
      })
      text.set('angle', 90)
      this.canvas.add(rectCable)
      this.canvas.add(text)
      this.drawTubes(cable, rectCable)
      top += (this.defaultMarginCables + height)
    } else { // even
      // We draw it horizontal
      let length = this.tubesCables[cable] ? this.tubesCables[cable].length : 1
      width = this.defaultWidthCable1Tube * length
      height = this.defaultHeightCable
      rectCable = new fabric.Rect({
        left: left - width,
        top: this.defaultCanvasHeight - height,
        fill: 'black',
        width: width,
        height: height
      })
      let text = new fabric.Text(name, {
        left: left - width + this.defaultMarginTube,
        top: (this.defaultCanvasHeight - (height/2)) - 12,
        fontSize: 20,
        stroke: 'white'
      })
      this.canvas.add(rectCable)
      this.canvas.add(text)
      this.drawTubes(cable, rectCable)
      left -= (this.defaultMarginCables + width)
    }
  }
}

Pfusion.prototype.drawTubes = function (cable, rectCable) {
  if ((rectCable.width / rectCable.height) < 1) { // Vertical
    let top = rectCable.top + this.defaultMarginTube
    let left = rectCable.left + this.defaultHeightCable
    for (let x in this.tubesCables[cable]) {
      let tube = this.tubesCables[cable][x]
      let color = this.tubes[tube].color
      let rectTube = new fabric.Rect({
        left: left,
        top: top,
        fill: color,
        width: this.defaultHeightTube,
        height: this.defaultWidthTube
      })
      let text = new fabric.Text(color, {
        left: left + (this.defaultHeightTube/2) + 12,
        top: top + this.defaultMarginTube,
        fontSize: 20,
        stroke: (color === 'black') ? 'white': 'black'
      });
      text.set('angle', 90)
      this.canvas.add(rectTube)
      this.canvas.add(text)
      this.drawFibers(tube, rectTube)
      top += this.defaultWidthTube + (this.defaultMarginTube*2)
    }
  } else { // Horizontal
    let top = rectCable.top - this.defaultHeightTube
    let left = rectCable.left + this.defaultMarginTube
    for (let x in this.tubesCables[cable]) {
      let tube = this.tubesCables[cable][x]
      let color = this.tubes[tube].color
      let rectTube = new fabric.Rect({
        left: left,
        top: top,
        fill: color,
        width: this.defaultWidthTube,
        height: this.defaultHeightTube
      })
      let text = new fabric.Text(color, {
        left: left + this.defaultMarginTube,
        top: top + (this.defaultHeightTube / 2) - 12,
        fontSize: 20,
        stroke: (color === 'black') ? 'white': 'black'
      });
      this.canvas.add(rectTube)
      this.canvas.add(text)
      this.drawFibers(tube, rectTube)
      left += this.defaultWidthTube + (this.defaultMarginTube*2)
    }
  }
}

Pfusion.prototype.drawFibers = function (tube, rectTube) {
  if (!this.fibersTubes[tube]) return false // We don't have any fibers
  let number = 1
  if ((rectTube.width / rectTube.height) < 1) { // Vertical
    let defaultChunk = rectTube.height / this.fibersTubes[tube].length
    let top = rectTube.top
    let left = rectTube.left + this.defaultHeightTube + this.defaultHeightFiber
    for (let x in this.fibersTubes[tube]) {
      let fiber = this.fibersTubes[tube][x]
      let color = this.fibers[fiber].color
      let lineFiber = new fabric.Line([rectTube.left + this.defaultHeightTube, top, left, top], {
        stroke: color,
        strokeWidth: this.defaultWidthStrokeFiber
      })
      this.fibers[fiber].lineFiber = lineFiber // We add graphical reference to fibers Object
      this.fibers[fiber].direction = 'vertical'
      this.fibers[fiber].number = number
      this.canvas.add(lineFiber)
      top += defaultChunk
      ++number // An offset number for drawing it without junctions
    }
  } else { // Horizontal
    let defaultChunk = rectTube.width / this.fibersTubes[tube].length
    let top = rectTube.top - this.defaultHeightFiber
    let left = rectTube.left
    for (let x in this.fibersTubes[tube]) {
      let fiber = this.fibersTubes[tube][x]
      let color = this.fibers[fiber].color
      let lineFiber = new fabric.Line([left, rectTube.top, left, top], {
        stroke: color,
        strokeWidth: this.defaultWidthStrokeFiber
      })
      this.fibers[fiber].lineFiber = lineFiber // We add graphical reference to fibers Object
      this.fibers[fiber].direction = 'horizontal'
      this.fibers[fiber].number = number
      this.canvas.add(lineFiber)
      left += defaultChunk
      ++number // An offset number for drawing it without junctions
    }
  }
}

Pfusion.prototype.drawFusions = function () {
  forEach(this.fusions, (fusion, i, fusions) => {
    let x1, y1, x2, y2
    let color1, color2
    let direction1, direction2
    let number1, number2

    let flag = true // TODO: I don't know the meaning of this
    
    const first = fusion[0] // First endpoint
    if (first.type === 'fiber') {
      x1 = this.fibers[first.id].lineFiber.x2
      y1 = this.fibers[first.id].lineFiber.y2
      color1 = this.fibers[first.id].color
      direction1 = this.fibers[first.id].direction
      number1 = this.fibers[first.id].number
    } else if (first.type === 'box') {
      const inout = (first.in) ? 'inputs' : 'outputs'
      number1 = (first.in) ? first.in : first.out
      x1 = this.fibersBoxesGraphics[first.id][inout][number1].x2
      y1 = this.fibersBoxesGraphics[first.id][inout][number1].y2
      color1 = this.fibersBoxesGraphics[first.id][inout][number1].stroke
      direction1 = 'box'
    }

    const last = fusion[1] // Second endpoint
    if (last.type === 'fiber') {
      x2 = this.fibers[last.id].lineFiber.x2
      y2 = this.fibers[last.id].lineFiber.y2
      color2 = this.fibers[last.id].color
      direction2 = this.fibers[last.id].direction
      number2 = this.fibers[last.id].number
    } else if (last === 'box') {
      const inout = (last.in) ? 'inputs' : 'outputs'
      number2 = (last.in) ? last.in : last.out
      x2 = this.fibersBoxesGraphics[last.id][inout][number2].x2
      y2 = this.fibersBoxesGraphics[last.id][inout][number2].y2
      color2 = this.fibersBoxesGraphics[last.id][inout][number2].stroke
      direction2 = 'box'
    }

    if (flag) {
      if (direction1 === direction2) { // They are parallel
        let line1x2, line1y2, line2x2, line2y2
        if (direction1 === 'horizontal') {
          line1x2 = x1
          line1y2 = y1 - ((this.defaultFusionChunk * number1) + this.defaultFusionOffset)

          line2x2 = x2
          line2y2 = y2 - ((this.defaultFusionChunk * number1) + this.defaultFusionOffset)
        } else if (direction1 === 'vertical') {
          line1x2 = x1 + (this.defaultFusionChunk * number1) + this.defaultFusionOffset
          line1y2 = y1

          line2x2 = x2 + (this.defaultFusionChunk * number1) + this.defaultFusionOffset
          line2y2 = y2
        }

        let lineFusion1 = new fabric.Line([x1, y1, line1x2, line1y2], {
          stroke: color1,
          backgroundColor: color2,
          strokeDashArray: [5, 5],
          strokeWidth: this.defaultWidthStrokeFiber
        })

        let lineFusion2 = new fabric.Line([x2, y2, line2x2, line2y2], {
          stroke: color1,
          backgroundColor: color2,
          strokeDashArray: [5, 5],
          strokeWidth: this.defaultWidthStrokeFiber
        })

        let lineFusion3 = new fabric.Line([line1x2, line1y2, line2x2, line2y2], {
          stroke: color1,
          backgroundColor: color2,
          strokeDashArray: [5, 5],
          strokeWidth: this.defaultWidthStrokeFiber
        })

        this.canvas.add(lineFusion1)
        this.canvas.add(lineFusion2)
        this.canvas.add(lineFusion3)
      }
      else {
        if (direction1 === 'box' && direction2 === 'horizontal'
            || direction2 === 'box' && direction1 === 'horizontal') { // TODO

            let avg
            let line1y2
            let line2y2
            let random = number1 * this.defaultFusionChunk * (Math.random() * 4)
            if (direction1 === 'box') {
              avg = (y2 - y1) / 2
              line1y2 = y1 + avg + random
              line2y2 = y2 - (avg - random)
            } else {
              avg = (y1 - y2) / 2
              line1y2 = y1 - (avg - random)
              line2y2 = y2 + avg + random
            }
            let lineFusion1 = new fabric.Line([x1, y1, x1, line1y2], {
              stroke: color1,
              backgroundColor: color2,
              strokeDashArray: [5, 5],
              strokeWidth: this.defaultWidthStrokeFiber
            })

            let lineFusion2 = new fabric.Line([x2, y2, x2, line2y2], {
              stroke: color1,
              backgroundColor: color2,
              strokeDashArray: [5, 5],
              strokeWidth: this.defaultWidthStrokeFiber
            })

            let lineFusion3 = new fabric.Line([x1, line1y2, x2, line2y2], {
              stroke: color1,
              backgroundColor: color2,
              strokeDashArray: [5, 5],
              strokeWidth: this.defaultWidthStrokeFiber
            })

            this.canvas.add(lineFusion1)
            this.canvas.add(lineFusion2)
            this.canvas.add(lineFusion3)
        } else {
          let line1x2, line1y2
          if (direction1 === 'vertical') {
            line1x2 = x2
            line1y2 = y1
          } else {
            line1x2 = x1
            line1y2 = y2
          }

          let lineFusion1 = new fabric.Line([x1, y1, line1x2, line1y2], {
            stroke: color1,
            backgroundColor: color2,
            strokeDashArray: [5, 5],
            strokeWidth: this.defaultWidthStrokeFiber
          })

          let lineFusion2 = new fabric.Line([x2, y2, line1x2, line1y2], {
            stroke: color1,
            backgroundColor: color2,
            strokeDashArray: [5, 5],
            strokeWidth: this.defaultWidthStrokeFiber
          })

          this.canvas.add(lineFusion1)
          this.canvas.add(lineFusion2)
        }
      }

    }
  })
}
export default Pfusion
