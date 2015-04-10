Supermove
---------
> A functional reactive virtual DOM layout engine, powered by Mithril and Kefir.

## Experimental work in progress !!

The public API is changing a LOT as I find a way to work with components/widgets/modifiers
that makes sense.

## TODO

* Modifiers/Widgets/Components/Directives/Mixins/Behaviors **!!!!**
	* How to map an element to a stream in such way you can have:
		* A base specification
		* then add modifiers / widgets / angular directives / mixins / behaviors
	* How to apply a transformation/modifier on ALL elements (to facilitate occlusion culling)

* Various improvements
	* Remove gl-matrix dependency - extract only needed calculations (see snabbt.js?)
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
* Reusable widgets / components
	* Tab-bar, image carousel, buttons, etc


## Idea

Data flows unidirectionally: 

1. Intents = Create Input Streams
	* From DOM events using `move.stream(....)` 
	* From other data sources, such as an AJAX call.
2. Models = Transform Input Stream to an Layout-Specification stream.
	* Merge inputs: `Kefir.combine([a,b,c], function(a,b,c) { .... })`
	* map, filter, reduce, etc
	* map to `layout-specification` data
3. View = Subscribe to Layout-Specification stream.

## Usage

Create a Supermove to an element
```javascript
var move = new Supermove(document.body);
```


### Intent / Input
Create Intent (Stream of DOM Events)
```javascript
var submitIntent = move.stream('click','#submit')
```

### Models

Create Models (Transform Intent to Layout-Speficiation)
```javascript
var modelStream = 
	submitIntent
		.map(function(event){
			return {
				id: 'message',
				content: event.target.value
			}
		});
```

The stream should deliver a Layout-Specification:
```javascript
var specs = [
	{
		id: 'submit',			// required unique ID for element
		element: '.text.class'  // mithril' virtual DOM element for wrapper surface.
		show: false,	
		width: 0,		
		height: 0,
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
	},{
		...
	},
	...
]
```

Hint: To update multiple elements, emit an array of layout-specification events and then call `flatten()`.

### Views

**IS CHANGING**

Simply subscribe a supermove instance to a Layout-Specification stream to update view:
```javascript
// Draw element with `id` using the `stream` with Layout-Specification
move.subscribe(id,stream);
move.unsubscribe(id,stream);
```

Hint: Not updating? Call `m.redraw()`!

Hint: For cool particle systems, use `move.inc` to let every particle exert a force on the element.

### Helpers

```javascript
// Stream based on requestAnimationFrame
Supermove.animate(500); // return Stream. 0 = forever
	.onValue(function(time){
		// time from [0...1] (with duration)
		// time in seconds (without duration)
	})

// Stream with window size:
Supermove.resize;

// Tween between two specs
Supermove.tween(startSpec,endSpec,t); // return tweened spec at time t.
Supermove.tween(startSpec,endSpec) // return function(time) {... }

// Combine Animation with Tween like this:
Supermove
	.animate(500)
	.map(Supermove.tween(start,end)) // Stream with tweening spec

// Get Layout-Specification (for relative positioning and sizing)
var spec = move.element('parent') // returns Layout-Specification

```

## What does Supermove do?

Supermove uses Kefir, Mithril and dom-delegate.

What does Supermove add?

* Layout-Specification: It wraps the Virtual DOM in a Layout-Specification
	* The Layout-Specification make it easy to do layout with a CSS3 matrix3d transformation
* View are stream subscribers.
* Cache DOM nodes: Supermove manages a Mihril view for you.
* DOM Event Streams: Supermove adds DOM Event Delegation to Mithril and converts events into a Kefir Stream: `move.event(eventType,selector)`
* Animation Stream: `Supermove.animate(duration)`
* Window size Stream: `Supermove.resize`
* Tween helper: `Supermove.tween(startSpec,endSpec)(time)`
* Combine helper: Combine multiple specs into one.

