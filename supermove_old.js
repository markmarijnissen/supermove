/**
 *  Supermove is an observer who can subscribe/unsubscribe to observables (streams)
 *
 *  The stream should deliver a standard "element"
 *  which contains content + layout attributes
 * 
 */

/***************************************************************
			        Layout Component
****************************************************************/
function LayoutController(){
	this._matrix = mat4.create();
	//this._stream = null;
	// this.data = {
	// 	id: 0,
	// 	show: false,
	// 	size: [true,true],
	// 	origin: [0.5,0.5],
	// 	rotate: [0,0,0],
	// 	translate: [0,0,0],
	// 	//skew: [0,0,0],
	// 	scale: [1,1,1],
	// 	opacity: 1,
	// 	content: ''
	// };
	this.show = false;
	this.style = "display: none;";
	this.content = "";
	this.update = this.update.bind(this);
}

// LayoutController.prototype.subscribe = function LayoutSubscribe(stream){
// 	if(this._stream) this._stream.offValue(this.update);
// 	this.data.show = true;
// 	this._stream = stream;
// 	this._stream.onValue(this.update);
// };

// LayoutController.prototype.unsubscribe = function LayoutUnsubscribe(){
// 	if(this._stream) this._stream.offValue(this.update);
// 	this.data.show = false;
// 	this.update();
// };

LayoutController.prototype.update = function(d){
	this.show = d.show !== false;
	if(this.show === false){
		this.style = "display: none;";
		return;
	} 
	var m = this._matrix;
	var opacity = d.opacity || 0.99999;
	if(opacity >= 1) opacity = 0.99999;
	else if(opacity <= 0) opacity = 0.00001;
	this.style = "opacity: "+opacity+"; ";

	mat4.identity(m);
	if(d.translate) mat4.translate(m,m,d.translate);
	if(d.rotate){
		mat4.rotateX(m,m,d.rotate[0]);
		mat4.rotateY(m,m,d.rotate[1]);
		mat4.rotateZ(m,m,d.rotate[2]);
	}
	if(d.scale) mat4.scale(m,m,d.scale);
	if(d.size && d.size[0] !== true){
		this.style += 'width: '+d.size[0]+'px; ';
	}
	if(d.size && d.size[1] !== true){
		this.style += 'height: '+d.size[0]+'px; ';
	}
	if(d.origin) this.style += 'transform-origin: '+(d.origin[0] * 100)+'% '+(d.origin[1] * 100)+'% 50%; ';
	this.style += mat4.str(m).replace('mat4','transform: matrix3d')+'; ';
};

function LayoutView(ctrl){
	return m('.supermove-layout',{'style': ctrl.style},ctrl.data.content);
}


/***************************************************************
			      Container Compnent
****************************************************************/
function ContainerController(api,n){
	n = n || 50;
	this._layouts = new Array(n);
	this._idToIndex = {};
	for(var i = 0; i<n; i++){
		this._layouts[i] = new LayoutController();
	}
	// api.subscribe = ContainerSubscribe.bind(this);
	// api.unsubscribe = ContainerUnsubscribe.bind(this);
	api.update = ContainerUpdate.bind(this);
	//api.get = ContainerGet.bind(this);
}

function ContainerAdd(){
	var i = 0, len = this._layouts.length;
	while( i < len && this._layouts[i].show === true) i++;
	if(i === len) {
		this._layouts.push(new LayoutController());
	}
	return i;
}

// function ContainerSubscribe(stream){
// 	var i = ContainerAdd.call(this);
// 	this._layouts[i].subscribe(stream);
// 	return i;
// }

// function ContainerUnsubscribe(item){
// 	var i, len = this._layouts.length;
// 	if(typeof item === 'number'){
// 		i = item;	
// 	} else {
// 		i = 0;
// 		while( i < len && this._layouts[i]._stream !== item) i++;
// 	}
// 	if(i < len) this._layouts[i].unsubscribe();
// 	this._layouts[i].data.show = false;
// 	return i < len;
// }

function ContainerUpdate(datas){
	for(var data,j,i = 0, len = datas.length; i < len; i++){
		data = datas[i];
		j = this._idToIndex[data.id];
		if(typeof j === 'undefined') j = this._idToIndex[data.id] = ContainerAdd.call(this);
		this._layouts[j].update(data);
	}
}

// function ContainerGet(id){
// 	var i = this._idToIndex[id];
// 	if(typeof i === 'undefined') {
// 		i = this._idToIndex[id] = ContainerAdd.call(this);
// 		this._layouts[i].data.id = id;
// 	}
// 	return this._layouts[i].data;
// }

var ContainerComponent = m.component({
	controller: ContainerController,
	view: function(ctrl){
		return m('.supermove-container',ctrl._layouts.map(LayoutView));
	}
});

var Supermove = {};
Supermove.mount = function(el,n){
	var api = {};
	m.mount(el,ContainerComponent(api,n));
	return api;
};

// function defaultElement(el){
// 	return {
// 		id: el.id || 0,
// 		show: el.show !== false,
// 		size: el.size || [true,true],
// 		origin: el.origin || [0.5,0.5],
// 		rotate: el.rotate || [0,0,0],
// 		translate: el.translate || [0,0,0],
// 		//skew: [0,0,0],
// 		scale: el.scale || [1,1,1],
// 		opacity: el.opacity || 1,
// 		content: el.content || ''
// 	};
// };

/***************************************************************
			RequestAnimationFrame Stream
****************************************************************/
Supermove.animate = (function(){
	var callbacks = [];

	function step(time){
		var len = callbacks.length;
		if(len > 0){
			for(var i = 0; i < len; i++){
				if(!callbacks[i].start) {
					callbacks[i].start = time;
				} 
				if(callbacks[i].duration && time - callbacks[i].start > callbacks[i].duration){
					unsubscribe(callbacks[i]);
				} else {
					callbacks[i](time - callbacks[i].start);	
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
			callback.duration = duration || false;
			if(index === 0) window.requestAnimationFrame(step);
		};
	}

	function unsubscribe(callback){
		var index = callbacks.indexOf(callback);
		if(index >= 0) callbacks.splice(index,1);
	}

	return function animate(duration){
		return Kefir.fromSubUnsub(createSubscribe(duration),unsubscribe);
	};
})();



/*****************************************************/

var move = Supermove.mount(document.body,10);

var emitter = Kefir.emitter();
var element = emitter
	.flatMapLatest(function(duration){
		return Supermove.animate(duration);
	})
	.map(function(i){
		return [1,2,3].map(function(id){
			return {
				id:id,
				rotate: [0,(Math.round(i * 2) / 1000) % (2 * Math.PI),0],
				translate:[(Math.round(i * 200) / 1000) % 500,id * 50,(Math.round(i * 200) / 1000) % 500],
				content: 'Hello There!'
			};
		});
	})
	.onValue(move.update);


emitter.emit(1000);