var ContainerComponent = require('./ContainerComponent');
var DomDelegate = require('dom-delegate').Delegate;
var m = require('../lib/mithril');
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

module.exports = function mount(el,n){
	var delegate = new DomDelegate(el);
	var api = {
		stream: createDomEventStream.bind(delegate)
	};
	m.mount(el,ContainerComponent(api,n));
	return api;
};
