
// Spring class
NCSpring = function(ox, oy, dx, dy, rx, ry)
{
	this.rateX = rx;
	this.rateY = ry;

	// diff coords
	this.dY = dy;
	this.dX = dx;

	// origin coords
	this.oX = ox;
	this.oY = oy;

	this.frames = 0;
}

NCSpring.prototype.update = function()
{
	var ret = {x: this.oX + this.dX * Math.sin(Math.PI * (this.frames / this.rateX)), y: this.oY + this.dY * Math.sin(Math.PI * (this.frames / this.rateY))};
	++this.frames;

	return ret;
}

NCanvas = function(elem)
{
	if(typeof(paper) == 'undefined')
	{
		console.log("PaperJS not found. Terminating.");
		return;
	}

	if(typeof($) == 'undefined')
	{
		console.log("jQuery not found. Termnating.");
		return;
	}

	// load data


/*
	// test, draw 1000 circles.
	this.canvas = elem;
	paper.setup(this.canvas);

	// add 1000 circles, move them a bit on each frame?
	this.circles = [];
	this.springs = [];

	for(var i = 0; i < 1000; ++i)
	{
		var circle = new paper.Shape.Circle(new paper.Point(Math.random() * 500, Math.random() * 500), 5);
		circle.strokeColor = "black";
		circle.fillColor = "red";

		var spring = new NCSpring(circle.position.x, circle.position.y, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5§x, Math.random() * 25 + 25, Math.random() * 25 + 25);

		this.circles.push(circle);
		this.springs.push(spring);
	}

	paper.view.draw();

*/




	// onframe boilerplate.
	var ncanvas = this;
	paper.view.onFrame = function() 
	{
	 	ncanvas.onFrame();
	};

}

NCanvas.prototype.onFrame = function()
{
	// shiv.
	return;

	// iterate through all 1k circles, moving them slightly.
	paper.view.pause();
	for(var i = 0; i < 1000; ++i)
	{

		p = this.springs[i].update();

		if(i == 0)
		{
			console.log(p.x);
			console.log(this.springs[i].dX);
		}
		this.circles[i].position.x = p.x;
		this.circles[i].position.y = p.y;
	}
	paper.view.play();
	
	console.log("Frame.");
}






// Quiz API
