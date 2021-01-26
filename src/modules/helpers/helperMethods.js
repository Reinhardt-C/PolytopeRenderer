// Alias for document.querySelector
export const $ = sel => document.querySelector(sel);

// Alias for document.createElement
export const $$ = el => document.createElement(el);

// Toggle function for elements
export const toggleDiv = el => {
	el.classList.toggle("hidden");
};

// Create a menu section
export const createSection = (name, parent) => {
	const wrapper = $$("div");
	const toggle = $$("button");
	toggle.innerText = name;
	toggle.className = "menuButton";
	const section = $$("div");
	section.className = "menuSection";
	toggleDiv(section);
	toggle.addEventListener("click", () => toggleDiv(section));
	wrapper.appendChild(toggle);
	wrapper.appendChild(section);
	parent.appendChild(wrapper);
	return section;
};

/**
 * Create a range slider
 * @param {number} min - The minimum value of the slider
 * @param {number} max - The maximum value of the slider
 * @param {number} value - The value of the slider
 * @param {number} step - The step size of the slider
 */
export const slider = (min, max, value, step) => {
	const s = $$("input");
	s.type = "range";
	s.step = step;
	s.min = min;
	s.max = max;
	s.value = value;
	s.className = "slider";
	return s;
};
