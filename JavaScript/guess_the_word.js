var words = [
	// "banana",
	// "chocolate",
	// "computer",
	// "pizza",
	// "programming",
	// "sunglasses",
	// "watermelon",
	"ciao"
];

var word;
var letters;
var underscores;
var guessesRemaining;
var time = 0.0;
var countdown;
var Started = false;


// fa partire il gioco e il tempo trascorso, sceglie una parola random da words e la mostra come underscores
function initGame() {
	$('#reset-btn').text('Reset');

	$('#guess-btn').removeClass('unvisible');

	$('#letter').addClass("visible");
	guessesRemaining = 7;
	$("#guesses").text("Attempts left: " + guessesRemaining);
	word = words[Math.floor(Math.random() * words.length)];
	letters = word.split("");
	underscores = [];
	for (var i = 0; i < letters.length; i++) {
		underscores.push("_");
	}
	$("#word").text(underscores.join(" "));

	Started = true;

	time = 0.0;
	countdown = setInterval(function () {
		time += 0.1;
		time = parseFloat(time.toFixed(2));
		$('#time').text(time);
	}, 100);
}



// verifica la lettera inserita è contenuta nella parola, se è contenuta la mostra al posto degli underscores
// se il numero di tentativi rimasti è 0 o se non ci sono più underscores, il gioco finisce
$("#guess-btn").on("click", function () {
	if (Started) {
		var letter = $("#letter").val().toLowerCase();
		if (letter && /^[a-z]$/.test(letter)) {
			var found = false;
			for (var i = 0; i < letters.length; i++) {
				if (letters[i] === letter) {
					underscores[i] = letter;
					found = true;
				}
			}
			if (!found) {
				guessesRemaining--;
				$("#guesses").text("Attempts left: " + guessesRemaining);
			}
			$("#word").text(underscores.join(" "));
			if (underscores.indexOf("_") === -1) {
				var error = 0;
				aggiornaClassifica().then(function(result) {
					error = result;
				});
				clearInterval(countdown);
				setTimeout(function () {

					html = '<h1>Game Over!</h1><p>Your score is: ' + time + 's</p><button id="reset-alert-btn">Play Again</button>';
					if (error == 1) {
						html += "<div class='warn'><p>Sorry! At the moment we can't update the Leaderboard</p>";
					}
					else if (error == 2) {
						html += '<div class="warn"><p>Need to login to save your score!</p>';
					}
					else {
						html += '<div class="warn-g"><p>Score saved!</p>';
					}
					html += '</div><p>Share your score:</p><div class="alert-links"><a href="#" class="footer-link"><i class="fab fa-facebook-f"></i></a><a href="#" class="footer-link"><i class="fab fa-twitter">';
					html += '</i></a><a href="#" class="footer-link"><i class="fas fa-envelope"></i></a><a href="#" class="footer-link"><i class="fab fa-instagram"></i></a></div>';
					$('.alert').addClass('show');
					$('.alert').html(html);
					$('main').addClass('blur');
					$('footer').addClass('blur');
					$('#reset-alert-btn').click(function () {
						$('.alert').removeClass('show');
						$('.alert').html('');
						$('main').removeClass('blur');
						$('footer').removeClass('blur');
					});
				}, 100);
				$('#guess-btn').addClass('unvisible');
			} else if (guessesRemaining === 0) {
				clearInterval(countdown);
				html = '<h1>Game Over!</h1><p style="text-align: center;">We are sorry! <br> The word was: "' + word + '"</p><button id="reset-alert-btn">Play Again</button>';
				$('.alert').addClass('show');
				$('.alert').html(html);
				$('main').addClass('blur');
				$('footer').addClass('blur');
				$('#reset-alert-btn').click(function () {
					$('.alert').removeClass('show');
					$('.alert').html('');
					$('main').removeClass('blur');
					$('footer').removeClass('blur');
				});
				$('#guess-btn').addClass('unvisible');
			}
			$("#letter").val("");
		}
		else {
			$(".text-availabilty").text("Need to insert a letter!");
			$(".text-availabilty").addClass('error');
		}
	}
});

$('#letter').on('input', function () {
	$(".text-availabilty").text("");
	$(".text-availabilty").removeClass('error');
});

// resetta il gioco e le variabili di gioco
$("#reset-btn").on("click", function () {
	if (Started) {
		$('#reset-btn').text('Start');
		Started = false;
		time = 0;
		$("#guesses").text("");
		$("#word").text("");
		$('#time').text(time);
		$('#letter').removeClass("visible");
		clearInterval(countdown);
		$('#guess-btn').addClass('unvisible');
	}
	else {
		initGame();
	}
});


// ottiene la classifica dal database e la aggiunge alla pagina
$(() => {
	get_classifica();
});


/****************************** Gestione Classifica ******************************/

// ottiene la classifica dal database, crea una tabella html e l'aggiunge all'oggetto con id specificato
function get_classifica() {
	$.ajax({
		type: "POST",
		url: "handle_db.php",
		data: { gioco: "GTW", funzione: "richiedi_classifica", order: "reverse" },
		dataType: "json",
		success: function (response) {
			var count = 0;
			var html = '<h1 class="textSide">Leaderboard</h1>'
			html += '<table><thead><tr><th>Rank</th><th>Username</th><th>Time</th></tr></thead><tbody>';
			$.each(response, function (i, item) {
				count = count + 1;
				html += '<tr><td>' + (i + 1) + '</td><td>' + item.username + '</td><td>' + item.punteggio + 's</td></tr>';
			});
			if (count == 0 ) {
				html += '<tr><td></td><td>(No Scores yet)</td><td></td></tr>';
			}
			html += '</tbody></table>';
			$('.classifica').html(html);
		},
		error: function (xhr, status, error) {
			$('.classifica').html('<h1 class="textSide">Leaderboard</h1><p>We are sorry,<br> the server is currently down.<br>Unable to load the Leaderboard</p>');
		}
	});
};

// aggiorna la classifica nel database
function aggiornaClassifica() {
	return new Promise((resolve) => {
		var logged = localStorage.getItem('isLoggedIn');
		if (logged == "null" || logged === "false"){
			resolve(2);
			return;
		}
		var username = localStorage.getItem('username');
		var email = localStorage.getItem('email');
		$.ajax({
			type: "POST",
			url: "handle_db.php",
			data: { gioco: "GTW", order: "reverse", funzione: "aggiorna_classifica", punteggio: time, username: username, email: email },
			success: function (data) {
				var lines = data.split("\n");
				if (lines[lines.length - 1] == -42) {
					resolve(1);
					return;
				}
				get_classifica();
				resolve(0);
			},
			error: function (xhr, status, error) {
				console.log(xhr.responseText);
				resolve(1);
			}
		});
	});
}
