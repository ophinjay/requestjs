module.exports = {
	assign: function (target) {
		var srcs = Array.prototype.slice.call(arguments, 1);
		for(var i = 0; i < srcs.length; i++) {
			for(var j in srcs[i]) {
				target[j] = srcs[i][j];
			}
		}
		return target;
	}
};