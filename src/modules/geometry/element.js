/** Class for defining elements of a polytope */
export default class Element {
	/**
	 * Create an element
	 * @param {number} subelementCount - The number of subelements comprising the element
	 * @param {number[]} subelements - Array of subelement indices
	 */
	constructor(subelementCount, subelements) {
		this.subelementCount = subelementCount;
		this.subelements = subelements;
	}
}
