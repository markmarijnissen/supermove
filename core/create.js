var Surface = require('./Surface');
var DomEventStreamFactory = require('./DomEventStreamFactory');

/**
 * Create a Supermove instance
 */
module.exports = function Supermove(el,options){
	options = {
		id: 'root',
		parent:'root-container',
		show: true
	};

	return m.mount(el,{
		controller: Surface.controller.bind(Surface.controller,options),
		view: Surface.view
	});

	// who doesn't this work???
	// return m.mount(el, m.component(Surface,options));
};
