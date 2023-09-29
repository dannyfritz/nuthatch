# Rendix

Rendix is an immeidate mode renderer backed by Pixi@^7.
All draw calls made to Rendix are recorded to an internal buffer.
When `Rendix.render()` is called, the internal buffer is iterated over and objects are drawn to the canvas.
When `Rendix.clear()` is called, the screen & buffer are blanked; no state is retained.

## Features

- Foundational
  - [x] render
  - [x] clear
- DrawObjects
  - [ ] drawCircle
  - [ ] drawLine
  - [ ] drawPolygon
  - [x] drawRect
  - [x] drawSprte
  - [x] drawText
  - [x] fillStyle
- Framebuffer
  - [ ] Save Framebuffer
- Matrix Transforms
  - [x] scale
  - [x] rotate
  - [x] translate
  - [x] push
  - [x] pop

