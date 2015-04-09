Supermove
---------
> A functional reactive virtual DOM layout engine, powered by Mithril and Kefir.

Experimental work in progress. !!!!


Inspired by the best ideas out there:

* Efficient Layout engine (inspired by famo.us)
	* Flat DOM
	* CSS3 matrix3d transformation to position elements
	* Cache DOM nodes

* Layout speficiation (inspired by famo.us & snabbt.js)
* Model/View/Intent (inspired by CycleJS)
* Functional reactive programming (Supermove uses Kefir)
* Virtual DOM (Supermove uses Mithril)

Example: Open `index.html` and see `test.js`

### Idea

Data flows unidirectionally: 

1. Intents = Create Input Streams
	* From DOM events using `move.stream(....)` 
	* From other data sources, such as an AJAX call.
2. Models = Transform Input Stream to an Layout-Specification stream.
	* Merge inputs: `Kefir.combine([a,b,c], function(a,b,c) { .... })`
	* map, filter, reduce, etc
	* map to `layout-specification` data
3. View = Subscribe to Layout-Spefication stream.

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

Or create animations:
```javascript
var animationStream = Supermove.animate(2000) // 0 = infinite
	.onValue(function(time){
		// time from [0...1] (with duration)
		// time in seconds (without duration)
	})
```

Or window size:
```javascript
Supermove.resize()
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

The stream should deliver an array with Layout-Specification:
```javascript
var specs = [
	{
		id: 'submit',			// required unique ID for element
		show: false,	
		width: 0,		
		height: 0,
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		x: 0,
		y: 0,
		z: 0,
		origin: [0.5, 0.5],
		scale: [1,1,1],
		opacity: 1,
		content: m('div','Hello World')	// mithril' Virtual DOM
	},{
		...
	},
	...
]
```

### Views

Simply subscribe a supermove instance to a Layout-Specification stream to update view:
```javascript
	modelStream.onValue(move.update)
```

## What does Supermove do?

Supermove uses Kefir, Mithril and dom-delegate.

What does Supermove add?

* Layout-Specification: It wraps the Virtual DOM in a Layout-Specification
	* The Layout-Specification make it easy to do layout with a CSS3 matrix3d transformation
* Subscribe to Stream: Supermove can subscribe your view to a Kefir Stream: `onValue(move.update)`
* Cache DOM nodes: Supermove manages a Mihril view for you.
* DOM Event Streams: Supermove adds DOM Event Delegation to Mithril and converts events into a Kefir Stream: `move.event(eventType,selector)`
* Animation Stream: `Supermove.animate(duration)`
* Window size Stream: `Supermove.resize()`
* Tween Layout-Specifications: `Supermove.tween(start,end)`
	* Returns a function(time){} where time = [0...1]

TODO

* Transducers
* Tween helper (interpolate between two layout-specifications)
	* Supermove.tween(start,end) ===> function(time) { }
* Size & position (alignment) relative to other elements.
	* 
* Occlusion Culling (i.e. fast scrollview)
* More examples