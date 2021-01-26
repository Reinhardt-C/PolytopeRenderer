// Import renderer
import renderInit from "./modules/rendering/render.js";
// Import other things
import Cube from "./modules/geometry/cube.js";
import Tesseract from "./modules/geometry/tesseract.js";
import Build from "./modules/rendering/build.js";
// Import .off file loader (quite untested, expect bugs)
import loadOFF from "./modules/helpers/offHelper.js";

const renderGeometry = renderInit();

// Call the rendering as an asynchronous function to allow for loading files
(async () => {
	let obj = await loadOFF("./load/test.off");
	// let obj = new Tesseract();
	// let obj = new Build.dyad(1);
	// let obj = Build.regularPolygon(5, 2);
	// let obj = Build.simplex(5).scale(2);
	const mode = "wireframe";
	let geometry = renderGeometry(obj, mode);
	// Rotation loop
	setInterval(() => {
		// Rotate
		obj = obj.rotate([1, 3], Math.PI / 30);
		// Get the new geometry
		let g2 = obj.geometryFromMode(mode);
		if (mode == "wireframe") {
			// For wireframes
			for (let i in geometry) {
				const positions = geometry[i].geometry.attributes.position.array;
				const newPositions = g2[i].attributes.position.array;
				for (let i in newPositions) positions[i] = newPositions[i];
				geometry[i].geometry.attributes.position.needsUpdate = true;
			}
		} else if (mode == "normal") {
			// For normal view
			const positions = geometry.attributes.position.array;
			const newPositions = g2.attributes.position.array;
			for (let i in newPositions) positions[i] = newPositions[i];
			geometry.attributes.position.needsUpdate = true;
		} else if (mode == "points") {
			// For point view
			const vertices = geometry.vertices;
			const newVertices = g2.vertices;
			for (let i in newVertices) vertices[i] = newVertices[i];
			geometry.verticesNeedUpdate = true;
		}
	}, 50);
})();
