// ottiene la classifica dei giochi dal database, crea una tabella html e l'aggiunge all'oggetto con id specificato
function get_classifica(id, revers, game) {
	$.ajax({
		type: "POST",
		url: "handle_db.php",
		data: { gioco: game, funzione: "richiedi_classifica", order: revers },
		dataType: "json",
		success: function (response) {
			var count = 0;
			var html = '<h1 class="textSide">Leaderboard</h1>'
			html += '<table><thead><tr><th>Posizione</th><th>Username</th><th>Punteggio</th></tr></thead><tbody>';
			$.each(response, function (i, item) {
				count = count + 1;
				html += '<tr><td>' + (i + 1) + '</td><td>' + item.username + '</td><td>' + item.punteggio + '</td></tr>';
			});
			if (count == 0 ) {
				html += '<tr><td>1</td><td>(No Scores yet)</td><td>0</td></tr>';
			}
			html += '</tbody></table>';
			$(id).html(html);
		},
		error: function (xhr, status, error) {
			$('.classifica').html('<h1 class="textSide">Leaderboard</h1><p>We are sorry,<br> the server is currently down.<br>Unable to load the Leaderboard</p>');
		}
	});
};

// chiama la funzione get_classifica per ogni gioco
$(() => {
	get_classifica('#classifica1', 'reverse', 'MEMORY');
	get_classifica('#classifica2', 'notReverse', 'DOT');
	get_classifica('#classifica3', 'notReverse', 'SIMON');
	get_classifica('#classifica4', 'reverse', 'GTW');
})
