module.exports = function combine(){
	var key,srcVal,destVal,srcType,
		dest = {}, 
		sources = Array.prototype.slice.call(arguments,0);
	for(var i = 0, len = sources.length; i < len; i++){
		if(sources[i] === null) continue;
		for(key in sources[i]){
			srcVal = sources[i][key];
			srcType = typeof srcVal;
			if(key === 'id'){
				if(typeof dest[key] !== 'undefined' && dest[key] !== srcVal){
					throw new Error('merging specs with different IDs! ('+dest[key]+' != '+srcVal+')');
				}
				dest[key] = srcVal;
			} else if(srcType === 'number'){
				dest[key] = (dest[key] || 0) + srcVal;
			} else if(srcType === 'string'){
				dest[key] = dest[key] || '';
				if(key !== 'element' || dest[key].indexOf(srcVal) < 0){
					dest[key] += srcVal;
				}
			} else if(srcType === 'boolean'){  // only one SHOW needs to be true?
				dest[key] = dest[key] || srcVal;
			} else if(Array.isArray(srcVal)){
				destVal = dest[key];
				if(typeof destVal === 'undefined') {
					destVal = [];
				} else if(!Array.isArray(destVal)){
					destVal = [destVal];
				}
				dest[key] = destVal.concat(srcVal);
			}
		}
	}
	return dest;
}