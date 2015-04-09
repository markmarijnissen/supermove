var mat4 = require('gl-matrix').mat4;
var extend = require('./extend');
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
		content: '',
		modifiers: {}
	};
	this.style = "display: none;";
}

SurfaceController.prototype.set = function(d){
	//this.data = extend(this.data,d);
	for(var key in d){
		this.data[key] = d[key];
	}
	this.setStyle();
};

function getNum(data,key){
	var val = data[key];
	for(var i in data.modifiers){
		val += data.modifiers[i][key] || 0;
	}
	return val;
}

function getStr(data,key){
	var val = data[key];
	for(var i in data.modifiers){
		val += data.modifiers[i][key] || '';
	}
	return val;
}

function getAnd(data,key){
	var val = data[key];
	for(var i in data.modifiers){
		val = val && data.modifiers[i][key];
	}
	return val;
}

SurfaceController.prototype.setStyle = function(){
	var m = this.matrix, d = this.data;
	if(getAnd(d,'show') === false){
		this.style = "display: none;";
		return;
	}
	var opacity = getNum(d,'opacity');
	if(opacity >= 1) opacity = 0.99999;
	else if(d.opacity <= 0) opacity = 0.00001; 
	// opacity is very low, otherwise Chrome will not render
	// which can unpredicted cause flickering / rendering lag
	// 
	// We're assuming you have good reason to draw the surface,
	// even when it's not visible.
	//  - i.e. fast access (at the cost of more memory)
	// 
	// If you want to cleanup the node, set `show` to false
	//  - i.e. slower acccess (at the cost of more free dom nodes and memory)
	this.style = "opacity: "+opacity+"; ";

	mat4.identity(m);
	mat4.translate(m,m,[getNum(d,'x'),getNum(d,'y'),getNum(d,'z')]);
	if(d.rotateX) mat4.rotateX(m,m,getNum(d,'rotateX'));
	if(d.rotateY) mat4.rotateY(m,m,getNum(d,'rotateY'));
	if(d.rotateZ) mat4.rotateZ(m,m,getNum(d,'rotateZ'));

	mat4.scale(m,m,[getNum(d,'scaleX'),getNum(d,'scaleY'),getNum(d,'scaleZ')]);
	
	if(d.width){
		this.style += 'width: '+d.width+'; ';
	}
	if(d.height){
		this.style += 'height: '+d.height+'; ';
	}
	this.style += 'transform-origin: '+(getNum(d,'originX') * 100)+'% '+(getNum(d,'originY') * 100)+'% 0px; ';
	this.style += mat4.str(m).replace('mat4','transform: matrix3d')+'; ';
};

function SurfaceView(ctrl){
	var attr = ctrl.data.id?{'style': ctrl.style, id: ctrl.data.id, key: ctrl.data.id }:{'style': ctrl.style, key: ctrl.data.id };
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
	var index = ContainerIndex.call(this,data.id);
	this.surfaces[index].set(data);
}

function CreateContainerModify(modifier){
	return function ContainerModify(data){
		var index = ContainerIndex.call(this,data.id);
		this.surfaces[index].data.modifiers[modifier] = data;
	}.bind(this);
}

// function ContainerInc(data){
// 	index = ContainerIndex.call(this,data.id);
// 	this.surfaces[index].inc(data);
// }

module.exports = m.component({
	controller: function ContainerController(api,n){
		n = n || 50;
		this.surfaces = new Array(n);
		this._idToIndex = {};
		for(var i = 0; i<n; i++){
			this.surfaces[i] = new SurfaceController();
		}
		api.render = ContainerRender.bind(this);
		//api.inc = ContainerInc.bind(this);
		api.modify = CreateContainerModify.bind(this);
		api.element = ContainerGet.bind(this);
	},
	view: function ContainerView(ctrl){
		return m('.supermove-container',ctrl.surfaces.map(SurfaceView));
	}
});