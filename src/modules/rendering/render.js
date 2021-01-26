import * as THREE from "../ext/three.module.js";
import { $ } from "../helpers/helperMethods.js";
import mouseInit from "../helpers/mouseHelper.js";
import SETTINGS from "../helpers/settingsHelper.js";

// Setup data that will be used, stored at the top for easy manipulation
const el = $("#render");
const DEBUG = {
	WIDTH: el.getBoundingClientRect().width,
	HEIGHT: el.getBoundingClientRect().height,
};

// Rotation of object being rendered
let rotation = {
	x: 0,
	y: 0,
	z: 0,
};

/** Method which initializes the rendering helper */
export default function renderInit() {
	// Setup renderer
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(DEBUG.WIDTH, DEBUG.HEIGHT);
	el.appendChild(renderer.domElement);
	// Setup camera
	const camera = new THREE.PerspectiveCamera(75, DEBUG.WIDTH / DEBUG.HEIGHT, 0.1, 1000);
	camera.position.set(0, 0, -5);
	camera.lookAt(0, 0, 0);
	// Setup scene
	const scene = new THREE.Scene();
	// Setup lights
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
	directionalLight.position.set(1, 1, 1).normalize();
	// Add lights to the scene
	scene.add(ambientLight);
	scene.add(directionalLight);

	// Initialize mouse/touchscreen controls
	mouseInit(el, (dx, dy) => {
		rotation.x -= dy / 50;
		rotation.x = Math.max(Math.min(rotation.x, Math.PI / 2), -Math.PI / 2);
		rotation.y += dx / 50;
	});

	// Create and call animation loop
	function animate() {
		camera.position.set(...SETTINGS.cameraPosition.slice(0, 3));
		// Set rotation on displayed object
		if (scene.children.length > 2)
			scene.children[2].rotation.set(rotation.x, rotation.y, rotation.z);
		// Request the animation loop to be called again
		requestAnimationFrame(animate);
		// Render the scene
		renderer.render(scene, camera);
	}
	animate();

	/**
	 * Method which switches the currently rendered polytope/rendering mode
	 * @param {Polytope} polytope - The polytope to render
	 * @param {String} mode - How to display the polytope, "normal"|"wireframe"|"points"
	 */
	return function (polytope, mode = "wireframe") {
		/**
		 * Remove an object from memory and the scene
		 * @param {THREE.Object3D} - The object to be removed
		 */
		function remove(obj) {
			if (obj.geometry) obj.geometry.dispose();
			if (obj.material) obj.material.dispose();
			for (let i of obj.children) remove(i);
			scene.remove(obj);
		}
		// Remove previous object
		if (scene.children.length > 2) remove(scene.children[2]);
		// Initialize geometry and mesh variables
		let geometry, mesh;
		// Handle different modes of rendering polytopes
		switch (mode) {
			case "normal":
				// Handle rendering polytopes with faces shown
				geometry = polytope.geometry;
				mesh = new THREE.Mesh(
					geometry,
					new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })
				);
				break;
			case "wireframe":
				// Handle rendering polytopes with edges shown
				geometry = polytope.wireframe_geometries;
				geometry = geometry.map(e => new THREE.Line(e));
				mesh = new THREE.Group();
				geometry.forEach(e => mesh.add(e));
				break;
			case "points":
				// Handle rendering polytopes with vertices shown
				geometry = polytope.points_geometry;
				mesh = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.05 }));
				break;
		}
		scene.add(mesh);
		return geometry;
	};
}
