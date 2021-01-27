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
		let t = pos.length;
		for (let i = 3; i < t; i++) {
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
		const dim = Math.max(1, this.dim - 1, ...axes) + 1;
		const a = [...this.pos];
		const dif = dim - this.dim;
		for (let i = 0; i < dif; i++) a.push(0);
		const v0 = a[axes[0]];
		a[axes[0]] = Math.cos(theta) * v0 - Math.sin(theta) * a[axes[1]];
		a[axes[1]] = Math.sin(theta) * v0 + Math.cos(theta) * a[axes[1]];
		return new Vertex(...a);
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
