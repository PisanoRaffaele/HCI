$(() => {
	var score = 0;
	var time = 1;
	var countdown;
	var gameStarted = false;

	// fa partire il gioco, gestisce il punteggio. Usando la fuzione setInterval e setTimeout viene gestito
	// il conto alla rovescia e il tempo di attesa prima di aggiornare la classifica
	function startGame() {
		gameStarted = true;
		score++;
		$('#score').text(score);

		$('#dot').click(function () {
			score++;
			$('#score').text(score);
		});

		countdown = setInterval(function () {
			time--;
			$('#time').text(time);

			if (time == 0) {
				clearInterval(countdown);
				$('#dot').unbind();
				setTimeout(function () {
					html = '<h1>Game Over!</h1><p>Your score is: ' + score + '</p><button id="reset-alert-btn">Play Again</button>';
					$('.alert').addClass('show');
					$('.alert').html(html);
					$('main').addClass('blur');
					$('footer').addClass('blur');

					$('#reset-alert-btn').click(function () {
						$('.alert').removeClass('show');
						$('.alert').html('');
						$('main').removeClass('blur');
						$('footer').removeClass('blur');
						score = 0;
						time = 10;
						$('#score').text(score);
						$('#time').text(time);
						clearInterval(countdown);
						$('#dot').unbind();
						gameStarted = false;
						$('#dot').click(function () {
							if (!gameStarted) {
								startGame();
							}
						});
					});
					aggiornaClassifica();
				}, 100);
				gameStarted = false;
			}
		}, 1000);
	}

	// resetta il gioco e le variabili di gioco
	$('#reset-btn').click(function () {
		score = 0;
		time = 10;
		$('#score').text(score);
		$('#time').text(time);
		clearInterval(countdown);
		$('#dot').unbind();
		gameStarted = false;
		$('#dot').click(function () {
			if (!gameStarted) {
				startGame();
			}
		});
	});

	// fa partire il gioco
	$('#dot').click(function () {
		if (!gameStarted) {
			startGame();
		}
	});

	// ottiene la classifica dal database e la aggiunge alla pagina
	$(function () {
		get_classifica();
	});

	/****************************** Gestione Classifica ******************************/

	// ottiene la classifica dal database, crea una tabella html e l'aggiunge all'oggetto con id specificato
	function get_classifica() {
		$.ajax({
			type: "POST",
			url: "handle_db.php",
			data: { gioco: "DOT", funzione: "richiedi_classifica", order: "notReverse" },
			dataType: "json",
			success: function (response) {
				var count = 0;
				var html = '<h1 class="textSide">Leaderboard</h1>'
				html += '<table><thead><tr><th>Rank</th><th>Username</th><th>Clicks</th></tr></thead><tbody>';
				$.each(response, function (i, item) {
					count = count + 1;
					html += '<tr><td>' + (i + 1) + '</td><td>' + item.username + '</td><td>' + item.punteggio + '</td></tr>';
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
		var logged = localStorage.getItem('isLoggedIn');
		if (logged == "null" || logged === "false")
			return;
		var username = localStorage.getItem('username');
		var email = localStorage.getItem('email');
		$.ajax({
			type: "POST",
			url: "handle_db.php",
			data: { gioco: "DOT", order: "notReverse", funzione: "aggiorna_classifica", punteggio: score, username: username, email: email },
			success: function (data) {
				get_classifica();
			},
			error: function (xhr, status, error) {
			}
		});
	}


});


/************************* Alert *************************/

function showAlert(html) {

}


