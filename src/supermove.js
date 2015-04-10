require('./supermove.css');
require('polyfill-function-prototype-bind');
var Kefir = require('kefir');
var m = require('../lib/mithril');

var Supermove = require('./mount');
Supermove.animate = require('./animate');
Supermove.resize = require('./resize');
Supermove.tween = require('./tween');
Supermove.combine = require('./combine');
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