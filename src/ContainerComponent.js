var mat4 = require('gl-matrix').mat4;
var inc = require('./inc');
var m = require('../lib/mithril');

function SurfaceController(){
	this.matrix = mat4.create();
	this.data = {
		id: '',
		element: '.supermove-surface',
		show: false,
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
	};
	this.style = "display: none;";
}

SurfaceController.prototype.set = function(d){
	for(var key in this.data){
		if(typeof d[key] !== 'undefined'){
			this.data[key] = d[key];
		}
	}
	if(d.element){
		this.data.element = d.element + '.supermove-surface';
	}
	this.setStyle();
};

SurfaceController.prototype.inc = function(d){
	inc(this.data,d);
	this.setStyle();
};


SurfaceController.prototype.setStyle = function(){
	if(this.data.show === false){
		this.style = "display: none;";
		return;
	}
	var m = this.matrix, d = this.data;
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

	mat4.identity(m);
	mat4.translate(m,m,[d.x,d.y,d.z]);
	if(d.rotateX) mat4.rotateX(m,m,d.rotateX);
	if(d.rotateY) mat4.rotateY(m,m,d.rotateY);
	if(d.rotateZ) mat4.rotateZ(m,m,d.rotateZ);

	mat4.scale(m,m,[d.scaleX,d.scaleY,d.scaleZ]);
	
	if(d.width){
		this.style += 'width: '+d.width+'; ';
	}
	if(d.height){
		this.style += 'height: '+d.height+'; ';
	}
	this.style += 'transform-origin: '+(d.originX * 100)+'% '+(d.originY * 100)+'% 0px; ';
	this.style += mat4.str(m).replace('mat4','transform: matrix3d')+'; ';
};

function SurfaceView(ctrl){
	var attr = ctrl.data.id?{'style': ctrl.style, id: ctrl.data.id, key: ctrl.data.id }:{'style': ctrl.style };
	return m(ctrl.data.element,attr,ctrl.data.content);
}

function ContainerIndex(id){
	var index = this._idToIndex[id], surflen = this.surfaces.length;
	if(typeof index === 'undefined') {
		index = 0;
		while(index < surflen && this.surfaces[index].data.show === true) index++;
		if(index === surflen) {
			this.surfaces.push(new SurfaceController());
		} else {
			var removedId = this.surfaces[index].data.id;
			this._idToIndex[removedId] = undefined;
		}
		this._idToIndex[id] = index;
	}
	return index;
}

function ContainerGet(id){
	var index = ContainerIndex.call(this,id);
	return this.surfaces[index].data;
}

function ContainerRender(data){
	index = ContainerIndex.call(this,data.id);
	this.surfaces[index].set(data);
}

function ContainerInc(data){
	index = ContainerIndex.call(this,data.id);
	this.surfaces[index].inc(data);
}

module.exports = m.component({
	controller: function ContainerController(api,n){
		n = n || 50;
		this.surfaces = new Array(n);
		this._idToIndex = {};
		for(var i = 0; i<n; i++){
			this.surfaces[i] = new SurfaceController();
		}
		api.render = ContainerRender.bind(this);
		api.inc = ContainerInc.bind(this);
		api.element = ContainerGet.bind(this);
	},
	view: function ContainerView(ctrl){
		return m('.supermove-container',ctrl.surfaces.map(SurfaceView));
	}
});