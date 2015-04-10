module.exports = function inc(data){
	var incs = Array.prototype.slice.call(arguments,1);
	var first,type,val,key,i,incslen = incs.length;
	if(incslen === 0) return inc.bind(null,data);

	for(i = 0; i<incslen; i++){
		for(key in incs[i]){
			val = incs[i][key];
			type = typeof val;
			if(type === 'number' && key !== 'id') {
				data[key] = (data[key] || 0) + val; 
			} else switch(key){
				case 'content':
				case 'element':
					data.content = val;
					break;
				case 'insert':
					if(!Array.isArray(data.content)){
						data.content = [data.content];
					}
					if(!Array.isArray(val)){
						val = [val];
					}
					data.content = data.content.concat(val);
					break;
				case 'addClass':
					if(data.element.indexOf(val) < 0) {
						data.element = (data.element || '') + '.'+val;
					}
					break;	
				case 'removeClass':
					if(data.element)
						data.element = data.element.split('.'+val).join('');
					break;
				case 'show':
					if(val === false){
						data.show = false;
					}
					break;
			}
		}
	}
	
	return data;
};