var Kefir = require('kefir');

var Supermove = require('./mount');
Supermove.animate = require('./animate');
Supermove.resize = require('./resize');
Supermove.tween = require('./tween');

if(typeof window !== 'undefined'){
	require('./supermove.css');
	require('polyfill-function-prototype-bind');
	window.Supermove = Supermove;
	window.Kefir = require('kefir');
	window.m = require('../lib/mithril');
}
module.exports = Supermove;