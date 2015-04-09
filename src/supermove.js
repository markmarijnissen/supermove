var Supermove = {
	animate: require('./animate'),
	mount: require('./mount')
};

if(typeof window !== 'undefined'){
	require('./supermove.css');
	require('polyfill-function-prototype-bind');
	window.Supermove = Supermove;
	window.Kefir = require('kefir');
	window.m = require('../lib/mithril');
}
module.exports = Supermove;