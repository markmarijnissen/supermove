var Kefir = require('kefir');

module.exports = Kefir.fromEvent(window,'resize')
	.map(function(event){
		return [event.target.innerWidth,event.target.innerHeight];
	})
	.toProperty([window.innerWidth,window.innerHeight]);