var Kefir = require('kefir');
var m = require('mithril');
var callbacks = [];

function step(time){
	var len = callbacks.length;
	if(len > 0){
		for(var i = len-1; i >= 0; i--){
			if(!callbacks[i].start) {
				callbacks[i].start = time;
			} 
			if(callbacks[i].duration > 1 && time - callbacks[i].start > callbacks[i].duration){
				callbacks[i](1);
				unsubscribe(callbacks[i]);
			} else {
				callbacks[i]((time - callbacks[i].start) / callbacks[i].duration);	
			}
		}
		m.redraw(true);
		window.requestAnimationFrame(step);
	}
}

function createSubscribe(duration){
	return function subscribe(callback){
		var index = callbacks.length;
		callbacks.push(callback);
		callback.duration = duration || 1;
		if(index === 0) window.requestAnimationFrame(step);
	};
}

function unsubscribe(callback){
	var index = callbacks.indexOf(callback);
	if(index >= 0) callbacks.splice(index,1);
}

module.exports = function animate(duration){
	return Kefir.fromSubUnsub(createSubscribe(duration),unsubscribe);
};