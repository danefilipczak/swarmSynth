function WhiteKey(x_, y_, w_, h_) {
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;
	this.over = false;
	this.active = false;

	this.display = function() {
		p5.rectMode(p5.CORNER)
		// p5.fill(255, 255, 100, 100)
		
		p5.stroke(200)
		p5.strokeWeight(1)
		this.over ? p5.fill(255, 35, 35) : p5.noFill();
		if(this.active){p5.fill(0, 255, 255)}
		p5.rect(this.x, this.y, this.w, this.h-1)
		this.over=false;
	}

	this.checkOver = function(){
		// this.over = false;
		x = p5.mouseX;
		y = p5.mouseY;
		if(x>this.x&&x<this.x+this.w&&y>this.y&&y<this.y+this.h){
			this.over = true;
			console.log('over')
		}
		return this.over;
	}

}

function BlackKey(x_, y_, w_, h_) {
	this.x = x_;
	this.y = y_;
	this.w = w_;
	this.h = h_;
	this.active = false;
	this.over = false;

	this.display = function() {
		// p5.rectMode(p5.CENTER)
		// p5.fill(255, 255, 100, 100)
		p5.noFill()
		p5.stroke(150)
		p5.strokeWeight(1)
		this.over ? p5.fill(255, 35, 35) : p5.fill(25);
		if(this.active){p5.fill(0, 255, 255)}
		p5.rect(this.x, this.y, this.w-5, this.h-1)
		this.over=false;
	}

	this.checkOver = function(){
		// this.over=false;
		x = p5.mouseX;
		y = p5.mouseY;
		if(x>this.x&&x<this.x+this.w&&y>this.y&&y<this.y+this.h){
			this.over = true;
		}
		return this.over;
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

Keyboard.prototype.update = function(){
	for(var i = 0; i<this.keys.length; i++){
		if(this.keys[i].checkOver()){
			currentOver = this.keys[i];
			break;
		}
		currentOver=null;
	}
}

Keyboard.prototype.display = function() {
	for(var i = this.keys.length-1; i>=0; i--){
		this.keys[i].display();
	}
}

Keyboard.prototype.populate = function(){
	var whiteKeys = [];
	var blackKeys = [];
	var i = 0;
	var w = 40;
	var remainder = this.width%w;
	while((i+1)*w<this.width){
		whiteKeys.push(new WhiteKey(this.x+(w*i+(remainder/2)), 0, w, this.height))
		i++;
	}

	var j = 0;
	while((j+2)*w<this.width){
		if(j%7!=2&&j%7!=6){
			blackKeys.push(new BlackKey(this.x+(w*j+(remainder/2)+(w/2)), 0, w, this.height*0.618))
			
		}
		j++;
	}
	this.keys = blackKeys.concat(whiteKeys)
}