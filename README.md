Supermove
---------
> A functional reactive virtual DOM layout engine, powered by Mithril and Kefir.

## Experimental work in progress

The public API is currently in heavy flux. After working out how 
to deal with containers/groups, I expect the API to be more stable.

### TODO

* Current
	* **Working out how to deal with containers/groups**
* Next
	* Easing functions
	* Set supermove-root (see famo.us?)
	* Set perspective
	* [bug] Button "(OFF)" text only appears after first hover.
* Later
	* Occlusion Culling (i.e. fast scrollview)
	* Draggable input stream (i.e. combine several DOM Event Streams into something meaningful)
* Even later
	* Physics input stream (using Matter.js?)
	* Pinch/Rotate input stream (re-using famo.us' Input Syncs?)
	* Write unit tests.
	* Multiple independent Supermove Containers on one page.
	* [bug] DOM Cache - some nodes are free but never used (see dom-cache-test.js)	
	* [bug] DOM Cache - does not check for element tag type.
	* Transduce something.

---

## The Vision

A superfast, easy-to-use library for creating complex animated user interfaces.

* Friendly developer API
* Targets mobile devices (iOS/Android apps with Cordova)
* Fast and efficient
* Easy and powerful animations
	* Tweening
	* Physics
	* Couple animation to user interaction
	* Link multiple elements and animations together
* Reusable widgets / components / behaviors

## The Idea: Transform input to layout

The idea is simple: A user interface transforms input streams to layout specifications.

```javascript
// 1. Input Stream
move.event('click','#submit')
// 2. Transform to layout
.map(function(){
	return {
		id: 'submit',
		content: 'clicked submit!'
	}
})
// 3. Render
.onValue(move.render);
```

### Input

This can be anything:

* A DOM event using `move.event(....)` 
* A time value using `Supermove.animate(500)`
* Position, size, etc from other elements.
* Other data sources, such as data from your business logic or an AJAX call.

## Layout

A layout has multiple elements. Each element is positioned using a **one or more** `layout-specification`:

```javascript
var spec = {
		id: '',					// required unique ID for element
		behavior: 'main'		// name for the behavior
		element: '.supermove-surface' // mithril' virtual DOM element for wrapper surface.
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
		content: ''	// mithril' Virtual DOM, i.e. m('div','Hello World')
	}
```
Everything is optional, except for the `id` to specify the target element.

In order to facilitate mixins, components and directives, a single element can have
more than one layout-specification. When rendering, all layout-specifications are [merged
into one](src/core/merge.js). 

Every layout-specification on an element is called an **behavior**. Behaviors are
similar to mixins, components, widgets or directives.

For example, a button element might have several behaviors:

* `button`: Add a hover-animation
* `data`: Add the button text
* `layout`: Set x,y,width,height
* `router`: Control visibility depending on url.

You can also use `Supermove.merge` to manually merge multipe specs into one. See the [button.js](src/behaviors/button.js) component for an example.

## Usage
Create a Supermove to an element
```javascript
var move = new Supermove(document.body);
```

#### Input 

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

layout-specification from another element:
```javascript
var childWidth = move.spec('parent').width * 0.5;
// Note: move.spec() is NOT a stream, unlike the others!
```

#### Transform

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

* Note: When we don't specify an behavior, it will default to `main`.
* Note: `scaleX` and `scaleY` are **added**, because the `default` behavior is `scaleX=1` and `scaleY=1`. Supermove will merge `default` and `main` behavior. For scale, this is done using simple addition.

#### Render

Subscribe to a stream with `move.render`
```javascript
modelStream.onValue(move.render)
```

Hint: Not updating? Call `m.redraw()`!

#### Tricks

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

## Credits

* **Mithril**, included as Virtual DOM rendering engine.
* **Kefir**, included as FRP library to handle streams.
* **gl-matrix**, partially included (only mat4).
* **dom-delegate**, included to create DOM Event Streams.

Inspired by famo.us:

* **famo.us**
	* `Surface` as name for an element
	* Using the `matrix3d` transform to do the layout.
	* Keeping the DOM as flat as possible.
	* CSS stylesheet.
	* Caching DOM nodes.
	* Specifying layout using opacity, scale, translate, etc.
	* Input Syncs (pinch, rotate, etc)


## Contact
-   @markmarijnissen
-   http://www.madebymark.nl
-   info@madebymark.nl

© 2015 - Mark Marijnissen
