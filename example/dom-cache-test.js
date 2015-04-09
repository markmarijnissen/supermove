for(var i = 0; i<200; i++) {
	(function(){
	var r = Math.random(); 
	setTimeout(function(){
		move.render({
			id: 'parent' +r,
			show:true,
			element: '.text',
			content: 'test' + r,
			x: window.innerWidth * r,
			y: window.innerHeight * Math.random(),
			width: '100px',
			height: '50px'
		});
		m.redraw();
	},i * 100);
	setTimeout(function(){
		move.render({id:'parent'+r,show:false});
		m.redraw();
	},50 * 100 + i * 100);
})();
}

// copy-pase into the console
// 
// this will render 200 nodes for a while,
// however only 50 are visible
// 
// i.e. the dom-cache should grow to 50
// then nodes should be re-used
// 
// bug: empty surfaces that are never used?