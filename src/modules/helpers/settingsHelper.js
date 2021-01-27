class Settings {
	constructor() {
		this.cameraPosition = [0, 0, -10, 13];
		this.cameraPosRange = [
			[-10, 10],
			[-10, 10],
			[-10, 10],
			[0, 20],
		];
		this.rotations = [];
		this.rotPerFrame = Math.PI / 30;
		this.paused = false;
		this.mode = "wireframe";
	}

	load() {
		return this;
	}

	save() {}
}

const SETTINGS = new Settings().load();

export default SETTINGS;
