var mat4 = require('./mat4');
var merge = require('./merge');
var m = require('mithril');

/**
 * Every surface has an unique ID
 * A parent is a special surface, also has an unique ID
 *
 * - When updating specs, we need to find Surface corresponding to ID.
 * - When rendering, we need to find IDs that belong to surface
 * 
 * @type {Object}
 */
var SURFACES = [];
var ID_TO_INDEX = {};

/**
 * Convert Surface ID to an index in the Container.
 *
 * If Surface ID does not exist, it will fetch a
 * cached Surface. If there are no cached surfaces, 
 * it will create a new one.
 */
function SurfaceIndex(id){
	var index = ID_TO_INDEX[id];
	if(typeof index === 'undefined') {
		index = SURFACES.length;
		new SurfaceController({id:id});
	}
	return index;
}

/**
 * Return merged spec of a Surface.
 * Create Surface if ID does not have an index yet.
 */
function SurfaceSpec(id){
	var index = SurfaceIndex(id);
	return merge.apply(null,getObjectValues(SURFACES[index].specs));
}

/**
 * Update specification of a Surface
 * Create Surface if ID does not have an index yet.
 */
function SurfaceUpdate(value){
	var index = SurfaceIndex(value.id);
	SURFACES[index].update(value);
}


// for width and height
// we assume [0...1] are percentages
// while all other value are pixels
function getNumValue(val){		
	return val <= 1.0 && val >= 0.0? (val * 100)+'%': val+'px';
}

// object to array (to work with merge)
function getObjectValues(obj){
	return Object.keys(obj).map(function(key){
		return obj[key];
	});
}

/**
 * Mithril SurfaceController
 *
 * Keeps state of a single element.
 *
 * input: 
 * 		this.specs: mapping from behavior => spec
 *
 * output:
 * 		id:    	 element id + Mithril key
 * 		show: 	 Visibility of element. When not shown, can be recycled by Container.
 * 		element: Mithril Virtual DOM element string
 * 		content: Mithril Virtual DOM content
 *
 * A Surface listens to multiple specs.
 *
 * Every spec is called an "behavior".
 * All behaviors are merged into a single spec.
 * (See merge.js for how merging logic)
 *
 * public api:
 * 		.render(spec)
 */
function SurfaceController(options){
	options = options || {};
	this.matrix = mat4.create();
	this.specs = {
		'default':{
			id: options.id,
			show: options.show,
			parent: options.parent,
			element: options.element || '.supermove-surface',
			width: options.width || 0,
			height: options.height || 0,
			rotateX: options.rotateX || 0,
			rotateY: options.rotateY || 0,
			rotateZ: options.rotateZ || 0,
			x: options.x || 0,
			y: options.y || 0,
			z: options.z || 0,
			originX: options.originX || 0.5,
			originY: options.originY || 0.5,
			scaleX: options.scaleX || 1,
			scaleY: options.scaleY || 1,
			scaleZ: options.scaleZ || 1,
			opacity: options.opacity || 1,
			content: options.content
		}
	};
	
	this.spec = {};
	this.attr = {};
	
	// global register
	ID_TO_INDEX[options.id] = SURFACES.length;
	SURFACES.push(this);
	
	this.update();
}

SurfaceController.prototype.update = function SurfaceUpdate(spec){
	if(typeof spec === 'object') this.specs[spec.behavior || 'main'] = spec;

	// merge specs into final spec.
	this.spec = spec = merge.apply(null,getObjectValues(this.specs));

	// update state
	if(spec.id){
		this.attr.id = spec.id;
		this.attr.key = spec.id;
	} else {
		delete this.attr.id;
		delete this.attr.key;
	}

	// display: none if invisible
	if(spec.show !== true){
		this.attr.style = "display: none;";
		return;
	}

	// otherwise: calculate style
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
	this.attr.style = "opacity: "+spec.opacity+"; ";

	// matrix3d transform
	var m = this.matrix;
	mat4.identity(m);
	mat4.translate(m,m,[spec.x,spec.y,spec.z]);
	if(spec.rotateX) mat4.rotateX(m,m,spec.rotateX);
	if(spec.rotateY) mat4.rotateY(m,m,spec.rotateY);
	if(spec.rotateZ) mat4.rotateZ(m,m,spec.rotateZ);
	mat4.scale(m,m,[spec.scaleX,spec.scaleY,spec.scaleZ]);
	this.attr.style += mat4.str(m).replace('mat4','transform: matrix3d')+'; ';
	
	// matrix3d transform origin
	this.attr.style += 'transform-origin: '+getNumValue(spec.originX)+' '+getNumValue(spec.originY)+' 0px; ';
	
	// width and height
	if(spec.width){
		this.attr.style += 'width: '+getNumValue(spec.width)+'; ';
	}
	if(spec.height){
		this.attr.style += 'height: '+getNumValue(spec.height)+'; ';
	}
};

/**
 * Mithril View to render a Surface
 */
function SurfaceView(ctrl){
	var content = (ctrl.spec.content || []).concat(SURFACES.filter(function(surface){
		    return surface.spec.id !== ctrl.attr.id && (surface.spec.parent || 'root') === ctrl.attr.id;
		}).map(SurfaceView));
	
	return m(ctrl.spec.element,ctrl.attr,content);
}

module.exports = window.Surface = {
	spec: SurfaceSpec,
	update: SurfaceUpdate,
	controller: SurfaceController,
	view: SurfaceView
};