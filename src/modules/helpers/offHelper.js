import Vertex from "../geometry/vertex.js";
import Face from "../geometry/face.js";
import Polytope from "../geometry/polytope.js";

/**
 * Method to load the contents of a .off file and return a polytope
 * @param {String} path - The path to the .off file
 */
export async function loadOFF(path) {
	const response = await fetch(path);
	const contents = await response.text();
	return parseOFF(contents);
}

/**
 * Method to parse the contents of a .off file and return a polytope
 * @param {String} data - The data in .off format
 */
export function parseOFF(data) {
	let lines = data
		.split("\n")
		.map(e => e.replace(/#.*/g, "").trim())
		.filter(e => e.length > 0);
	if (/OFF/.test(lines[0])) lines.shift();
	const vfe = lines.shift().split(/\s+/).map(parseFloat);
	const vcount = vfe[0];
	const fcount = vfe[1];
	let vertices = [];
	for (let i = 0; i < vcount; i++)
		vertices.push(new Vertex(...lines.shift().split(/\s+/).map(parseFloat)));
	let faces = [];
	for (let i = 0; i < fcount; i++) {
		let f = lines.shift().split(/\s+/).map(parseFloat);
		faces.push(new Face(f[0], [...f.slice(1)]));
	}
	const polytope = new Polytope(vertices, faces);
	return polytope;
}
