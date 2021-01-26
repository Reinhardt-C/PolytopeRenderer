import SETTINGS from "../helpers/settingsHelper.js";

/** Class for defining vertices in arbitrary dimensions */
export default class Vertex {
	/** Create a vertex */
	constructor(...pos) {
		this.pos = pos;
		while (this.pos.length < 3) this.pos.push(0);
	}

	/** Project the position of this vertex into 3 dimensions */
	project() {
		let pos = [...this.pos];
		let prod = 1;
		while (pos.length > 3) {
			const cp =
				SETTINGS.cameraPosition.length >= pos.length ? SETTINGS.cameraPosition[pos.length - 1] : 1;
			let w = pos.pop();
			if (w == cp) w += 0.01;
			prod /= cp - w;
		}
		for (let i = 0; i < pos.length; i++) {
			pos[i] = pos[i] * prod;
		}
		return new Vertex(...pos);
	}

	/**
	 * Rotate this point around the origin around a set plane by a set angle
	 * @param {number[]} axes - The axes (0 is X, 1 is Y, 2 is Z, 3 is W/X4, etc) that form the plane to rotate around
	 * @param {number} theta - The angle to rotate by
	 */
	rotate(axes, theta) {
		let dim = Math.max(2, this.dim, ...axes.map(e => e + 1));
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
	 * Rotate a vector around the origin around a set plane by a set angle
	 * @param {number[]} coords - The coordinates of the vector to be rotated
	 * @param {number[]} axes - The axes (0 is X, 1 is Y, 2 is Z, 3 is W/X4, etc) that form the plane to rotate around
	 * @param {number} theta - The angle to rotate by
	 */
	static rotate(coords, axes, theta) {
		let dim = Math.max(2, coords.length, ...axes.map(e => e + 1));
		let a = [...coords];
		a.push(...new Array(dim - coords.length).fill(0));
		let pos = math.matrix(a);
		let rotationMatrix = math.identity(dim);
		rotationMatrix._data[axes[0]][axes[0]] = Math.cos(theta);
		rotationMatrix._data[axes[0]][axes[1]] = -Math.sin(theta);
		rotationMatrix._data[axes[1]][axes[0]] = Math.sin(theta);
		rotationMatrix._data[axes[1]][axes[1]] = Math.cos(theta);
		return math.multiply(rotationMatrix, pos)._data;
	}

	/**
	 * Scale this vertex (centered on the origin) by a factor
	 * @param {number} factor - The factor to scale by
	 */
	scale(factor) {
		return new Vertex(...this.pos.map(e => e * factor));
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
