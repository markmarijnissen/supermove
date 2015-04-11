module.exports = function tween(start,end,time){
	if(typeof time === 'undefined') {
		return tween.bind(null,start,end);
	} else if(typeof start === 'object'){
		var data = {};
		for(var key in start){
			data[key] = tween(start[key],end[key],time);
		}
		return data;
	} else if(typeof start === 'number'){
		return start + (end - start) * time;
	} else {
		return start || end;
	}
};
