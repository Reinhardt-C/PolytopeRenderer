/**
 * Initialize mouse handlers
 * @param {HTMLElement} el - The element to test
 * @param {mouseCallback} cb - Callback
 */
export default function mouseInit(el, cb) {
	// Initialize mouse data
	let mouseData = {
		x: 0,
		y: 0,
		down: false,
	};

	// Add listener for when the mouse is pressed down
	el.addEventListener("mousedown", e => {
		e.preventDefault();
		mouseData.x = e.offsetX;
		mouseData.y = e.offsetY;
		mouseData.down = true;
	});
	// Add listener for when the mouse moves
	el.addEventListener("mousemove", e => {
		e.preventDefault();
		if (mouseData.down) cb(e.offsetX - mouseData.x, e.offsetY - mouseData.y);
		mouseData.x = e.offsetX;
		mouseData.y = e.offsetY;
	});
	// Add listener for when the mouse is lifted
	el.addEventListener("mouseup", e => {
		e.preventDefault();
		mouseData.x = e.offsetX;
		mouseData.y = e.offsetY;
		mouseData.down = false;
	});
	// Add listener for when the touchscreen is touched
	el.addEventListener("touchstart", e => {
		e.preventDefault();
		mouseData.x = e.changedTouches[0].pageX;
		mouseData.y = e.changedTouches[0].pageY;
		mouseData.down = true;
	});
	// Add listener for when the touchscreen is used
	el.addEventListener("touchmove", e => {
		e.preventDefault();
		if (mouseData.down)
			cb(e.changedTouches[0].pageX - mouseData.x, e.changedTouches[0].pageY - mouseData.y);
		mouseData.x = e.changedTouches[0].pageX;
		mouseData.y = e.changedTouches[0].pageY;
	});
	// Add listener for when the touchscreen stops being touched
	el.addEventListener("touchend", e => {
		e.preventDefault();
		mouseData.x = e.changedTouches[0].pageX;
		mouseData.y = e.changedTouches[0].pageY;
		mouseData.down = false;
	});

	return mouseData;
}

/**
 * @callback mouseCallback
 * @param {number} dx - The change in the mouse's x position
 * @param {number} dy - The change in the mouse's y position
 */
