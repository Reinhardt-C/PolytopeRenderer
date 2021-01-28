class Settings {
	constructor() {
		this.cameraPosition = [0, 0, -5, 1];
		this.cameraPosRange = [
			[-10, 10],
			[-10, 10],
			[-20, 0],
			[0, 20],
		];
		this.rotations = [];
		this.rotPerFrame = Math.PI / 30;
		this.paused = false;
		this.mode = "wireframe";
		this.zoom = 1;
	}

	load() {
		return this;
	}

	save() {}
}

const SETTINGS = new Settings().load();
globalThis.SETTINGS = SETTINGS;

export default SETTINGS;
