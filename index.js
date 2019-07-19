var tryRequire = require('try-require');
var $ = require('dombo');

var electron = tryRequire('electron');
var remote = electron ? electron.remote : tryRequire('remote');
var screen = electron && electron.screen;

var mouseConstructor = tryRequire('osx-mouse') || tryRequire('win-mouse');

var supported = !!mouseConstructor;
var noop = function() {};

var drag = function(element) {
	element = $(element);

	var offset = null;
	var size = null;
	var mouse = mouseConstructor();
	var currentWindow = null;

	var onmousedown = function(e) {

		if (screen && screen.screenToDipPoint instanceof Function) {
			const windowPoint = screen.screenToDipPoint({
				x: e.clientX,
				y: e.clientY
			});
			offset = [windowPoint.x, windowPoint.y];
		}
		if (!offset) offset = [e.clientX, e.clientY];
		currentWindow = remote.getCurrentWindow();
		const windowBound = currentWindow.getBounds();
		size = {
			width: windowBound.width,
			height: windowBound.height
		};
	};

	element.on('mousedown', onmousedown);

	mouse.on('left-drag', function(x, y) {
		if(!offset) return;

		// fix: fix windows high/variable dpr displays
		if (screen && screen.screenToDipPoint instanceof Function) {
			const windowsPoint = screen.screenToDipPoint({ x, y });
			x = windowsPoint.x;
			y = windowsPoint.y;
		}

		x = Math.round(x - offset[0]);
		y = Math.round(y - offset[1]);

		if (!currentWindow) {
			currentWindow = remote.getCurrentWindow();
		}
		// fix: 不使用 set-position， 在 125% 及 170% 分辨率时，拖动会导致窗口大小变化。所以使用 setBound 强制固定大小
		currentWindow.setBounds({ width: size.width, height: size.height, x, y });
	});

	mouse.on('left-up', function() {
		offset = null;
		currentWindow = null;
		size = null;
	});

	return function() {
		element.off('mousedown', onmousedown);
		mouse.destroy();
	};
};

drag.supported = supported;
module.exports = supported ? drag : noop;
