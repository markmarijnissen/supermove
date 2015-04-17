require('./supermove.css');
require('polyfill-function-prototype-bind');
var Surface = require('./core/Surface');
var Kefir = require('kefir');
var m = require('mithril');

var Supermove = require('./core/create');
Supermove.merge = require('./core/merge');
Supermove.animate = require('./input/animate');
Supermove.resize = require('./input/resize');
Supermove.tween = require('./transform/tween');
Supermove.update = Surface.update;
Supermove.spec = Surface.spec;
Supermove.event = require('./core/DomEventStreamFactory')(document.body);
Supermove.VERSION = VERSION;

// Export to Window
if(typeof window !== 'undefined'){
	window.Supermove = Supermove;
	window.Kefir = Kefir;
	window.m = m;
}

if(SUPERMOVE_DEVELOPMENT){
	console.log('Supermove '+VERSION+' (developer build)');
}
module.exports = Supermove;