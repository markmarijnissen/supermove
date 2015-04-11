Supermove
---------
> A functional reactive virtual DOM layout engine, powered by Mithril and Kefir.

## Experimental work in progress !!

## TODO

* Various improvements
	* Include easing functions.
	* Set supermove-root (see famo.us?)
	* Set perspective
	* DOM Cache bug - some nodes are free but never used (see dom-cache-test.js)
	* Occlusion Culling (i.e. fast scrollview)

* Do something cool with transducers?

---

Inspired by the best ideas out there:

* Efficient Layout engine (inspired by famo.us)
	* Flat DOM
	* CSS3 matrix3d transformation to position elements
	* Cache DOM nodes
* Layout specification (inspired by famo.us & snabbt.js)
* Model/View/Intent (inspired by CycleJS)
* Functional reactive programming (Supermove uses Kefir)
* Virtual DOM (Supermove uses Mithril)

Example: Open `index.html` and see `test.js`

## The Vision

A fast, efficient, easy-to-use library for creating
and animating app layouts.

* Friendly developer API
* Targets mobile devices (iOS/Android apps with Cordova)
* Fast and efficient
* Easy and powerful animations
	* Tweening
	* Physics
	* Couple animation to user interaction
	* Link multiple elements and animations together
* Reusable widgets / components / behaviors


## Idea

Transform input (user input, time, model-data) to a layout-specification.

1. Input
	* From DOM events using `move.event(....)` 
	* From TIME using `Supermove.animate(500)`
	* From other data sources, such as an AJAX call.
2. Model: Transform input to one or more Layout-Specification events.
	* Merge inputs: `Kefir.combine([a,b,c], function(a,b,c) { .... })`
	* map, filter, reduce, etc
	* map to `layout-specification` data
3. Render: Subscribe to Layout-Specification stream.

### The layout specification:
```javascript
var spec = {
		id: 'submit',			// required unique ID for element
		behavior: '...'			// name for the behavior
		element: '.text.class'  // mithril' virtual DOM element for wrapper surface.
		show: false,	
		width: 0,				// For [0..1] unit is '%', otherwise 'px'
		height: 0,				// For [0..1] unit is '%', otherwise 'px'
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		x: 0,
		y: 0,
		z: 0,
		originX: 0.5,
		originY: 0.5,
		scaleX: 1,
		scaleY: 1,
		scaleZ: 1,
		opacity: 1,
		content: m('div','Hello World')	// mithril' Virtual DOM
	}
```
Everything is optional, except for the `id` to specify the target element.

### Behaviors

An single element can merge multiple Layout Specifications. This is called a **behavior**.

For example:

* `button`: Add a hover-animation
* `data`: Add the button text
* `layout`: Set x,y,width,height
* `router`: Control visibility depending on url.
* `default`: Default behavior (see above)

You can define a behavior using the `behavior` attribute in the `layout-specification`. When rendering, all different behaviors are merged into a single spec. See [combine.js](src/core/combine.js).

You can also use `Supermove.combine` to manually merge multipe specs into one. See the [button.js](src/behaviors/button.js) component.

## Usage
Create a Supermove to an element
```javascript
var move = new Supermove(document.body);
```

### Input 

DOM Event
```javascript
var submitIntent = move.stream('click','#submit')
```

Time
```javascript
var animation = Supermove.animate(500);
```

Window size:
```javascript
Supermove.resize
```

Layout Specification from another element:
```javascript
var childWidth = move.spec('parent').width * 0.5;
// Note: move.spec() is NOT a stream, unlike the others!
```

### Model / Transform

Transform intent to layout-specification:
```javascript
var modelStream = 
	submitIntent
		.flatMapLatest(Supermove.animate(500))
		.map(Supermove.tween(
			{id:'message', scaleX: 0, scaleY: 0, content: 'Hello World'},
			{              scaleX: 1, scaleY: 1,                       }
		))
```

### Render

Simply subscribe to a stream with `move.render`
```javascript
modelStream.onValue(move.render)
```

Hint: Not updating? Call `m.redraw()`!

### Tricks

* For `width` and `height`, `[0..1]` is rendered as percentage `%`, the rest as `px`.
* Use `move.spec(id)` for relative size and positioning (alignment)

## Changelog

### 0.2.0 (11/04/2014)

* Implemented behaviors
* Lots of changes

### 0.1.0 (04/04/2014)

* First release

## Contribute

Convert CommonJS to a browser-version:
```bash
npm install webpack -g
npm run prepublish
```

Feel free to contribute to this project in any way. The easiest way to support this project is by giving it a star.

## Contact
-   @markmarijnissen
-   http://www.madebymark.nl
-   info@madebymark.nl

© 2015 - Mark Marijnissen
