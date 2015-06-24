/*
*  Predefined filter effects with names for Filterous.js
*
*  Last modified: March 1, 2014
*/

// Prepare image-layer effects

// Define named effects

var ApplyEffects = {
	reset : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.reset();
		console.log('reset');
		callback();
	},
	fluor : function(img, format, callback) {
		// Warm, saturated tones with an emphasis on yellow
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1, 1.2, 1.4]);
		f.filterImage('brightness', 10);
		f.render();
		console.log('fluorescent');
		callback();
	},
	nostalgia : function(img, format, callback) {
		// Slightly blurred, with sepia tone
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.4, 1.2, 1]);
		f.render();
		console.log('nostalgia');
		callback();
	},
	phykos : function(img, format, callback) {
		// Slightly blurred, with yellow and green saturated
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1, 1.1, 1.1]);
		f.render();
		console.log('phykos');
		callback();
	},
	lotus : function(img, format, callback) {
		// Sepia-like, with an emphasis on purples and browns
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.4, 1.15, 1.1]);
		f.render();
		console.log('lotus');
		callback();
	},
	memphis : function(img, format, callback) {
		// Sharp images with a magenta-meets-purple tint
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.2, 1, 1.1]);
		f.filterImage('convolute', [0, -1, 0, -1, 5, -1, 0, -1, 0]);
		f.render();
		console.log('memphis');
		callback();
	},
	deutlich : function(img, format, callback) {
		// High exposure
		var f = new Filterous(img, format);
		f.filterImage('convolute', [0, 0, 0, 0, 1.3, 0, 0, 0, 0]);
		f.render();
		console.log('deutlich');
		callback();
	},
	sumie : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage('grayscale');
		f.render();
		console.log('sumie');
		callback();
	},
	filter0 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.28, 1.34, 1.10]);
		f.filterImage("brightness", 4);
		f.render();
		console.log("filter0");
		callback();
	},
	filter1 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.25, 1.34, 1.36]);
		f.filterImage("brightness", 2);
		f.render();
		console.log("filter1");
		callback();
	},
	filter2 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.22, 1.45, 1.33]);
		f.filterImage("brightness", 4);
		f.render();
		console.log("filter2");
		callback();
	},
	filter3 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.12, 1.01, 1.33]);
		f.filterImage("brightness", 1);
		f.render();
		console.log("filter3");
		callback();
	},
	filter4 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.24, 1.24, 1.26]);
		f.filterImage("brightness", 4);
		f.render();
		console.log("filter4");
		callback();
	},
	filter5 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.16, 1.22, 1.02]);
		f.filterImage("brightness", 1);
		f.render();
		console.log("filter5");
		callback();
	},
	filter6 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.26, 1.10, 1.22]);
		f.filterImage("brightness", 5);
		f.render();
		console.log("filter6");
		callback();
	},
	filter7 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.11, 1.24, 1.37]);
		f.filterImage("brightness", 2);
		f.render();
		console.log("filter7");
		callback();
	},
	filter8 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.35, 1.27, 1.38]);
		f.filterImage("brightness", 4);
		f.render();
		console.log("filter8");
		callback();
	},
	filter9 : function(img, format, callback) {
		var f = new Filterous(img, format);
		f.filterImage("rgbAdjust", [1.22, 1.35, 1.41]);
		f.filterImage("brightness", 4);
		f.render();
		console.log("filter9");
		callback();
	},

	rockstar : function(img, format, callback) {
		// applying a starry layer
		alert('asd');

		var rockstarLayer = new Image();
		rockstarLayer.src = 'effects/bokeh-stars.png';

		var f = new Filterous(img, format);
		f.applyLayer(rockstarLayer);
		f.render();
		console.log('rockstar');
		callback();
	}
};
