var ContainerComponent = require('./ContainerComponent');
var DomEventStream = require('./DomEventStream');

module.exports = function Supermove(el,options){
	var api = {
		event: DomEventStream(el)
		// render -- added by ContainerComponent
		// spec -- added by ContainerComponent
	};
	m.mount(el,ContainerComponent(api,options));

	// Magic Javascript Trick - 
	// you can explicitly return an instance
	// when using `new Supermove()`
	return api;
};
