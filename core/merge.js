module.exports = function merge(){
	var key,srcVal,destVal,srcType,
		dest = {}, 
		sources = Array.prototype.slice.call(arguments,0);
	
	for(var i = 0, len = sources.length; i < len; i++){
		if(sources[i] === null) continue;
		for(key in sources[i]){
			srcVal = sources[i][key];
			srcType = typeof srcVal;
			destVal = dest[key];
			destType = typeof destVal;
			switch(key){
				case 'id':
					if(destType !== 'undefined' && destVal !== srcVal){
						throw new Error('merging specs with different IDs! ('+destVal+' != '+srcVal+')');
					}
					dest[key] = srcVal;
					break;
				case 'element':
					if(!destVal || destVal.indexOf(srcVal) < 0){
						dest[key] = (destVal || '') + srcVal;
					}
					break;
				case 'opacity':
					dest[key] = (destVal || 1) * srcVal;
					break;
				case 'width':
				case 'height':
					if(SUPERMOVE_DEVELOPMENT){
						if(srcType !== 'number'){
							console.error('[dev] '+key+' is not a number!');
						}
					}
					// multiply a percentages
					if(srcVal <= 1.0 && srcVal >= 0.0) {
						dest[key] = (destVal || 1) * srcVal;
					// + on pixels
					} else {
						dest[key] = (destVal || 0) + srcVal;
					}
					break;
				default:
					// + on numbers
					if(srcType === 'number'){
						dest[key] = (destVal || 0) + srcVal;
					
					// append (if not included) on strings
					} else if(srcType === 'string'){
						dest[key] = (destVal || '') + srcVal;

					// && on booleans
					} else if(srcType === 'boolean'){  
						dest[key] = destType === 'boolean'? destVal && srcVal: srcVal;
					
					// Append to Arrays
					} else if(Array.isArray(srcVal)){
						if(destType === 'undefined') {
							destVal = [];
						} else if(!Array.isArray(destVal)){
							destVal = [destVal];
						}
						dest[key] = destVal.concat(srcVal);
					}
			}
		}
	}
	return dest;
};