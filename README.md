# canvas-flex

## A wrapper around the HTML5 Canvas API with some additional functionality

Aside from *most* of the standard functions of canvas, the renderer offers a few other helpful tools you can utilize.

#### Additional Properties
* fontSize - gets or sets the font size
* fontFamily - gets or sets the font family
* width - gets the canvas width in pixels
* height - gets the canvas height in pixels
* center - gets an object containing `x` and `y`, representing the center point of the canvas

#### Additional Functions
* reset() - clears the entire canvas.
* loadImage(name, filepath) - loads an image from the filepath into the internal IMAGE_CACHE by a reference name. (asyncronous, returns a promise)
* checkImageLoaded(name) - checks if an image has finished loading.
* clearImageCache() - clears the internal IMAGE_CACHE.
* drawCachedImage(name, ...args) - pulls an image from the internal IMAGE_CACHE and draws it using `context.drawImage()`, passing the rest of the `...args` through.
* applySettings(settings) - applies the values of each supplied context property to the renderer.
* path([settings, ]actions) - wraps the `actions` callback in a begin/closePath pseudo-block. If the optional `settings` are passed in, they are applied within the block before the actions are called.
    * `paths` in canvas are used to draw objects with the same properties. Paths gather all points given to `moveTo`, `lineTo`, and `arc` functions.
* isolate([settings, ]actions) - wraps the `actions` callback in a save/restore pseudo-block. If the optional `settings` are passed in, they are applied within the block before the actions are called.
    * `isolated states` in canvas are used to draw objects with the same set of tranformations and/or properties.
* isolatePath([settings, ]actions) - wraps the `actions` callback in both a save/restore and begin/closePath pseudo-block. If the optional `settings` are passed in, they are applied within the inner block before the actions are called.
* strokeAndFillText(text, x, y) - calls both stroke and then fill text in the same position. Creates outlined text.
* fillCircle(x, y, radius) - creates a filled in circle.
* strokeCircle(x, y, radius) - creates a hollow circle.
* strokeAndFillCircle(x, y, radius) - creates an outlined circle.
* strokeAndFillRect(x, y, width, height) - creates an outlined rectangle.
* drawParagraph(text, x, y, width, stroke = false) - auto-wraps the text at `width`, and optionally applies a stroke to the text if `stroke` is `true`.
* mask(drawMask) - accepts a function `drawMask`, and everything isolated to the current scope will only be drawn to the canvas if it overlaps with the shapes drawn in the `drawMask` function.

##### Path Drawing
The following functions take in an array of points in the format `{x, y}` and an optional `options` object.

Currently there is only one option - `close`: set to `true` if you want the close the path by drawing back to the first point.
* fillPath(points, options) - creates a filled path (close defaults to `true`)
* strokePath(points, options) - creates a hollow path (close defaults to `false`)
* strokeAndFillPath(points, options) - creates an outlined path (close defaults to `true`)
* animatePath(points, frame, options) - animates a path by drawing the points by referencing the frame number. For this function, there are three options:
    * `repeat` - if set to true, this will repeat the entire animation from start once it completes
    * `wrap` - overrides `repeat` if set to true, and loops the animation with the specified length
    * `length` - defaults to the length of the array - this is the maximum number of frames to animate
    * `fade` - if set to true, this will fade the path as it is drawn

##### Special Animations
* oscillateText(text, x, y, frame, options) - creates text that oscillates per character. The text will have an effect of looking like a flag waving. This will use the current textAlign and textBaseline settings. For this function, there are four options:
    * `amplitude` - the height amount the text will rise above and below the supplied y axis.
    * `period` - the speed with which the characters oscillate (smaller fractions go slower).
    * `shift` - the amount by which to shift the start of the animation.
    * `drag` - the amount by which each subsequent character will drag behing its previous character.

#### Removed Properties and Functions
The following functions are *not* passed through to the renderer - to access them, you can use them directly through `renderer.context`:
* canvas
* direction
* beginPath()
* closePath()
* save()
* restore()

### Sprites
There is a built-in `Sprite` class that you can use to help manage animated sprites.
Its constructor takes the following arguments:
* name - the name for this sprite type. This will be the name used to load the image, so that if you have two sprites with the same image, the image will only be loaded once.
* sheet - the path to the sprite sheet image. It is assumed to be laid out in a grid with frames of uniform size.
* width - the width of each column of your sprite sheet.
* height - the height of each row of your sprite sheet.
* animations - an object describing the animations of your sprite. Each key of this object should be the name of an animation for this sprite, and the values associated with the keys should be objects with two keys.
  * frames: an array of arrays, each of which denotes [row, column, duration]
    * row - the row where this frame is located
    * column - the column where the frame is located
    * duration (optional) - the number of frames this cell should be displayed before moving to the next
      * if this is blank, this frame will be assumed to be infinite
  * next: the key of the animation to transition to once this one has finished. In order to loop animations, they should set `next` to their own key name.
    * if this is undefined, the last frame will be infinite
See the following example:
```
{
  stand: {
    frames: [
      [0, 0, 2], // 0,0 for 2 frames
      [0, 1, 2], // 0,1 for 2 frames
      [0, 2, 2], // 0,2 for 2 frames
      [0, 1, 2], // 0,1 again for 2 frames
    ],
    next: 'stand', // loop this animation
  },
  injured: {
    frames: [
      [3, 0, 2],
      [3, 1, 4],
      [3, 2],
    ],
    // no next frame, we have to manually transition back to another animation
  }
}
```

The Sprite class has the following functions:
* animate(stateKey) - sets the animation defined by `stateKey` as the current animation.
* update() - updates the animation state as defined by the animation rules laid out above.
* draw(x, y, { mirror, width, height}) - draws the current frame based on the animation state of the sprite.
  * `x` and `y` are the top left of the location where the sprite will be drawn.
  * `mirror` will flip the sprite along the x-axis if set to `true`.
  * `width` and `height` set the size to draw the sprite onto the screen. These will default to the size of the sprite.
