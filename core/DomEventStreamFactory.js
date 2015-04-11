var DomDelegate = require('dom-delegate').Delegate;
var Kefir = require('kefir');

/**
 * createDomEventStreamFactory(element)
 *
 * Initialize a DomDelegate instance to create a
 * Stream Factory - it's actually a StreamFactory-Factory :)
 */
function createDomEventStreamFactory(el){
	var delegate = new DomDelegate(el);
	return DomEventStreamFactory.bind(delegate);
}

/**
 * Stream factory
 *
 * Create a stream of DOM Events
 */
function DomEventStreamFactory(eventType,handler,useCapture){
	// `this` is bound to a dom-delegate instance.
	// 
	// We use function.bind() to get a partially applied
	// 'subscribe' and 'unsubscribe' function.
	// 
	// The only argument remaining is the "callback" argument,
	// which is exactly what Kefir needs.
	return Kefir.fromSubUnsub(
		subscribe.bind(this,eventType,handler,useCapture),
		unsubscribe.bind(this,eventType,handler,useCapture)
	);
}

/**
 * Subscribe to DOM-Events
 *
 * Note: `this` is bound to a dom-delegate instance
 */
function subscribe(eventType,handler,useCapture,callback){
	this.on(eventType,handler,callback,useCapture);
}

/**
 * Subscribe to DOM-Events
 *
 * Note: `this` is bound to a dom-delegate instance
 */
function unsubscribe(eventType,handler,useCapture,callback){
	this.off(eventType,handler,callback,useCapture);
}

module.exports = createDomEventStreamFactory;