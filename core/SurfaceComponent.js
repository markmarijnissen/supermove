var mat4 = require('./mat4');
var merge = require('./merge');

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
function SurfaceController(){
	this.matrix = mat4.create();
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

	this.show = false;
	this.content = '';
	this.element = '.supermove-surface';
}

SurfaceController.prototype.update = function SurfaceUpdate(spec){
	this.specs[spec.behavior || 'main'] = spec;
	this.calculateStyle();
};

SurfaceController.prototype.calculateStyle = function(){
	// merge specs into final spec.
	var spec = merge.apply(null,getObjectValues(this.specs));
	
	// update state
	this.id = spec.id;				// Mithril View: key + id
	this.show  = spec.show; 		// For Container (to check if it's free)
	//this.style = .... 			// Mithril View: Style Attribute
	this.element = spec.element;	// Mithril View: Virtual DOM element string
	this.content = spec.content;	// Mithril View: Virtual DOM children / content

	// display: none if invisible
	if(spec.show !== true){
		this.style = "display: none;";
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
	this.style = "opacity: "+spec.opacity+"; ";

	// matrix3d transform
	var m = this.matrix;
	mat4.identity(m);
	mat4.translate(m,m,[spec.x,spec.y,spec.z]);
	if(spec.rotateX) mat4.rotateX(m,m,spec.rotateX);
	if(spec.rotateY) mat4.rotateY(m,m,spec.rotateY);
	if(spec.rotateZ) mat4.rotateZ(m,m,spec.rotateZ);
	mat4.scale(m,m,[spec.scaleX,spec.scaleY,spec.scaleZ]);
	this.style += mat4.str(m).replace('mat4','transform: matrix3d')+'; ';
	
	// matrix3d transform origin
	this.style += 'transform-origin: '+getNumValue(spec.originX)+' '+getNumValue(spec.originY)+'% 0px; ';
	
	// width and height
	if(spec.width){
		this.style += 'width: '+getNumValue(spec.width)+'; ';
	}
	if(spec.height){
		this.style += 'height: '+getNumValue(spec.height)+'; ';
	}
};

/**
 * Mithril View to render a Surface
 *
 * Needs:
 * 	ctrl.id -- element ID and Mithril key (optional)
 * 	ctrl.element -- element string
 * 	ctrl.style -- style as calculated by .calculateStyle() from all specs.
 * 	ctrl.content -- virtual dom content.
 */
function SurfaceView(ctrl){
	var attr = ctrl.id?{'style': ctrl.style, id: ctrl.id, key: ctrl.id }:{'style': ctrl.style };
	return m(ctrl.element,attr,ctrl.content);
}

module.exports = {
	controller: SurfaceController,
	view: SurfaceView
};