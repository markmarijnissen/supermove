var Kefir = require('kefir');

var SIZE = [window.innerWidth,window.innerHeight];

module.exports = Kefir.fromEvent(window,'resize')
	.map(function(event){
		return [event.target.innerWidth,event.target.innerHeight];
	})
	.toProperty(SIZE);