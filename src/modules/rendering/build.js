import Polytope from "../geometry/polytope.js";
import Vertex from "../geometry/vertex.js";
import Face from "../geometry/face.js";

const Build = {};

/**
 * Create a dyad
 * @param {number} length - The length of the dyad
 */
Build.dyad = function (length) {
	return new Polytope([new Vertex(-length / 2, 0, 0), new Vertex(length / 2, 0, 0)], []);
};

/**
 * Create a polygon from an array of vertices (as arrays)
 * @param {number[][]} vertices - The vertices of the polygon
 */
Build.polygon = function (vertices) {
	let t = 0;
	return new Polytope(
		vertices.map(e => new Vertex(...e)),
		[
			new Face(
				vertices.length,
				Array.from({ length: vertices.length }, () => t++)
			),
		]
	);
};

/**
 * Create a regular polygon given a number of sides/angles and a winding number
 * @param {number} order - The number of sides/angles
 * @param {number} s - The winding number
 */
Build.regularPolygon = function (order, s = 1) {
	let t1 = 0,
		t2 = 0;
	return new Polytope(
		Array.from({ length: order }, () => {
			let t = t1++;
			return new Vertex(
				Math.cos((2 * t * s * Math.PI) / order),
				Math.sin((2 * t * s * Math.PI) / order),
				0
			);
		}),
		[
			new Face(
				order,
				Array.from({ length: order }, () => t2++)
			),
		]
	);
};

Build.simplex = function (dim) {
	let vertices = [];
	for (let i = 0; i < dim; i++) {
		let v = new Array(dim).fill(0);
		v.splice(i, 1, Math.sqrt(2) / 2);
		v = v.map(e => e - Math.sqrt(2) / 2 + 0.5);
		vertices.push(new Vertex(...v));
	}
	vertices.push(
		new Vertex(
			...new Array(dim)
				.fill(((1 - Math.sqrt(dim + 1)) * Math.sqrt(2)) / (2 * dim))
				.map(e => e - Math.sqrt(2) / 2 + 0.5)
		)
	);
	let faces = [];
	let t;
	for (let i = 0; i < dim - 1; i++) {
		for (let j = i + 1; j < dim; j++) {
			if (i == j) continue;
			for (let k = Math.max(i + 2, j + 1); k < dim + 1; k++) {
				if (i == k || j == k) continue;
				faces.push(new Face(3, [i, j, k]));
			}
		}
	}
	return new Polytope(vertices, faces);
};

Build.hyperCube = function (dim) {};

export default Build;
