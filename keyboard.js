function WhiteKey(x_, y_, w_, h_) {
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;

	this.display = function() {
		p5.rectMode(p5.CORNER)
		// p5.fill(255, 255, 100, 100)
		p5.noFill()
		p5.stroke(200)
		p5.strokeWeight(1)
		p5.rect(this.x, this.y, this.w, this.h-1)
	}

}

function BlackKey(x_, y_, w_, h_) {
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;

	this.display = function() {
		// p5.rectMode(p5.CENTER)
		// p5.fill(255, 255, 100, 100)
		p5.noFill()
		p5.stroke(0)
		p5.strokeWeight(1)
		p5.fill(25)
		p5.rect(this.x, this.y, this.w-5, this.h-1)
	}

}


function Keyboard(x_, y_, width_, height_, onClick) {
	this.x = x_;
	this.y = y_;
	this.width = width_;
	this.height = height_;
	this.keys = []
	this.populate()



}

Keyboard.prototype.display = function() {
	this.keys.forEach(function(k) {
		k.display()
	})
}

Keyboard.prototype.populate = function(){
	var whiteKeys = [];
	var blackKeys = [];
	var i = 0;
	var w = 40;
	var remainder = this.width%w;
	while((i+1)*w<this.width){
		whiteKeys.push(new WhiteKey(w*i+(remainder/2), 0, w, this.height))
		i++;
	}

	var j = 0;
	while((j+2)*w<this.width){
		if(j%7!=2&&j%7!=6){
			blackKeys.push(new BlackKey(w*j+(remainder/2)+(w/2), 0, w, this.height*0.618))
			
		}
		j++;
	}
	this.keys = whiteKeys.concat(blackKeys)
}