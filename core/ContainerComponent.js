var Surface = require('./SurfaceComponent');
var m = require('../lib/mithril');

/**
 * Convert Surface ID to an index in the Container.
 *
 * If Surface ID does not exist, it will fetch a
 * cached Surface. If there are no cached surfaces, 
 * it will create a new one.
 */
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

/**
 * Return merged spec of a Surface.
 * Create Surface if ID does not have an index yet.
 */
function ContainerSpec(id){
	var index = ContainerIndex.call(this,id);
	return merge.apply(null,getObjectValues(this.surfaces[index].specs));
}

/**
 * Update specification of a Surface
 * Create Surface if ID does not have an index yet.
 */
function ContainerUpdate(value){
	var index = ContainerIndex.call(this,value.id);
	this.surfaces[index].update(value);
}

/**
 * Mithril ContainerComponent
 *
 * A Virtual DOM Container to manage Surfaces.
 *
 * The ContainerComponent keeps a cache of DOM Nodes.
 * Every surface ID is mapped to an index in the DOM Cache.
 * If a Surface is invisible (i.e. show = false), it can
 * be reused by a new surface.
 *
 * Public API:
 *  .spec(id) --> return Surface spec for an ID
 *  .render(spec) --> update Surface spec
 */
module.exports = m.component({
	controller: function ContainerController(api,options){
		var n = options.cache || 20;
		this.surfaces = new Array(n);
		this._idToIndex = {};
		for(var i = 0; i<n; i++){
			this.surfaces[i] = new Surface.controller();
		}
		api.spec = ContainerSpec.bind(this);
		api.render = ContainerUpdate.bind(this);
	},
	view: function ContainerView(ctrl){
		return m('.supermove-container',ctrl.surfaces.map(Surface.view));
	}
});