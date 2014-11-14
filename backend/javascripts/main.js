console.log('This would be the main JS file.');

$(document).ready(function () {
	getAllLaureates ();
});

function getAllLaureates () {
		$.post('fetchLaureates.php', {
			'token' : 'laureate'
			}, function(data) 
			{
				//alert(data)
				$(document).ready(function() 
				{
					var laureates = JSON.parse(data);
					console.log(laureates);
				});
			});
}