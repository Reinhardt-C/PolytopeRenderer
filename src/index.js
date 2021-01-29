// Import tippy.js for tooltips
// import tippy from "tippy.js";
// import "tippy.js/dist/tippy.css";
// Import renderer
import renderInit from "./modules/rendering/render.js";
// Import build
import Cube from "./modules/geometry/cube.js";
import Tesseract from "./modules/geometry/tesseract.js";
import Build from "./modules/rendering/build.js";
// Import helper methods
import { $, $$, createSection, slider } from "./modules/helpers/helperMethods.js";
// Import .off file loader
import { loadOFF, parseOFF } from "./modules/helpers/offHelper.js";
import SETTINGS from "./modules/helpers/settingsHelper.js";

const renderGeometry = renderInit();
// Obj needs to be global
let obj, geometry, material;
let needsUpdate = false;

// Call the rendering as an asynchronous function to allow for loading files
(async () => {
	// if (SETTINGS.mode == "normal")
	// 	alert(
	// 		"Normal rendering isn't well supported at this time. Non-convex shapes and rotations do not work."
	// 	);
	// obj = await loadOFF("./load/test.off");
	obj = new Cube();
	// obj = new Build.dyad(1);
	// obj = Build.regularPolygon(255, 127);
	// obj = Build.simplex(5).scale(2);
	let mesh = renderGeometry(obj, SETTINGS.mode);
	geometry = mesh.geometry;
	// Rotation loop
	setInterval(() => {
		// Rotate
		if (
			needsUpdate ||
			(!SETTINGS.paused && SETTINGS.rotations.filter(e => e[1] !== 0).length > 0)
		) {
			needsUpdate = false;
			for (let i of SETTINGS.rotations)
				obj.vertices = obj.rotate(i[0], i[1] * SETTINGS.rotPerFrame).vertices;
			// This seems to be the only thing that works, so I completely remove the mesh and add a new one
			if (SETTINGS.mode == "normal") renderGeometry(obj, "normal");
			else {
				// Get the new geometry
				let newVerts = obj.newVerticesFromMode(SETTINGS.mode);
				// console.log(newVerts);
				const vertices = geometry.attributes.position.array;
				for (let i in newVerts) vertices[i] = newVerts[i];
				geometry.attributes.position.needsUpdate = true;
			}
		}
	}, 50);
})();

