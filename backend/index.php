<!DOCTYPE html>
<html>
  <head>
	<meta charset='utf-8'>
	<meta name="description" content="Codeforgoodsolution : Nobel prize thingy">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,400,300,600,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" media="screen" href="stylesheets/index.css">
	<script src="js/paper-full.js"></script>
	<script src="js/jquery-1.11.1.js"></script>
	<script src="js/easing.js"></script>
	<script src="js/canvas.js"></script>
	<script type="text/javascript">
	window.onload = function() 
	{
		var canvas = document.getElementById("canvas-woo");
		window.ncanvas = new NCanvas(canvas);
		//ncanvas.quizSetState(NCQuizState.Init);
	}

	</script>
	<script type="text/javascript" src="javascripts/main.js"></script>

	<title>NobelGraph</title>
  </head>

  <body>
  	<div id="mainContainer">
		<div id="quizCanvas">
			<div class="container">
				<input id="mainInput" class="transition" type="text" placeholder="Which Nobel Prize Laureate are You?">
			</div>
			<div class="rightContainer">
				<div id="helpYou" class="transition-short">
					Let Us help You.
				</div>
				<div class="questionCanvas transition-short">
					<div class="questionTitle">Feel Sciency?</div>
					<div class="answerButton left transition-short">Sure</div>
					<div class="answerButton right transition-short">Not Really</div>
				</div>
				<div class="resultPage transition">
					<div class='entry' id="name"></div>
					<div class='entry' id="area">Area of development: </div>
					<div class='entry' id="year">Won award in year: </div>
					<div class='entry' id="motivation">Motivation: </div>
				</div>
			</div>
			
		</div>  
		<canvas style="width: 100%; height: 450px;" id="canvas-woo">get a canvas compatible browser.</canvas>
		
  	</div>

  </body>
</html>
