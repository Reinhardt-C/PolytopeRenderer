import Element from "./element.js";
/** Class for defining faces for a polytope */
export default class Face extends Element {
	/**
	 * Create a face
	 * @param {number} vertexCount - The number of vertices around the face
	 * @param {number[]} vertices - Array of vertex indices
	 */
	constructor(vertexCount, vertices) {
		super(vertexCount, vertices);
		this.vertexCount = vertexCount;
		this.vertices = vertices;
	}

	/** Return the triangles as index arrays */
	get triangles() {
		let triangles = [];
		for (let i = 1; i < this.vertexCount - 1; i++)
			triangles.push(this.vertices[0], this.vertices[i], this.vertices[i + 1]);
		return triangles;
	}
}
