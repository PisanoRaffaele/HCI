const images = [
	'assets/memory/1.png',
	'assets/memory/2.png',
	'assets/memory/3.png',
	'assets/memory/4.png',
	'assets/memory/5.png',
	'assets/memory/6.png',
	'assets/memory/7.png',
	'assets/memory/8.png',
];

let firstCard = null;
let secondCard = null;
let cardsMatched = 0;
let generatedNumbers = [];
let time = 0.0;
let countdown;
let gameStarted = false;

const gridItems = $('.grid-item');

// Funzione per generare un numero casuale
function generateRandomNumber() {
	let randomNumber = 0;

	if (generatedNumbers.length === 16) {
		return -1;
	}

	do {
		randomNumber = Math.floor(Math.random() * 8);
	} while (generatedNumbers.filter(n => n === randomNumber).length >= 2);

	generatedNumbers.push(randomNumber);

	return randomNumber;
}

// Funzione per mescolare le carte
function shuffle(array) {
	let currentIndex = array.length;
	let temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Funzione per impostare l'immagine di una carta
function setImage(card, index) {
	const img = $('<img>').attr('src', images[index]);
	card.append(img);
}

// Funzione per girare una carta
function flipCard(card) {
	card.removeClass('hidden').addClass('visible');
}

// Funzione per nascondere una carta
function hideCard(card) {
	card.removeClass('visible').addClass('hidden');
}

// Funzione per controllare se due carte sono uguali
function cardsMatch(card1, card2) {
	const img1 = card1.find('img');
	const img2 = card2.find('img');
	return img1.attr('src') === img2.attr('src');
}

// Funzione per gestire il click su una carta prende come parametro l'evento che ha scatenato la funzione
function handleCardClick(event) {
	const card = $(event.currentTarget);

	if (!gameStarted) {
		gameStarted = true;
		countdown = setInterval(function () {
			time += 0.1;
			time = parseFloat(time.toFixed(2));
			$('#time').text(time);
		}, 100);
	}

	// La carta è già stata girata o è la stessa carta cliccata in precedenza o è già stata trovata un'altra carta
	if (!card.hasClass('hidden') || firstCard === card || secondCard) {
		return;
	}

	flipCard(card);

	if (!firstCard) firstCard = card;
	else {
		secondCard = card;
		// Le due carte sono uguali
		if (cardsMatch(firstCard, secondCard)) {
			cardsMatched += 2;
			firstCard = null;
			secondCard = null;
			if (cardsMatched === 16) vittoria();
		}
		else {
			setTimeout(() => {
				hideCard(firstCard);
				hideCard(secondCard);
				firstCard = null;
				secondCard = null;
			}, 1000);
		}
	}
}

// Funzione per inizializzare il gioco
function initGame() {
	gridItems.each(function (i) {
		const card = $(this);
		const index = generateRandomNumber();

		hideCard(card);
		setImage(card, index);
		card.on('click', handleCardClick);
	});
	shuffle(images);
}

// Funzione per resettare il gioco
function resetGame() {
	firstCard = null;
	secondCard = null;
	cardsMatched = 0;
	generatedNumbers = [];
	gameStarted = false;
	clearInterval(countdown);
	time = 0;
	$('#time').text(time);
	gridItems.each(function () {
		const card = $(this);
		card.find('img').remove();
	});
	initGame();
}

// Funzione chiamata a fine partita per aggiornare la classifica
function vittoria() {
	gameStarted = false;
	clearInterval(countdown);
	var error = 0;
	aggiornaClassifica().then(function(result) {
		error = result;
	});
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
			resetGame();
		});
	}, 1000);
}

$(function () {
	get_classifica();
	initGame();
	$('#reset-btn').on('click', resetGame);
});


/****************************** Gestione Classifica ******************************/

// ottiene la classifica dal database, crea una tabella html e l'aggiunge all'oggetto con id specificato
function get_classifica() {
	$.ajax({
		type: "POST",
		url: "handle_db.php",
		data: { gioco: "MEMORY", funzione: "richiedi_classifica", order: "reverse" },
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
			data: { gioco: "MEMORY", order: "reverse", funzione: "aggiorna_classifica", punteggio: time, username: username, email: email },
			success: function (data) {
				var lines = data.split("\n");
				if (lines[0] == '-42\r') {
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



