// set common constants
window.GLMAT_EPSILON = 0.000001;
window.GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

// import actual lib
var mat4 = require('gl-matrix/src/gl-matrix/mat4').mat4;

// add method for style output
mat4.style = function (a) {
    return 'transform: matrix3d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + '); ';
};

module.exports = mat4;