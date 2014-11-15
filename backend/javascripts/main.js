// console.log('This would be the main JS file.');
var curentQuestion = 0;
var maxNoQuestions = 4;

$(document).ready(function () {

	 initialiseQuestionPositions () ;

	$('#mainInput').css({'opacity': 1, 'margin-top':'100px'});

	setTimeout(function () {
			$('#helpYou').css({'opacity': 1});
	},600);

	$(document).on('click','#helpYou', function () {

		$('#helpYou').css({'opacity': 0, 'margin-top':'-50px'});
		
		setTimeout(function () {
			$('.questionCanvas').fadeIn(500);
		},300);
		
	})

	$(document).on('focus','#mainInput', function () {

		$('#mainInput').attr('placeholder', '');

	});

	$(document).on('blur','#mainInput', function () {

		$('#mainInput').attr('placeholder', 'Which Nobel Prize Laureate are You?');

	});

	$(document).on('click','.answerButton', function () {

		nextQuestion();
		
	});

	$(document).on('keyup','#mainInput', function () {

		feedDataToFilter($('#mainInput')val());
		
	});

});

function initialiseQuestionPositions () 
{
	questions = ['Are you a people-oriented person','Do ethical issues concern you?','Which was the most revolutionary technology?'];
	answerLeft = ['Yes','Usually Yes','the Radio'];
	answerRight = ['Not really','Not really','the TV'];

	output = '';

	for (var i = 0; i < questions.length ; i++) 
	{
		output += '<div class="questionCanvas transition blind">'+
	'<div class="questionTitle">'+questions[i]+'?</div>'+
	'<div class="answerButton left transition-short">'+answerLeft[i]+'</div>'+
	'<div class="answerButton right transition-short">'+answerRight[i]+'</div>'+
	'</div>';
	};

	$('.rightContainer').append(output);

}

function nextQuestion () {
	//alert('x')
	$('.questionCanvas')[curentQuestion].style.display = 'none';

	++curentQuestion;

	if (curentQuestion == maxNoQuestions) {
		alert('reached end');
		return;
	};

	$('.questionCanvas')[curentQuestion].style.opacity = 1;
}

function getAllLaureates () {
		$.post('fetchLaureates.php', {
			'token' : 'laureate'
			}, function(data) 
			{
				//alert(data)
				$(document).ready(function() 
				{
					var laureates = JSON.parse(data);
					//console.log(laureates);
					return laureates;
				});
			});

}

function getAllLaureatesByCountry (country) {
		$.post('fetchLaureates.php', {
			'token' : 'country',
			'country' : country
			}, function(data) 
			{
				//alert(data)
				$(document).ready(function() 
				{
					var laureates = JSON.parse(data);
					console.log(laureates);
					//return laureates;
				});
			});
}


// // level1
// var level1Questions = ["Are you a people-oriented person?","Do you consider yourself to be an artsy type?","Do you see the world in black and white or shades of grey?"];
// var level1AnswerA = ["Definetely","Maybe","Shades"];
// var level1AnswerB = ["People? What are those?","Not really","Black and White"];
// // level2 question[0] - [2] are for Humanities  level two, [3] - [5] are for Ph-CH(a) / EcMed(b)
// var level2Questions = ["Do ethical issues concern you?","Would you rather help others by donating or by volunteering?","Do you enjoy reading?", "Are you driven more by financial gain or curiosity?", ""];
// var level2AnswerA = ["Yes","Volunteering","Not really", "Curiosity", ];
// var level2AnswerB = ["Not really","Donating","Yes, I do.", "Financial"]; 
// //level 3 
// var level3Questions = [];
// var level3AnswerA = [];
// var level3AnswerB = [];
// // level 4
// var level4Questions = ["What's your favourite car?", "Which was the most revolutionary technology?",  ];
// var level4AnwserA = ["Ford T", "Radio", ];
// var level4AnwserB = ["Tesla S", "TV, "];
// // level 5
// var level5Questions = ["What is your favourite book ?"];
// var level5AnswerA = ["Lord of the rings"];
// var level5Answer = ["Harry Potter"];
// // level 6 4 paints, question depends on year from level 5 question
// var level6Questions = [];
// var level6AnswerA = [];
// var level6AnswerB = [];

// function nextQuestion(){
// 	for(int i = 0;i<=7;i++)
// 		if (i )
	
// 	}