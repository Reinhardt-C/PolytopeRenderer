import * as THREE from "../ext/three.module.js";
import Face from "./face.js";

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
		let rotatedPoints = [];
		const len = this.vertices.length;
		for (let i = 0; i < len; i++) rotatedPoints.push(this.vertices[i].rotate(axes, theta));
		return new Polytope(rotatedPoints, this.faces);
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
		let projectedVertices = [];
		const len = this.vertices.length;
		for (let i = 0; i < len; i++) projectedVertices.push(this.vertices[i].project());
		return projectedVertices;
	}

	/** Get tha available modes for rendering this shape */
	get availableModes() {
		let array = ["points"];
		if (this.vertices.length > 1) array.push("wireframe");
		if (this.vertices.length > 2 && this.vertices[0].dim < 4) array.push("normal");
		return array;
	}

	/**
	 * Get the geometry from the mode
	 * @param {String} mode - The mode of the geometry
	 */
	geometryFromMode(mode) {
		if (mode == "normal") return this.geometry;
		if (mode == "wireframe") return this.wireframe_geometry;
		if (mode == "points") return this.points_geometry;
		throw "Unknown geometry mode";
	}

	/**
	 * Get the new vertices for updating the structure
	 * @param {String} mode - The mode of the geometry
	 */
	newVerticesFromMode(mode) {
		const v3 = this.vertices3;
		const len = v3.length;
		let points = [];
		for (let i = 0; i < len; i++) points.push(...v3[i].pos);
		return points;
	}

	/** Get the normal mode geometry */
	get geometry() {
		// Get the vertices as a flat array
		let verts = this.vertices3.map(e => e.pos).flat();
		// Get the triangles (faces, according to THREE.js smh) as vertex indices
		let faces = this.faces.map(e => e.triangles).flat();
		return new THREE.PolyhedronBufferGeometry(verts, faces, 1, 0);
	}

	/** Get the wireframe mode geometry */
	get wireframe_geometry() {
		let points = [];
		const v3 = this.vertices3;
		for (let i = 0; i < v3.length; i++) points.push(new THREE.Vector3(...v3[i].pos));
		let geom = new THREE.BufferGeometry().setFromPoints(points);
		let indices = [];
		for (let i of this.faces)
			for (let j = 0; j < i.vertexCount; j++)
				indices.push(i.vertices[j], i.vertices[(j + 1) % i.vertexCount]);
		geom.setIndex(indices, 1);
		return geom;
	}

	/** Get the points mode geometry */
	get points_geometry() {
		// Create an empty geometry
		let geometry = new THREE.BufferGeometry().setFromPoints([
			...this.vertices3.map(e => new THREE.Vector3(...e.pos)),
		]);
		return geometry;
	}
}
