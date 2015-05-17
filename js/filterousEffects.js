/*
 *  Predefined filter effects with names for Filterous.js
 *
 *  Last modified: March 1, 2014
 */

// Prepare image-layer effects
/*
var rockstarLayer = new Image();
rockstarLayer.src = './effects/bokeh-stars.png';
*/

// Define named effects
 
var ApplyEffects = {
	reset: function(img, format, callback) {
		var f = new Filterous(img, format);
		f.reset();
		console.log('reset');
		callback();
	},
	fluor: function(img, format,callback) {
		// Warm, saturated tones with an emphasis on yellow
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1, 1.2, 1.4]);
		f.filterImage('brightness', 10);
		f.render();
		console.log('fluorescent');
		callback();
	},
	nostalgia: function(img, format,callback) {
		// Slightly blurred, with sepia tone
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.4, 1.2, 1]);		
	    f.render();
	    console.log('nostalgia');
	    callback();
	},
	phykos: function(img, format,callback) {
		// Slightly blurred, with yellow and green saturated
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1, 1.1, 1.1]);		
	    f.render();
	    console.log('phykos');
	    callback();
	},
	lotus: function(img, format,callback) {
		// Sepia-like, with an emphasis on purples and browns
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.4, 1.15, 1.1]);
		f.render();
		console.log('lotus');
		callback();
	},
	memphis: function(img, format,callback) {
		// Sharp images with a magenta-meets-purple tint
		var f = new Filterous(img, format);
		f.filterImage('rgbAdjust', [1.2, 1, 1.1]);
		f.filterImage('convolute', 
			[ 0, -1,  0,
	    	 -1,  5, -1,
	    	  0, -1,  0 ]
	    );	    
	    f.render();
	    console.log('memphis');
	    callback();
	},
	deutlich: function(img, format,callback) {
		// High exposure
		var f = new Filterous(img, format);
		f.filterImage('convolute', 
			[ 0, 0, 0,
	    	  0, 1.3, 0,
	    	  0, 0, 0 ]
	    );
	    f.render();
	    console.log('deutlich');
	    callback();
	},
	sumie: function(img, format,callback) {
		var f = new Filterous(img, format);
		f.filterImage('grayscale');
		f.render();
		console.log('sumie');
		callback();
	},
	rockstar: function(img, format,callback) {
		// applying a starry layer
		var f = new Filterous(img, format);
		f.applyLayer(rockstarLayer);
		f.render();
		console.log('rockstar');
		callback();
	}

};