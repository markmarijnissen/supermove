// object to array (to work with merge)
module.exports = function getObjectValues(obj){
	return Object.keys(obj).map(function(key){
		return obj[key];
	});
};