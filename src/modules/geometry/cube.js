import Vertex from "./vertex.js";
import Face from "./face.js";
import Polytope from "./polytope.js";

export default class Cube extends Polytope {
	constructor() {
		let v = [];
		for (let i = 0; i < 8; i++)
			v.push(
				new Vertex(
					...("0".repeat(2 - Math.floor(Math.log2(i || 1))) + i.toString(2))
						.split("")
						.map(e => parseFloat(e) - 0.5)
				)
			);
		let f = [
			new Face(4, [0, 2, 3, 1]),
			new Face(4, [0, 4, 5, 1]),
			new Face(4, [0, 2, 6, 4]),
			new Face(4, [1, 3, 7, 5]),
			new Face(4, [2, 6, 7, 3]),
			new Face(4, [4, 6, 7, 5]),
		];
		super(v, f);
	}
}
