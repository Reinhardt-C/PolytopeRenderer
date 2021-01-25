/** Class for defining vertices in arbitrary dimensions */
export default class Vertex {
	/** Create a vertex */
	constructor() {
		this.pos = [...arguments];
		while (this.pos.length < 3) this.pos.push(0);
	}

	/** Project the position of this vertex into 3 dimensions */
	project() {
		let pos = [...this.pos];
		while (pos.length > 3) {
			let w = pos.pop();
			const scale = 1;
			if (w == scale) w += 0.01;
			pos = pos.map(e => e / (scale - w));
		}
		return new Vertex(...pos);
	}

	/**
	 * Rotate this point around the origin around a set plane by a set angle
	 * @param {number[]} axes - The axes (0 is X, 1 is Y, 2 is Z, 3 is W/X4, etc) that form the plane to rotate around
	 * @param {number} theta - The angle to rotate by
	 */
	rotate(axes, theta) {
		let dim = Math.max(2, this.dim);
		let a = [...this.pos];
		a.push(...new Array(dim - this.dim).fill(0));
		let pos = math.matrix(a);
		let rotationMatrix = math.identity(dim);
		rotationMatrix._data[axes[0]][axes[0]] = Math.cos(theta);
		rotationMatrix._data[axes[0]][axes[1]] = -Math.sin(theta);
		rotationMatrix._data[axes[1]][axes[0]] = Math.sin(theta);
		rotationMatrix._data[axes[1]][axes[1]] = Math.cos(theta);
		return new Vertex(...math.multiply(rotationMatrix, pos)._data);
	}

	/**
	 * Return a new vertex scaled up (centered on the origin)
	 * @param {number} scale - The factor to scale up by
	 */
	scale(scale) {
		return new Vertex(...this.pos.map(e => e * scale));
	}

	/** The dimension of the vertex */
	get dim() {
		return this.pos.length;
	}
}

// console.log(new Vertex(0, 1, 0).rotate([0, 1], Math.PI / 2));
