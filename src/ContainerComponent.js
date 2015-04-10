var mat4 = require('gl-matrix').mat4;
var m = require('../lib/mithril');
var combine = require('./combine');

function SurfaceController(){
	this.matrix = mat4.create();
	this.active = false;
	this.specs = [{
		element: '.supermove-surface',
		width: 0,
		height: 0,
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		x: 0,
		y: 0,
		z: 0,
		originX: 0.5,
		originY: 0.5,
		scaleX: 1,
		scaleY: 1,
		scaleZ: 1,
		opacity: 1,
		content: ''
	}];
	this.update = this.update.bind(this);
	this.update();
	this.callbacks = [null];
}

SurfaceController.prototype.subscribe = function SurfaceSubscribe(stream){
	var index = this.callbacks.length, specs = this.specs, update = this.update;
	var callback = function(spec){
		specs[index] = spec;
		update();
	};
	this.callbacks.push(callback);
	this.specs.push(null);
	this.active = true;
	stream.onValue(callback);
	return stream;
};

function notNull(item){
	return item !== null;
}

SurfaceController.prototype.unsubscribe = function SurfaceUnsubscribe(stream){
	var index = this.callbacks.indexOf(stream);
	if(index >= 0){
		stream.offValue(this.callbacks[index]);
		this.callbacks[index] = null;
		this.specs[index] = null;
		this.active = this.callbacks.filter(notNull).length > 0;
		this.update();
		return true;
	}
	return false;
};

function getNumValue(val){		
	return val <= 1.0 && val >= 0.0? (val * 100)+'%': val+'px';
}

SurfaceController.prototype.update = function(){
	var d = combine.apply(null,this.specs);
	this.id = d.id;				// Mithril View: key + id
								// Mithril View: Style Attribute
	this.element = d.element;	// Mithril View: Virtual DOM element string
	this.content = d.content;	// Mithril View: Virtual DOM children / content

	if(d.show !== true){
		this.style = "display: none;";
		return;
	}
	if(d.opacity >= 1) d.opacity = 0.99999;
	else if(d.opacity <= 0) d.opacity = 0.00001; 
	// opacity is very low, otherwise Chrome will not render
	// which can unpredicted cause flickering / rendering lag
	// 
	// We're assuming you have good reason to draw the surface,
	// even when it's not visible.
	//  - i.e. fast access (at the cost of more memory)
	// 
	// If you want to cleanup the node, set `show` to false
	//  - i.e. slower acccess (at the cost of more free dom nodes and memory)
	this.style = "opacity: "+d.opacity+"; ";

	var m = this.matrix;
	mat4.identity(m);
	mat4.translate(m,m,[d.x,d.y,d.z]);
	if(d.rotateX) mat4.rotateX(m,m,d.rotateX);
	if(d.rotateY) mat4.rotateY(m,m,d.rotateY);
	if(d.rotateZ) mat4.rotateZ(m,m,d.rotateZ);
	mat4.scale(m,m,[d.scaleX,d.scaleY,d.scaleZ]);
	
	if(d.width){
		this.style += 'width: '+getNumValue(d.width)+'; ';
	}
	if(d.height){
		this.style += 'height: '+getNumValue(d.height)+'; ';
	}
	this.style += 'transform-origin: '+getNumValue(d.originX)+' '+getNumValue(d.originY)+'% 0px; ';
	this.style += mat4.str(m).replace('mat4','transform: matrix3d')+'; ';
};

function SurfaceView(ctrl){
	var attr = ctrl.id?{'style': ctrl.style, id: ctrl.id, key: ctrl.id }:{'style': ctrl.style };
	return m(ctrl.element,attr,ctrl.content);
}

function ContainerIndex(id){
	var index = this._idToIndex[id], surflen = this.surfaces.length;
	if(typeof index === 'undefined') {
		index = 0;
		while(index < surflen && this.surfaces[index].active === true) index++;
		if(index === surflen) {
			this.surfaces.push(new SurfaceController());
		} else {
			var removedId = this.surfaces[index].id;
			this._idToIndex[removedId] = undefined;
		}
		this._idToIndex[id] = index;
	}
	return index;
}

function ContainerSpec(id){
	var index = ContainerIndex.call(this,id);
	return combine.apply(null,this.surfaces[index].specs);
}

function ContainerSubscribe(id,stream){
	var index = ContainerIndex.call(this,id);
	stream = stream.filter(function(data){
		return data.id === id;
	});
	this.surfaces[index].subscribe(stream);
	return stream;
}

function ContainerUnsubscribe(id,stream){
	var index = ContainerIndex.call(this,id);
	return this.surfaces[index].unsubscribe(stream);
}


module.exports = m.component({
	controller: function ContainerController(api,n){
		n = n || 50;
		this.surfaces = new Array(n);
		this._idToIndex = {};
		for(var i = 0; i<n; i++){
			this.surfaces[i] = new SurfaceController();
		}
		api.element = ContainerSpec.bind(this);
		api.subscribe = ContainerSubscribe.bind(this);
		api.unsubscribe = ContainerUnsubscribe.bind(this);
	},
	view: function ContainerView(ctrl){
		return m('.supermove-container',ctrl.surfaces.map(SurfaceView));
	}
});