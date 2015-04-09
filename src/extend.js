function extend(x,y){
	var first,str;
	yType = typeof y;
	xType = typeof x;

	if(xType === 'undefined'){
		x = y;
	} else if(yType === 'number'){
		x = y;
	} else if(yType === 'string'){
		first = y[0];
		if(first === '-') {
			if(xType === 'string') {
				x = x.split(y.substr(1)).join('');
			} else {
				x -= parseFloat(y.substr(1));
			}
		} else if(first === '+'){
			if(xType === 'string'){
				x += y.substr(1);
			} else {
				x += parseFloat(y.substr(1));
			}
		} else if(first === '*'){
			if(xType === 'string'){
				str = y.substr(1);
				if(x.indexOf(str) < 0){
					x += str;
				}
			} else {
				x *= parseFloat(y.substr(1));
			}
		} else {
			x = y;
		}
	} else if(Array.isArray(y)) {
		if(Array.isArray(x) && x.length === y.length){
			for(var i = 0, len = x.length; i < len; i++){
				x[i] = extend(x[i],y[i]);
			}
		} else {
			if(!Array.isArray(x)) x = [x];
			x = x.concat(y);
		}
	} else if(yType === 'object') {
		for(var key in y){
			x[key] = extend(x[key],y[key]);
		}
	} else {
		x = y;
	}
	return x;
}

module.exports = extend;