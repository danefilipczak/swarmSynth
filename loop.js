function animationLoop(){

    vehicles.forEach(function(v){
    	v.run(vehicles);
    })


    var vec = new THREE.Vector3()
    vehicles.forEach(function(v){
    	vec.add(v.position)
    })
    vec.divideScalar(vehicles.length);
    //console.log(vec.y);

    //camera.position.setComponent(1, vec.y);
	//orbit.update();

	orbit.target.setComponent(1, vec.y);
	orbit.update();
    // console.log('poo')
    // skyBox.rotation.y+=0.01

}