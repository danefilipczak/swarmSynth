var renderer, scene, camera, ambient;

var vehicles = [];
var targets = [];
var textureCube
var orbit;

var flock = false;
var skyBox;

var nnworld = 4; //midi note number to world conversion scalar factor



window.onload = function() {


	scene = new THREE.Scene();
	//scene.add(group);
	scene.background = new THREE.Color('blue');
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 50;
	camera.position.y = 20;

	orbit = new THREE.OrbitControls(camera)

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	renderer.domElement.style = "position:fixed; top:0px; left:0px"



	ambient = new THREE.HemisphereLight(0x404040); // soft white light
	ambient.position.y = -10
	ambient.position.z = 5
	scene.add(ambient);

	for (var i = 0; i < 100; i++) {
		vehicles.push(new Vehicle())
	}

	for (var i = 0; i < 15; i++) {
		targets.push(new Target());
	}
	setTargets(0)



	//



	var path = "textures/";
	var format = '.jpg';
	var urls = [
		path + 'posx' + format, path + 'negx' + format,
		path + 'posy' + format, path + 'negy' + format,
		path + 'posz' + format, path + 'negz' + format
	];
	var textureCube = new THREE.CubeTextureLoader().load(urls);
	textureCube.format = THREE.RGBFormat;

	scene.background = textureCube;



	//


	var imagePrefix = "textures/";
	var directions = ["posx", "negx", "posy", "negy", "posz", "negz"];
	var imageSuffix = ".jpg";
	var sides = 1000;
	var skyGeometry = new THREE.BoxGeometry(sides, sides, sides);
	var loader = new THREE.TextureLoader();

	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push(new THREE.MeshBasicMaterial({
			map: loader.load(imagePrefix + directions[i] + imageSuffix),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MultiMaterial(materialArray);
	// var skyMaterial = new THREE.MeshPhongMaterial( {color:'black'} );
	// skyMaterial.side = THREE.BackSide;
	skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	scene.add(skyBox)



	//

	render();
}