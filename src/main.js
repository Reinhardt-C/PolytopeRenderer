// Import renderer
import renderInit from "./modules/rendering/render.js";
// Import other things
import Cube from "./modules/geometry/cube.js";
import Tesseract from "./modules/geometry/tesseract.js";
import Build from "./modules/rendering/build.js";

const renderGeometry = renderInit();

let obj = new Tesseract();
// const obj = new Build.dyad(1);
// const obj = Build.regularPolygon(7);
// const obj = Build.simplex(4);

setInterval(() => {
	obj = obj.rotate([0, 3], Math.PI / 50);
	renderGeometry(obj, "wireframe");
}, 50);