// Run menu setup
(() => {
	const menus = $("#menus");
	// Camera position section
	(() => {
		const campos = createSection("Camera Position", menus);
		for (let i in SETTINGS.cameraPosition) {
			const wrapper = $$("div");
			wrapper.className = "cpwrapper";
			if (i == 0) wrapper.innerHTML = "X: ";
			else if (i == 1) wrapper.innerHTML = "Y: ";
			else if (i == 2) wrapper.innerHTML = "Z: ";
			else if (i == 3) wrapper.innerHTML = "W: ";
			else wrapper.innerHTML = `X<sub>${l + 1}</sub>: `;
			const s = slider(...SETTINGS.cameraPosRange[i], SETTINGS.cameraPosition[i], 0.01);
			const t = document.createTextNode(SETTINGS.cameraPosition[i]);
			wrapper.append(t);
			s.addEventListener("input", () => {
				SETTINGS.cameraPosition[i] = s.value;
				t.nodeValue = s.value;
				needsUpdate = true;
			});
			wrapper.appendChild(s);
			campos.appendChild(wrapper);
		}
		const newSlider = $$("button");
		newSlider.style.width = "50%";
		newSlider.innerText = "Next dimension";
		newSlider.addEventListener("click", () => {
			const l = SETTINGS.cameraPosition.length;
			const wrapper = $$("div");
			wrapper.innerHTML = `X<sub>${l + 1}</sub>: `;
			const t = document.createTextNode("1");
			wrapper.append(t);
			SETTINGS.cameraPosition.push(1);
			SETTINGS.cameraPosRange.push([0, 20]);
			const s = slider(0, 20, 1, 0.01);
			s.addEventListener("input", () => {
				SETTINGS.cameraPosition[l] = s.value;
				t.nodeValue = s.value;
				needsUpdate = true;
			});
			wrapper.appendChild(s);
			wrapper.appendChild($$("br"));
			campos.insertBefore(wrapper, newSlider);
		});
		campos.appendChild(newSlider);
		campos.append(
			" Note: changes to the camera position in higher dimensions than the shape being rendered will have no effect."
		);
	})();

	// Camera settings
	(() => {
		const camset = createSection("Camera Settings", menus);
		const wrapper = $$("div");
		wrapper.innerHTML = "Zoom: ";
		const t = document.createTextNode(SETTINGS.zoom);
		wrapper.append(t);
		const s = slider(0, 10, 1, 0.01);
		s.addEventListener("input", () => {
			SETTINGS.zoom = s.value;
			t.nodeValue = s.value;
		});
		wrapper.appendChild(s);
		camset.appendChild(wrapper);
	})();

	// Rotation section
	(() => {
		const rotsec = createSection("Rotation Controls", menus);
		const pause = $$("button");
		pause.innerText = "Toggle pause";
		pause.className = "green";
		pause.style.width = "100%";
		pause.addEventListener("click", () => {
			SETTINGS.paused = !SETTINGS.paused;
			pause.classList.toggle("green");
			pause.classList.toggle("red");
		});
		rotsec.appendChild(pause);
		for (let i in SETTINGS.rotations) addRotation(i);
		function addRotation(i, beforeElement) {
			const array = SETTINGS.rotations[i];
			const wrapper = $$("div");
			wrapper.innerHTML = "Plane of rotation: ";
			const axes = $$("input");
			axes.type = "text";
			axes.value = array[0];
			axes.lastvalue = array[0];
			axes.addEventListener("change", () => {
				if (!/^\d+,\d+$/.test(axes.value.trim())) {
					axes.value = axes.lastvalue;
					return;
				}
				array[0] = axes.value.trim().split(",").map(parseFloat);
			});
			try {
				tippy(axes, {
					content: `A pair of non-negative integers (comma separated) that represent 
					the axes of the plane of rotation. 0 is X, 1 is Y etc`,
				});
			} catch (e) {}
			wrapper.appendChild(axes);
			wrapper.append(document.createTextNode("Speed: "));
			const t = document.createTextNode("0");
			wrapper.append(t);
			const s = slider(-2, 2, 0, 0.01);
			wrapper.appendChild(s);
			s.addEventListener("input", () => {
				array[1] = parseFloat(s.value);
				t.nodeValue = s.value;
			});
			const remove = $$("button");
			remove.innerText = "Remove rotation";
			remove.className = "remove";
			remove.addEventListener("click", () => {
				rotsec.removeChild(wrapper);
				SETTINGS.rotations.splice(SETTINGS.rotations.indexOf(array), 1);
			});
			wrapper.appendChild(remove);
			wrapper.appendChild($$("hr"));
			if (beforeElement instanceof HTMLElement) rotsec.insertBefore(wrapper, beforeElement);
			else rotsec.appendChild(wrapper);
		}
		const newRot = $$("button");
		newRot.style.width = "100%";
		newRot.addEventListener("click", () => {
			SETTINGS.rotations.push([[0, 1], 0]);
			addRotation(SETTINGS.rotations.length - 1, newRot);
		});
		newRot.innerText = "New Rotation";
		rotsec.appendChild(newRot);
	})();

	// Shape loader
	(() => {
		const shapes = createSection("Change polytope", menus);
		const choose = $$("select");
		["Convex Regular Polygon", "Simplex", "Load from .off file"].forEach(e => {
			const o = $$("option");
			o.innerText = o.value = e;
			choose.appendChild(o);
		});
		const wrapper = $$("div");
		const update = () => {
			switch (choose.value) {
				case "Convex Regular Polygon":
					{
						wrapper.innerHTML = "Sides: ";
						const sides = $$("input");
						sides.value = "5";
						wrapper.appendChild(sides);
						const add = $$("button");
						add.style.width = "100%";
						add.innerText = "Render";
						add.addEventListener("click", () => {
							obj = Build.regularPolygon(sides.value);
							geometry = renderGeometry(obj, SETTINGS.mode);
						});
						wrapper.appendChild(add);
					}
					break;
				case "Simplex":
					{
						wrapper.innerHTML = "Dimension: ";
						const dimension = $$("input");
						dimension.value = "3";
						wrapper.appendChild(dimension);
						const add = $$("button");
						add.style.width = "100%";
						add.innerText = "Render";
						add.addEventListener("click", () => {
							obj = Build.simplex(parseFloat(dimension.value));
							geometry = renderGeometry(obj, SETTINGS.mode);
						});
						wrapper.appendChild(add);
					}
					break;
				case "Load from .off file":
					{
						wrapper.innerHTML = "";
						const load = $$("input");
						load.type = "file";
						load.accept = ".off";
						load.addEventListener("change", () => {
							console.log(load.files);
							const reader = new FileReader();
							reader.onload = e => {
								obj = parseOFF(e.target.result);
								geometry = renderGeometry(obj, SETTINGS.mode);
							};
							reader.readAsText(load.files[0]);
						});
						wrapper.appendChild(load);
					}
					break;
			}
		};
		update();
		choose.addEventListener("change", update);
		shapes.appendChild(choose);
		shapes.appendChild(wrapper);
	})();
})();
