var audioCtx = new(window.AudioContext || window.webkitAudioContext)();



function Vehicle() {
  this.acceleration = new THREE.Vector3(0, 0, 0);
  this.velocity = new THREE.Vector3(random(-1, 1), random(-1, 1), random(-1, 1));
  var splay = 10;
  this.position = new THREE.Vector3(random(-splay, splay), random(-splay, splay), random(-splay, splay));
  this.r = 3;
  this.maxspeed = 3; // Maximum speed
  this.maxforce = 0.05; // Maximum steering force


  this.geometry = new THREE.SphereGeometry(this.r, 32, 32);
  // this.material = new THREE.MeshPhongMaterial( {color: 'yellow'} );


  var shader = THREE.FresnelShader;
  var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  uniforms["tCube"].value = textureCube;
  this.material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader
  });


  this.sphere = new THREE.Mesh(this.geometry, this.material);
  scene.add(this.sphere);


  this.panNode = audioCtx.createStereoPanner();
  this.panNode.connect(audioCtx.destination);

  this.gainNode = audioCtx.createGain();
  this.gainNode.connect(this.panNode);
  // this.gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 2);
  this.gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

  this.oscillator = audioCtx.createOscillator();
  this.oscillator.type = 'sine';
  this.oscillator.frequency.value = 440; // value in hertz
  this.oscillator.connect(this.gainNode);
  this.oscillator.start();



  this.run = function(vehicles) {
    if (flock) {
      this.flock(vehicles);
    }


    var center = this.seek(new THREE.Vector3(0, 0, 0));
    this.applyForce(center)

    var sep = this.separate(vehicles);
    sep.multiplyScalar(1.5);
    this.applyForce(sep);


    this.update();
    // this.borders();
    this.render();
  };

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  // We accumulate a new acceleration each time based on three rules
  this.flock = function(vehicles) {
    // Separation
    var ali = this.align(vehicles); // Alignment
    var coh = this.cohesion(vehicles); // Cohesion
    // Arbitrarily weight these forces

    ali.multiplyScalar(1);
    coh.multiplyScalar(1);
    // Add the force vectors to acceleration

    this.applyForce(ali);
    this.applyForce(coh);
  };

  // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.clampLength(-100, this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.multiplyScalar(0);
  };



  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {
    // console.log('seek')

    var desired = target.clone();
    desired = desired.sub(this.position);
    // var desired = THREE.Vector3.sub(target,this.position);  // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.multiplyScalar(this.maxspeed);
    // Steering = Desired minus Velocity

    var steer = desired.clone();
    steer = desired.sub(this.velocity);
    // var steer = THREE.Vector3.sub(desired,this.velocity);
    steer.clampLength(-1000, this.maxforce); // Limit to maximum steering force
    return steer;
  };

  this.render = function() {

    // Draw a triangle rotated in the direction of velocity
    // var theta = this.velocity.heading() + radians(90);
    // fill(127);
    // stroke(200);
    // push();
    // translate(this.position.x,this.position.y);
    // rotate(theta);
    // beginShape();
    // vertex(0, -this.r*2);
    // vertex(-this.r, this.r*2);
    // vertex(this.r, this.r*2);
    // endShape(CLOSE);
    // pop();
    // console.log(this.position.x)
    this.sphere.position.copy(this.position);

    this.oscillator.frequency.linearRampToValueAtTime(this.position.y, audioCtx.currentTime + 0.1)
    this.panNode.pan.linearRampToValueAtTime(map(this.position.x, -500, 500, -1, 1), audioCtx.currentTime + 0.05)
  };

  // Wraparound
  this.borders = function() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  };

  // Separation
  // Method checks for nearby vehicles and steers away
  this.separate = function(vehicles) {

    var desiredseparation = 25.0;
    var steer = new THREE.Vector3(0, 0, 0);
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0; i < vehicles.length; i++) {
      var d = this.position.distanceTo(vehicles[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = this.position.clone();
        diff = diff.sub(vehicles[i].position);
        // var diff = THREE.Vector3.sub(this.position,vehicles[i].position);
        diff.normalize();
        diff.divideScalar(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.divideScalar(count);
    }

    // As long as the vector is greater than 0
    if (steer.length() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.multiplyScalar(this.maxspeed);
      steer.sub(this.velocity);
      steer.clampLength(0, this.maxforce);
    }
    return steer;
  };

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  this.align = function(vehicles) {
    var neighbordist = 50;
    var sum = new THREE.Vector3(0, 0, 0);
    var count = 0;
    for (var i = 0; i < vehicles.length; i++) {
      var d = this.position.distanceTo(vehicles[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(vehicles[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.divideScalar(count);
      sum.normalize();
      sum.multiplyScalar(this.maxspeed);

      var steer = sum.clone();
      steer = steer.sub(this.velocity);
      // var steer = THREE.Vector3.sub(sum,this.velocity);
      steer.clampLength(-100, this.maxforce);
      return steer;
    } else {
      return new THREE.Vector3(0, 0, 0);
    }
  };

  // Cohesion
  // For the average location (i.e. center) of all nearby vehicles, calculate steering vector towards that location
  this.cohesion = function(vehicles) {
    var neighbordist = 50;
    var sum = new THREE.Vector3(0, 0, 0); // Start with empty vector to accumulate all locations
    var count = 0;
    for (var i = 0; i < vehicles.length; i++) {
      var d = this.position.distanceTo(vehicles[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(vehicles[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.divideScalar(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return new THREE.Vector3(0, 0, 0);
    }
  };
}