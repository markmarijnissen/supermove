var mat4 = require('gl-matrix').mat4;
var m = require('../../lib/mithril');
var combine = require('./combine');

function notNull(item){
	return item !== null;
}

function getNumValue(val){		
	return val <= 1.0 && val >= 0.0? (val * 100)+'%': val+'px';
}

function getObjectValues(obj){
	return Object.keys(obj).map(function(key){
		return obj[key];
	});
}

function SurfaceController(){
	this.matrix = mat4.create();
	this.show = false;
	this.specs = {
		'default':{
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
		}
	};
	this.calculateStyle = this.calculateStyle.bind(this);
	this.calculateStyle();
}

SurfaceController.prototype.update = function SurfaceUpdate(spec){
	this.specs[spec.behavior || 'main'] = spec;
	this.calculateStyle();
};

SurfaceController.prototype.calculateStyle = function(){
	var spec = combine.apply(null,getObjectValues(this.specs));
	this.id = spec.id;				// Mithril View: key + id
	this.show  = spec.show; 		// For Container (to check if it's free)
									// Mithril View: Style Attribute
	this.element = spec.element;	// Mithril View: Virtual DOM element string
	this.content = spec.content;	// Mithril View: Virtual DOM children / content

	if(spec.show !== true){
		this.style = "display: none;";
		return;
	}
	if(spec.opacity >= 1) spec.opacity = 0.99999;
	else if(spec.opacity <= 0) spec.opacity = 0.00001; 
	// opacity is very low, otherwise Chrome will not render
	// which can unpredicted cause flickering / rendering lag
	// 
	// We're assuming you have good reason to draw the surface,
	// even when it's not visible.
	//  - i.e. fast access (at the cost of more memory)
	// 
	// If you want to cleanup the node, set `show` to false
	//  - i.e. slower acccess (at the cost of more free dom nodes and memory)
	this.style = "opacity: "+spec.opacity+"; ";

	var m = this.matrix;
	mat4.identity(m);
	mat4.translate(m,m,[spec.x,spec.y,spec.z]);
	if(spec.rotateX) mat4.rotateX(m,m,spec.rotateX);
	if(spec.rotateY) mat4.rotateY(m,m,spec.rotateY);
	if(spec.rotateZ) mat4.rotateZ(m,m,spec.rotateZ);
	mat4.scale(m,m,[spec.scaleX,spec.scaleY,spec.scaleZ]);
	
	if(spec.width){
		this.style += 'width: '+getNumValue(spec.width)+'; ';
	}
	if(spec.height){
		this.style += 'height: '+getNumValue(spec.height)+'; ';
	}
	this.style += 'transform-origin: '+getNumValue(spec.originX)+' '+getNumValue(spec.originY)+'% 0px; ';
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
		while(index < surflen && this.surfaces[index].show === true) index++;
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

function ContainerUpdate(value){
	var index = ContainerIndex.call(this,value.id);
	this.surfaces[index].update(value);
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
		api.render = ContainerUpdate.bind(this);
	},
	view: function ContainerView(ctrl){
		return m('.supermove-container',ctrl.surfaces.map(SurfaceView));
	}
});