
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



// Class that wraps the easing functions
// Can be used in either delta or continuous mode
// in delta mode, you get small deltas
// in continuous mode, you get the full value
// after each update.

NCAnimation = function(start, end, updates, func)
{
	if(typeof(updates) == 'undefined')
	{
		updates = 30; // by default one second
	}

	if(typeof(func) == 'undefined')
	{
		func = easeInOutQuad;
	}

	this.totalFrames = updates;
	this.currentFrame = 0;
	this.startVal = start;
	this.lastVal = start;

	this.delta = end - start;
	this.easeFunc = func;
}

NCAnimation.prototype.update = function()
{
	this.lastVal = this.getValue();

	if(this.currentFrame < this.totalFrames)
	{
		++this.currentFrame;
	}

	return this.isFinished();
}

NCAnimation.prototype.isFinished = function()
{
	return this.currentFrame == this.totalFrames;
}

NCAnimation.prototype.getValue = function()
{

	return this.easeFunc(this.currentFrame, this.startVal, this.delta, this.totalFrames);
}

NCAnimation.prototype.getDelta = function()
{
	val = this.getValue();
	return val - this.lastVal;
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
	var ncanvas = this;
	$.getJSON("http://cfgapp.herokuapp.com/", function(data){ ncanvas.onData(data); });


	// test, draw 1000 circles.
	this.canvas = elem;
	paper.setup(this.canvas);

	///
	this.colors = {
		physics: "#Ff3c53",
		chemistry: "#FfEd51",
		economics: "#51AbFf",
		medicine: "#2AeD33",
		literature: "#Ed8A2a",
		peace: "#3Fd8Ef",
		faded: "#eEeEeE"
	};

	this.circles = [];
	this.springs = [];
	this.nodes = [];

	this.zoomAnimation = new NCAnimation(1, 1, 0);
	this.moveAnimationX = new NCAnimation(0, 0, 0);
	this.moveAnimationY = new NCAnimation(0, 0, 0);


	// debug
	//tool = new paper.Tool();
	//tool.onMouseDown = function(ev) { ncanvas.moveToPoint({x: -ev.point.x, y: -ev.point.y}); };

}

/// NodeSet functions
// _NSet creates a nodeset with all functions.
NCanvas.prototype._NSInit = function()
{
	this._nset = this.nodes;
}

// filter using a given predicate. returns a second nodeset, the eliminated nodes.
NCanvas.prototype._NSFilter = function(predicate)
{
	eliminated = [];
	_nset2 = [];
	for(var i = 0; i < this._nset.length; ++i)
	{
		if(predicate(this._nset[i]))
		{
			_nset2.push(this._nset[i]);
		}
		else
		{
			eliminated.push(this._nset[i]);
		}
	}

	this._nset = _nset2;
	return eliminated;
}

// current bounding rectangle of set.
NCanvas.prototype._NSBounds = function()
{
	// iterate through all. Select Min, Max, on XY
	var minX = 999999999, minY = 999999999;
	var maxX = -999999999, maxY = -999999999;

	for(var i = 0; i < this._nset.length; ++i)
	{
		e = this.circles[this._nset[i].id];

		if(e.position.x - e.radius < minX)
		{
			minX = e.position.x - e.radius;
		}

		if(e.position.y - e.radius < minY)
		{
			minY = e.position.y - e.radius;
		}

		if(e.position.x + e.radius > maxX)
		{
			maxX = e.position.x + e.radius;
		}

		if(e.position.y + e.radius > maxY)
		{
			maxY = e.position.y + e.radius;
		}
	}

	return {min: {x: minX, y: minY}, max: {x: maxX, y: maxY}};
}

// returns centre point of nodeset.
NCanvas.prototype._NSCentre = function()
{
	sumX = 0;
	sumY = 0;
	for(var i = 0; i < this._nset.length; ++i)
	{
		sumX += this.circles[this._nset[i].id].position.x;
		sumY += this.circles[this._nset[i].id].position.y;
	}

	sumX /= this._nset.length;
	sumY /= this._nset.length;

	return {x: sumX, y: sumY};
}

// indicates whether a node is in our nodeset.
NCanvas.prototype._NSContains = function(node)
{
	for(var i = 0; i < this._nset.length; ++i)
	{
		if(this._nset[i].id == node.id)
		{
			return true;
		}
	}
	return false;
}

// Select just 1 node
NCanvas.prototype._NSReduce = function()
{
	/* select one idx at random */

	ret = []
	idx = Math.floor(Math.random() * this._nset.length);
	for(var i = 0; i < this._nset.length; ++i)
	{
		if(i == idx)
		{
			continue;
		}
		else
		{
			ret.push(this._nset[i]);
		}
	}

	this._nset = Array(this._nset[idx]);
	return ret;
}

NCanvas.prototype._NSSize = function()
{
	return this._nset.length;
}

