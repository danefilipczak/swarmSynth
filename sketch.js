
var currentOver;
var currentActive;

var sketch = function (p5) {
	var keyboard;
	p5.setup = function(){
		c = p5.createCanvas(window.innerWidth, 100);
    	c.position(0, window.innerHeight-100-(100*0.318))
    	c.style("cursor", "pointer");
    	p5.background(10, 100)
    	var width = p5.width;
    	if(width>1200){width=1200};
    	keyboard = new Keyboard((p5.width-width)/2, window.innerHeight-200, width, p5.height, function(n){
    		setTargets(n);
    	})
    	p5.frameRate(24)
    	// keyboard.keys.forEach(function(k){
    	// 	if(k.nn==60){
    	// 		currentActive = k;
    	// 		k.active = true;
    	// 	}
    	// })
    	currentActive = new BlackKey()
    	// currentActive = keyboard.keys[0];
    	// keyboard.keys[0].active=true;
	}

	p5.draw = function(){
		p5.clear()
		// p5.background(10, 100)

		keyboard.display()
		keyboard.update()
	}

	p5.mousePressed = function(){

		if(currentOver){
		if(currentActive!==currentOver){
			console.log('different')
			currentActive.active=false
		}
		currentActive = currentOver;
		currentActive.active=true;
		}
		setTargets(currentActive.nn)


	}

}

p5 = new p5(sketch);