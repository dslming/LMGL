// -----------------------------------------------------------------------------
function loadTextFile(url, callback) {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();

		// Math.random will prevent cacheing
		request.open('GET', url + '?please-dont-cache=' + Math.random(), true);

		request.onload = function () {
			if (request.status < 200 || request.status > 299) {
				reject('Error: HTTP Status ' + request.status + ' on resource ' + url);
			} else {
				resolve(request.responseText);
			}
		};
		request.send();
	});
}

// -----------------------------------------------------------------------------
var loadJSONFile = function (url, callback) {
	return new Promise((resolve, reject) => {
		loadTextFile(url).then(function(result) {
				resolve(JSON.parse(result));
		}).catch(function(err) {
			rejected(err);
		});
	});
}

// -----------------------------------------------------------------------------
var loadImage = function (url, callback) {
	return new Promise((resolve, reject) => {
		var image = new Image();
		image.onload = function () {
			resolve(image);
		};
		image.onerror = function() {
			reject('Unable to load ' + url);
		};
		image.src = url;
	});
};
