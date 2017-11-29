


var sketch = function (p5) {
	var keyboard;
	p5.setup = function(){
		c = p5.createCanvas(window.innerWidth, 150);
    	c.position(0, window.innerHeight-200)
    	p5.background(10, 100)
    	keyboard = new Keyboard(0, window.innerHeight-200, p5.width, p5.height, function(n){
    		setTargets(n);
    	})
	}

	p5.draw = function(){
		p5.clear()
		// p5.background(10, 100)
		keyboard.display()
	}

}

p5 = new p5(sketch);