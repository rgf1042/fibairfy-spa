import { fabric } from 'fabric'

/* eslint-disable */

function Pfusion(cnvs, vue) {
  this.vue = vue
  this.defaultCanvasHeight = 800
  this.defaultCanvasWidth = 800
  this.defaultHeightCable = 30
  this.defaultHeightTube = 50
  this.defaultHeightFiber = 80
  this.defaultWidthCable1Tube = 90
  this.defaultWidthTube = 80
  this.defaultMarginTube = (this.defaultWidthCable1Tube - this.defaultWidthTube)/2
  this.defaultMarginCables = 70
  this.defaultWidthStrokeFiber = 3
  this.defaultFusionOffset = 15
  this.defaultFusionChunk = 6
  this.fontsize = 14

  this.fibersGraphics = {}
  this.site = this.vue.$store.getters['projects/currentSite']

  this.boxes = this.vue.$store.getters['projects/boxesIndexes'](this.site)
  this.cables = this.vue.$store.getters['projects/cablesIndexes'](this.site)

  // Fabric.js
  this.canvas = new fabric.StaticCanvas(cnvs)
  this.canvas.setHeight(this.defaultCanvasHeight)
  this.canvas.setWidth(this.defaultCanvasWidth)
  this.canvas.backgroundColor = '#FFF8DC'
  this.canvas.renderAll()

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
  for (let x in this.tubes) {
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

  this.fusions = this.vue.$store.getters['projects/getFusions']

  console.log(this.fibers)
}

Pfusion.prototype.draw = function () {
  this.drawCables()
  this.drawFusions()
}

Pfusion.prototype.drawCables = function () {
  let top = this.defaultMarginCables
  let left = this.defaultCanvasWidth - this.defaultMarginCables
  let width, height
  for (let x in this.cables) {
    let cable = this.cables[x]
    let name = this.vue.$store.getters['projects/findCableById'](cable).name
    let rectCable
    if (x % 2) { // odd
      // We draw it vertical
      width = this.defaultHeightCable
      height = this.defaultWidthCable1Tube * this.tubesCables[cable].length
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
      width = this.defaultWidthCable1Tube * this.tubesCables[cable].length
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
  for (let x in this.fusions) {
    if (this.fusions.hasOwnProperty(x)) {
      let fusion = this.fusions[x]
      let x1, y1, x2, y2
      let color1, color2
      let direction1, direction2
      let number1, number2
      let flag = true // TODO: Remove in future
      if (fusion[0].type === 'fiber') {
        let id = fusion[0].id
        x1 = this.fibers[id].lineFiber.x2
        y1 = this.fibers[id].lineFiber.y2
        color1 = this.fibers[id].color
        direction1 = this.fibers[id].direction
        number1 = this.fibers[id].number
      } else if (fusion[0].type === 'box') { // TODO
        flag = false
      }

      if (fusion[1].type === 'fiber') {
        let id = fusion[1].id
        x2 = this.fibers[id].lineFiber.x2
        y2 = this.fibers[id].lineFiber.y2
        color2 = this.fibers[id].color
        direction2 = this.fibers[id].direction
        number2 = this.fibers[id].number
      } else if (fusion[1].type === 'box') { // TODO
        flag = false
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
  }
}
export default Pfusion