NCanvas.prototype._NSGet = function()
{
	return this._nset;
}

/// NAV functions

NCanvas.prototype.zoomOnBounds = function(bounds)
{
	// select either scale, and zoom in.
	// also init two animations.
	// select
	zoomX = paper.view.viewSize.width / (bounds.max.x - bounds.min.x) * 0.95;
	zoomY = paper.view.viewSize.height / (bounds.max.y - bounds.min.y) * 0.95;

	zoom = Math.min(zoomX, zoomY);
	this.zoomAnimation = new NCAnimation(paper.view.zoom, zoom, 30, easeInOutQuad);
}

NCanvas.prototype.moveToPoint = function(point, animate)
{
	if(typeof(animate) == 'undefined')
	{
		animate = true;
	}

	transX = point.x - paper.view.center.x;
	transY = point.y - paper.view.center.y;
	
	if(animate)
	{
		this.moveAnimationX = new NCAnimation(0, transX, 30, easeInOutQuad);
		this.moveAnimationY = new NCAnimation(0, transY, 30, easeInOutQuad);
	}
	else
	{
		paper.view.scrollBy(transX, transY);
	}
}


NCQuizState = {
	Init: 0,
	Science: 1,
	Humanities: 2, 
	PhCh: 3,
	EcMd: 4,
	Ph: 5, 
	Ch: 6, 
	Ec: 7,
	Md: 8,
	Peace: 9,
	Liter: 10,

	Period0: 11,
	Period1: 12,
	Period2: 13,
	Period3: 14,
	Period4: 15,
	Period5: 16,
	Period6: 17,

	Autumn: 20,
	Spring: 21,
	Summer: 22,
	Winter: 23,

	Finalise: 30
}


/// QUIZ functions
NCanvas.prototype.quizSetState = function(state)
{
	var grey = [];
	// case 
	switch(state)
	{
		case NCQuizState.Init:
			this._NSInit();
			break;


		case NCQuizState.Science:
			grey = this._NSFilter(function(node) {
				if(node.field == "physics" ||
					node.field == "chemistry" ||
					node.field == "economics" ||
					node.field == "medicine" )
				{
					return true;
				}

				return false;
			});
			break;

		case NCQuizState.Humanities:
			grey = this._NSFilter(function(node) {
				if(node.field == "literature" || node.field == "peace")
				{
					return true;
				}
				return false;
			});
			break;

		case NCQuizState.PhCh:
			grey = this._NSFilter(function(node) { 
				if(node.field == "physics" || node.field == "chemistry")
				{
					return true;
				}

				return false;
			});
			break;

		case NCQuizState.EcMd:
			grey = this._NSFilter(function(node) {
				if(node.field == "economics" || node.field == "medicine")
				{
					return true;
				}

				return false;
			});
			break;

		case NCQuizState.Ph:
			grey = this._NSFilter(function(node) {
				if(node.field == "physics")
				{
					return true;
				}

				return false;
			});
			break;

		case NCQuizState.Ch:
			grey = this._NSFilter(function(node) {
				if(node.field == "chemistry")
				{
					return true;
				}

				return false;
			});
			break;

		case NCQuizState.Ec:
			grey = this._NSFilter(function(node) {
				if(node.field == "economics")
				{
					return true;
				}

				return false;
			});
			break;


		case NCQuizState.Md:
			grey = this._NSFilter(function(node) {
				if(node.field == "medicine")
				{
					return true;
				}

				return false;
			});
			break;

		case NCQuizState.Peace:
			grey = this._NSFilter(function(node) {
				if(node.field == "peace")
				{
					return true;
				}

				return false;
			});
			break;

		case NCQuizState.Liter:
			grey = this._NSFilter(function(node) {
				if(node.field == "literature")
				{
					return true;
				}

				return false;
			});
			break;

		// Stage2/3
		case NCQuizState.Finalise:
			grey = this._NSReduce();

	}

	// grey out all the grey nodes
	for(var i = 0; i < grey.length; ++i)
	{
		this.circles[grey[i].id].fillColor = this.colors.faded;
	}

	// Find out the zoom
	this.zoomOnBounds(this._NSBounds());
	this.moveToPoint(this._NSCentre());
}



