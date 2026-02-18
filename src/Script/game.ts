import 'babylonjs'
import 'babylonjs-loaders'
import { Common } from './common';

export const createScene = (dev: boolean) => {

	// Resources:
	// BabylonJS Docs: https://doc.babylonjs.com/

	// Create BabylonJS engine
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	const engine = new BABYLON.Engine(canvas, true, {}, true);
	const scene = new BABYLON.Scene(engine);

	// Set background colour
	scene.clearColor = new BABYLON.Color4(0.44, 0.61, 0.58, 1);

	// Show the "Scene Explorer"
	//scene.debugLayer.show();	

	// Render loop - runs every frame
	engine.runRenderLoop(function () {
		scene.render();
	});

	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		engine.resize();
	});

	// Lights
	const light = new BABYLON.DirectionalLight("Light", new BABYLON.Vector3(BABYLON.Tools.ToRadians(-45), BABYLON.Tools.ToRadians(-45), 0), scene);

	// Camera
	const mainCamera = new BABYLON.ArcRotateCamera("MainCamera", BABYLON.Tools.ToRadians(45), BABYLON.Tools.ToRadians(45), 10, BABYLON.Vector3.Zero(), scene);

	// Allow camera movement with mouse - remember that the div over the canvas could be blocking the mouse events.
	//mainCamera.attachControl(canvas);

	// Action
	const box = BABYLON.MeshBuilder.CreateBox("Box");
	//box.setEnabled(false);
	//box.visibility = 0.2;
	//console.log(box);
	
	// Move box on every frame
	let timeS = 0;
	const spinSpeed = 1;
	scene.onBeforeCameraRenderObservable.add(() => {		
		let timeSinceLastFrameS = engine.getDeltaTime() / 1000;
		timeS += timeSinceLastFrameS;
		box.rotation.y += spinSpeed * timeSinceLastFrameS;
		box.position.x = Math.sin(timeS * spinSpeed);
		box.position.z = -Math.cos(timeS * spinSpeed);
	});

	// Change header colour every second
	let header = $("#header");
	window.setInterval(() => {	
		header.css({'color': Common.GetRandomHexColor() });
	}, 1000);
}