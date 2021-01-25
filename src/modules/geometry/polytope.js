import * as THREE from "../ext/three.module.js";

/** Base class for polytopes */
export default class Polytope {
	/**
	 * Create a polytope
	 * @param {Vertex[]} vertices - Array of the polytope's vertices
	 * @param {Face[]} faces - Array of the polytope's faces
	 */
	constructor(vertices = [], faces = []) {
		this.vertices = vertices;
		this.faces = faces;
	}

	/**
	 * Rotate this polytope around the origin around a set plane by a set angle
	 * @param {number[]} axes - The axes (0 is X, 1 is Y, 2 is Z, 3 is W/X4, etc) that form the plane to rotate around
	 * @param {number} theta - The angle to rotate by
	 */
	rotate(axes, theta) {
		return new Polytope(
			this.vertices.map(e => e.rotate(axes, theta)),
			this.faces
		);
	}

	/**
	 * Scale this polytope up (centered on the origin) by a factor
	 * @param {number} factor - The factor to scale by
	 */
	scale(factor) {
		return new Polytope(
			this.vertices.map(e => e.scale(factor)),
			this.faces
		);
	}

	/** Get the 3D locations of the vertices */
	get vertices3() {
		return this.vertices.map(e => e.project());
	}

	/** Get tha available modes for rendering this shape */
	get availableModes() {
		let array = ["points"];
		if (this.vertices.length > 1) array.push("wireframe");
		if (this.vertices.length > 2 && this.vertices[0].dim < 4) array.push("normal");
		return array;
	}

	/** Get the normal mode geometry */
	get geometry() {
		// Get the vertices as a flat array
		let verts = this.vertices3.map(e => e.pos).flat();
		// Get the triangles (faces, according to THREE.js smh) as vertex indices
		let faces = this.faces.map(e => e.triangles).flat();
		return new THREE.PolyhedronGeometry(verts, faces, 1, 0);
	}

	/** Get the wireframe mode geometry */
	get wireframe_geometries() {
		if (this.vertices.length == 2) {
			return [
				new THREE.BufferGeometry().setFromPoints([
					...this.vertices3.map(e => new THREE.Vector3(...e.pos)),
				]),
			];
		}
		let faces = [];
		for (let i of this.faces) {
			// Create an array of points for each face
			let points = [
				...i.vertices.map(i => new THREE.Vector3(...this.vertices3[i].pos)),
				new THREE.Vector3(...this.vertices3[i.vertices[0]].pos),
			];
			// Create a buffer geometry which will be rendered as a line in a group
			let l = new THREE.BufferGeometry().setFromPoints(points);
			// Add to the array of faces
			faces.push(l);
		}
		return faces;
	}

	/** Get the points mode geometry */
	get points_geometry() {
		// Create an empty geometry
		let geometry = new THREE.Geometry();
		// Add the vertices
		geometry.vertices.push(...this.vertices3.map(e => new THREE.Vector3(...e.pos)));
		return geometry;
	}
}
