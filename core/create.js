var Surface = require('./Surface');
var DomEventStreamFactory = require('./DomEventStreamFactory');

/**
 * Create a Supermove instance
 */
module.exports = function Supermove(el,options){
	return m.mount(el,{
		controller: Surface.controller.bind(Surface.controller,{
			id: 'root',
			parent:'root-container',
			show: true
		}),
		view: Surface.view
	});
};
