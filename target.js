//
//  target.cpp
//  Circadian
//
//  Created by Dane Filipczak on 7/11/17.
//
//

// #include "target.hpp"


// void Target::setup(ofVec3f pos){
//     position = pos;
// };


// void Target::setPosition(ofVec3f pos){
//     position = pos;
// };

// void Target::draw(){
//     ofPushMatrix();


//     ofTranslate(position.x, position.y, position.z);
//     //ofRotateX(90);
//     //ofRotate(angle);
//     //ofDrawCircle(0, 0, 0, 3);
//     //ofDrawPlane(100, 100);
//     ofDrawBox(100, 20, 100);
//     //ofDrawIcoSphere(0, 0, 0, r/2);
//     //ofDraw
//     //sphere.drawWireframe();
//     ofPopMatrix();
// }



function Target() {

    this.y;


    // var side = 1;
    // this.geometry = new THREE.BoxGeometry(side * 4, side, side * 4);
    // // this.material = new THREE.MeshPhongMaterial({
    // //     color: 0x00ff00
    // // });
    // var shader = THREE.FresnelShader;
    // var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    // uniforms["tCube"].value = textureCube;
    // this.material = new THREE.ShaderMaterial({
    //     uniforms: uniforms,
    //     vertexShader: shader.vertexShader,
    //     fragmentShader: shader.fragmentShader
    // });
    // this.cube = new THREE.Mesh(this.geometry, this.material);
    // scene.add(this.cube);
}

Target.prototype.setY = function(y) {
    this.y = y;
}

Target.prototype.update = function(){
    this.cube.position.setComponent(1, this.y);
}

setTargets = function(nn) {
    //given a midi note number, space out the targets to overtones of that note

    var fundamental = midifreq(nn);
    for (var i = 1; i < targets.length + 1; i++) {
        targets[i - 1].setY(freqmidi(fundamental * i) * nnworld);
        // targets[i-1].update();
    }
}

function midifreq(m) {
    //convert a midi note number to a frequency value
    return 27.5 * Math.pow(2, ((m - 21) / 12))
}

function freqmidi(f) {
    //convert a frequency value to a midi note number
    return (12 / Math.log(2)) * Math.log(f / 27.5) + 21;
}



// m = (12/ln(2)) * ln(f/27.5) + 21
// f = 27.5 * Math.pow(2, ((m - 21)/12))