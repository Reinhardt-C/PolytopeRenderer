// Import renderer
import renderInit from "./modules/rendering/render.js";
// Import other things
import Cube from "./modules/geometry/cube.js";
import Tesseract from "./modules/geometry/tesseract.js";
import Build from "./modules/rendering/build.js";
// Import .off file loader (quite untested, expect bugs)
import loadOFF from "./modules/helpers/offHelper.js";

const renderGeometry = renderInit();

(async () => {
	let obj = await loadOFF("./load/test.off");
	// let obj = new Tesseract();
	// let obj = new Build.dyad(1);
	// let obj = Build.regularPolygon(5, 2);
	// let obj = Build.simplex(3).scale(1.2);
	renderGeometry(obj, "wireframe");
	setInterval(() => {
		obj = obj.rotate([2, 3], Math.PI / 30);
		renderGeometry(obj, "wireframe");
	}, 50);
})();
