var DomDelegate = require('dom-delegate').Delegate;
var Kefir = require('kefir');

function subscribe(eventType,handler,useCapture,callback){
	this.on(eventType,handler,callback,useCapture);
}

function unsubscribe(eventType,handler,useCapture,callback){
	this.off(eventType,handler,callback,useCapture);
}

function createDomEventStream(eventType,handler,useCapture){
	return Kefir.fromSubUnsub(
		subscribe.bind(this,eventType,handler,useCapture),
		unsubscribe.bind(this,eventType,handler,useCapture)
	);
}

module.exports = function DomEventStream(el){
	var delegate = new DomDelegate(el);
	return createDomEventStream.bind(delegate);
};