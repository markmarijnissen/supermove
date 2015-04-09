var mat4 = require('gl-matrix').mat4;
var m = require('../lib/mithril');

function SurfaceController(){
	this.matrix = mat4.create();
	this.data = {
		id: '',
		show: false,
		width: 0,
		height: 0,
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		x: 0,
		y: 0,
		z: 0,
		origin: [0.5, 0.5],
		scale: [1,1,1],
		opacity: 1,
		content: ''
	};
	this.style = "display: none;";
	this.update = this.update.bind(this);
}

SurfaceController.prototype.update = function(d){
	for(var key in this.data){
		if(typeof d[key] !== 'undefined'){
			this.data[key] = d[key];
		}
	}
	if(this.data.show === false){
		this.style = "display: none;";
		return;
	}
	d = this.data;
	var m = this.matrix;
	if(d.opacity >= 1) d.opacity = 0.99999;
	else if(d.opacity <= 0) d.opacity = 0.00001;
	this.style = "opacity: "+d.opacity+"; ";

	mat4.identity(m);
	mat4.translate(m,m,[d.x,d.y,d.z]);
	if(d.rotateX) mat4.rotateX(m,m,d.rotateX);
	if(d.rotateY) mat4.rotateY(m,m,d.rotateY);
	if(d.rotateZ) mat4.rotateZ(m,m,d.rotateZ);

	mat4.scale(m,m,d.scale);
	
	if(d.width){
		this.style += 'width: '+width+'; ';
	}
	if(d.height){
		this.style += 'height: '+height+'; ';
	}
	this.style += 'transform-origin: '+(d.origin[0] * 100)+'% '+(d.origin[1] * 100)+'% 0px; ';
	this.style += mat4.str(m).replace('mat4','transform: matrix3d')+'; ';
};

function SurfaceView(ctrl){
	return m('.supermove-surface',{'style': ctrl.style, id: ctrl.data.id, key: ctrl.data.id },ctrl.data.content);
}


function ContainerUpdate(datas){
	for(var data,j,i = 0, datalen = datas.length,surflen = this.surfaces.length; i < datalen; i++){
		data = datas[i];
		j = this._idToIndex[data.id];
		if(typeof j === 'undefined') {
			j = 0;
			while(j < surflen && this.surfaces[j].data.show === true) j++;
			if(j === surflen) {
				this.surfaces.push(new SurfaceController());
			}
			this._idToIndex[data.id] = j;
		}
		this.surfaces[j].update(data);
	}
}

module.exports = m.component({
	controller: function ContainerController(api,n){
		n = n || 50;
		this.surfaces = new Array(n);
		this._idToIndex = {};
		for(var i = 0; i<n; i++){
			this.surfaces[i] = new SurfaceController();
		}
		api.update = ContainerUpdate.bind(this);
	},
	view: function ContainerView(ctrl){
		return m('.supermove-container',ctrl.surfaces.map(SurfaceView));
	}
});