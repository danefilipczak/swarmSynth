var renderer, scene, camera, ambient;

var vehicles = [];
var targets = [];



window.onload = function(){

	
	scene = new THREE.Scene();
	//scene.add(group);
	scene.background = new THREE.Color( 'blue' );
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	camera.position.z=50;
	camera.position.y=20;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.domElement.style = "position:fixed; top:0px; left:0px"


	


	ambient = new THREE.HemisphereLight( 0x404040 ); // soft white light
	ambient.position.y = -10
	ambient.position.z=5
	scene.add( ambient );

	for(var i = 0; i< 100; i++){
		vehicles.push(new Vehicle())
	}

	for(var i = 0; i< 15; i++){
		targets.push(new Target());
	}
	
	render();
}