NCanvas.prototype.onData = function(data)
{

	// This is awful code. Oh god I am so sorry for doing this.
	// Whoever has the misfortune of reading this I would like to
	// deeply apologise for the carnage that follows.

	var sorted = [[], [], [], [], [], []];
	
	var phys = 0;
	var chem = 1;
	var econ = 2;
	var med = 3;
	var lit = 4;
	var peace = 5;
	var cats = [phys, chem, econ, med, lit, peace];


	// globals for NodeSet
	this.sorted_nodes = sorted;
	this.sorted_cats = cats;


	for(var i = 0; i < data.count; ++i)
	{
		switch(data[i].field)
		{
			case "physics":
				data[i].sid = sorted[phys].length;
				sorted[phys].push(data[i]);
				break;

			case "chemistry":
				data[i].sid = sorted[chem].length;
				sorted[chem].push(data[i]);
				break;

			case "economics":
				data[i].sid = sorted[econ].length;
				sorted[econ].push(data[i]);
				break;

			case "medicine":
				data[i].sid = sorted[med].length;
				sorted[med].push(data[i]);
				break;

			case "literature":
				data[i].sid = sorted[lit].length;
				sorted[lit].push(data[i]);
				break;

			case "peace":
				data[i].sid = sorted[peace].length;
				sorted[peace].push(data[i]);
		}
	}


	var fractions = [0, 0, 0, 0, 0, 0];
	for(var i = 0; i < cats.length; ++i)
	{
		fractions[i] = sorted[i].length / data.count;
	}

	/* circle radius anim */


	/* Concentric circle position assignment algo */
	var circle_no = 1;
	var radius = 8;
	this.circleRadiusAnim = new NCAnimation(1, radius, 20, easeInQuad);
	var min_margin = 2;
	var margin = min_margin;

	var idx = [0, 0, 0, 0, 0, 0];

	while(this.nodes.length < data.count)
	{
		
		var circumference = Math.PI * 2 * (min_margin + 2 * radius) * circle_no;
		var divs = Math.floor(circumference / (radius * 2 + min_margin));
		var margin = (circumference - radius * 2 * divs) / divs;
		
		// sectorisation
		var selector = 0;
		var frac_sum = fractions[selector];
		var switch_at = Math.round(divs * frac_sum);

		// space them radius + margin apart.
		for(var n = 0; n < divs; ++n)
		{
			x = Math.cos((Math.PI * 2 / divs) * n) * (min_margin + 2 * radius) * circle_no;
			y = Math.sin((Math.PI * 2 / divs) * n) * (min_margin + 2 * radius) * circle_no;

			var circle = new paper.Shape.Circle(new paper.Point(x + Math.random(), y + Math.random()), 1);

			if(n == switch_at)
			{
				++selector;
				frac_sum += fractions[selector];
				switch_at = Math.round(divs * frac_sum);
			}

			// make sure we don't exceed our count
			if(idx[selector] == sorted[selector].length)
			{
				continue;
			}


			switch(sorted[selector][idx[selector]].field)
			{
				case "physics":
					circle.fillColor = this.colors.physics;
					break;

				case "chemistry":
					circle.fillColor = this.colors.chemistry;
					break;

				case "economics":
					circle.fillColor = this.colors.economics;
					break;

				case "medicine":
					circle.fillColor = this.colors.medicine;
					break;

				case "literature":
					circle.fillColor = this.colors.literature;
					break;

				case "peace":
					circle.fillColor = this.colors.peace;
					break;

				default:
					circle.fillColor = this.colors.faded;
					break;
			};

			var spring = new NCSpring(circle.position.x, circle.position.y, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5, Math.random() * 75 + 40, Math.random() * 75 + 40);

			this.circles.push(circle);
			this.springs.push(spring);
			sorted[selector][idx[selector]].id = this.nodes.length;
			this.nodes.push(sorted[selector][idx[selector]]);
			++idx[selector];
		}
		++circle_no;
	}
	
	var ncanvas = this;
	paper.view.onFrame = function() 
	{
	 	ncanvas.onFrame();
	};

	paper.view.draw();


	// init the nodeset
	this._NSInit();
	this.zoomOnBounds(this._NSBounds());
	this.moveToPoint(this._NSCentre(), false);
}

NCanvas.prototype.onFrame = function()
{
	paper.view.pause();

	// circle radius anim
	if(!this.circleRadiusAnim.isFinished())
	{
		this.circleRadiusAnim.update();
		r = this.circleRadiusAnim.getValue();

		for(var i = 0; i < this.circles.length; ++i)
		{
			this.circles[i].radius = r;
		}
	}

	// zoom anim
	if(!this.zoomAnimation.isFinished())
	{
		this.zoomAnimation.update();
		paper.view.zoom = this.zoomAnimation.getValue();
	}

	// translate anim
	if(!this.moveAnimationX.isFinished())
	{
		this.moveAnimationX.update();
		paper.view.scrollBy(this.moveAnimationX.getDelta(), 0);
	}

	if(!this.moveAnimationY.isFinished())
	{
		this.moveAnimationY.update();
		paper.view.scrollBy(0, this.moveAnimationY.getDelta());
	}

	// spring animation
	for(var i = 0; i < this.circles.length; ++i)
	{

		p = this.springs[i].update();

		this.circles[i].position.x = p.x;
		this.circles[i].position.y = p.y;
	}

	paper.view.play();
}
