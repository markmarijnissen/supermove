var ContainerComponent = require('./ContainerComponent');
var DomEventStreamFactory = require('./DomEventStreamFactory');

/**
 * Create a Supermove instance
 *
 * - Initialize a dom-delegate (to create DOM Event Streams)
 * - Mount a Mithril "ContainerComponent"
 */
module.exports = function Supermove(el,options){
	var api = {
		event: DomEventStreamFactory(el)
		// render -- added by ContainerComponent
		// spec -- added by ContainerComponent
	};
	m.mount(el,ContainerComponent(api,options));

	// Magic Javascript Trick - 
	// you can explicitly return an instance
	// when using `new Supermove()`
	return api;
};
