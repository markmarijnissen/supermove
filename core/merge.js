/**
 * merge multiple layout-specification into one.
 */
module.exports = function merge(){
		// tmp vars for key,value,types of source and dest objects.
	var key,srcVal,destVal,srcType,destType,
		// destination is a fresh object
		dest = {}, 
		// merge all arguments
		sources = Array.prototype.slice.call(arguments,0);
	
	// loop over all layout-specs (arguments)
	for(var i = 0, len = sources.length; i < len; i++){
		if(sources[i] === null) continue;
		
		// loop over all keys (attributes)
		for(key in sources[i]){
			// init values
			srcVal = sources[i][key];
			srcType = typeof srcVal;
			destVal = dest[key];
			destType = typeof destVal;

			// merge-strategy is based on the key
			switch(key){
				// 'id' should be the same, otherwise error
				case 'id':
					if(destType !== 'undefined' && destVal !== srcVal){
						throw new Error('merging specs with different IDs! ('+destVal+' != '+srcVal+')');
					}
					dest[key] = srcVal;
					break;
				// 'parent' should be the same, otherwise error
				case 'parent':
					if(destType !== 'undefined' && destVal !== srcVal){
						throw new Error('merging specs with different parents! ('+destVal+' != '+srcVal+')');
					}
					dest[key] = srcVal;
					break;
				// 'element' is added once (i.e. add class only once)
				case 'element':
					if(!destVal || destVal.indexOf(srcVal) < 0){
						dest[key] = (destVal || '') + srcVal;
					}
					break;
				// 'opacity' is multiplied
				case 'opacity':
					dest[key] = (destVal || 1) * srcVal;
					break;

				// width/height is multiplied (%) or added (px)
				case 'width':
				case 'height':
					if(SUPERMOVE_DEVELOPMENT){
						if(srcType !== 'number'){
							console.error('[dev] '+key+' is not a number!');
						}
					}
					// * for percentages (value is 0..1)
					if(srcVal <= 1.0 && srcVal >= 0.0) {
						dest[key] = (destVal || 1) * srcVal;
					// + for pixels
					} else {
						dest[key] = (destVal || 0) + srcVal;
					}
					break;

				case 'content':
					if(destType === 'undefined'){
						destVal = [];
					} else if(!Array.isArray(destVal)){
						destVal = [destVal];
					}
					if(!Array.isArray(srcVal)){
						srcVal = [srcVal];
					}
					dest[key] = destVal.concat(srcVal);
					break;
				// for all other keys
				default:
					// + for numbers
					if(srcType === 'number'){
						dest[key] = (destVal || 0) + srcVal;
					
					// concat for strings
					} else if(srcType === 'string'){
						dest[key] = (destVal || '') + srcVal;

					// && on booleans
					} else if(srcType === 'boolean'){  
						dest[key] = destType === 'boolean'? destVal && srcVal: srcVal;
					
					// concat on arrays / other stuff
					} else {
						if(destType === 'undefined') {
							destVal = [];
						} else if(!Array.isArray(destVal)){
							destVal = [destVal];
						}
						dest[key] = destVal.concat(srcVal);
					}
					// objects and others are not supported...
			}
		}
	}
	return dest;
};