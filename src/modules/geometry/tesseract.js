import Vertex from "./vertex.js";
import Face from "./face.js";
import Polytope from "./polytope.js";

export default class Tesseract extends Polytope {
	constructor() {
		let v = [];
		for (let i = 0; i < 16; i++)
			v.push(
				new Vertex(
					...("0".repeat(3 - Math.floor(Math.log2(i || 1))) + i.toString(2))
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

			new Face(4, [8, 10, 11, 9]),
			new Face(4, [8, 12, 13, 9]),
			new Face(4, [8, 10, 14, 12]),
			new Face(4, [9, 11, 15, 13]),
			new Face(4, [10, 14, 15, 11]),
			new Face(4, [12, 14, 15, 13]),

			new Face(4, [0, 2, 10, 8]),
			new Face(4, [4, 6, 14, 12]),
			new Face(4, [5, 7, 15, 13]),
			new Face(4, [3, 11, 9, 1]),
			new Face(4, [0, 1, 9, 8]),
			new Face(4, [1, 5, 13, 9]),

			new Face(4, [0, 8, 12, 4]),
			new Face(4, [4, 5, 13, 12]),
			new Face(4, [2, 3, 11, 10]),
			new Face(4, [2, 6, 14, 10]),
			new Face(4, [6, 7, 15, 14]),
			new Face(4, [3, 7, 15, 11]),
		];
		super(v, f);
	}
}
