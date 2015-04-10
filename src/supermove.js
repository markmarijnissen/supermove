require('./supermove.css');
require('polyfill-function-prototype-bind');
var Kefir = require('kefir');
var m = require('../lib/mithril');

var Supermove = require('./mount');
Supermove.animate = require('./animate');
Supermove.resize = require('./resize');
Supermove.tween = require('./tween');
Supermove.inc = require('./inc');

// Export to Window
if(typeof window !== 'undefined'){
	window.Supermove = Supermove;
	window.Kefir = Kefir;
	window.m = m;
}
module.exports = Supermove;