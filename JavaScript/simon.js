var colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "white"];
var sequence = [];
var playing = false;
var level = 1;

// funzione per generare una sequenza di n colori casuali
function generateSequence(n) {
    var sequence = [];
    for (var i = 0; i < n; i++) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(color);
    }
    return sequence;
}

// funzione per riprodurre una sequenza di colori
function playSequence(sequence) {
    var i = 0;
    var interval = setInterval(function () {
        var color = sequence[i];
        highlight(color);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
        }
    }, 1000);
}

// funzione per evidenziare un colore per un breve periodo di tempo
function highlight(color) {
    var element = $(".color." + color);
    element.addClass("highlight");
    setTimeout(function () {
        element.removeClass("highlight");
    }, 600);
}

// gestore evento click sul pulsante "Start"
$("#start-btn").on("click", function () {
    if (!playing) {
        playing = true;
        sequence = generateSequence(level);
        playSequence(sequence);
        $(this).text("Playing...");
        $('#level').text(level);
    }
});

// gestore evento click sui colori
$(".color").on("click", function () {
    if (playing) {
        var color = $(this).attr("class").split(" ")[1];
        highlight(color);
        if (color === sequence[0]) {
            sequence.shift();
            if (sequence.length === 0) {
                playing = false;
                level++;
                $("#start-btn").text("Next Level");
            }
        } else {
            var error = 0;
            aggiornaClassifica().then(function(result) {
                error = result;
            });
            setTimeout(function () {
                playing = false;
                html = '<h1>Game Over!</h1><p>Your score is: ' + level + '</p><button id="reset-alert-btn">Play Again</button>';
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
                    level = 1;
                    $('#level').text(level);
                    $("#start-btn").text("Start");
                });
            }, 100);
        }
    }
});


$(function () {
    get_classifica();
});


/****************************** Gestione Classifica ******************************/

// ottiene la classifica dal database, crea una tabella html e l'aggiunge all'oggetto con id specificato
function get_classifica() {
    $.ajax({
        type: "POST",
        url: "handle_db.php",
        data: { gioco: "SIMON", funzione: "richiedi_classifica", order: "notReverse" },
        dataType: "json",
        success: function (response) {
            var count = 0;
            var html = '<h1 class="textSide">Leaderboard</h1>'
            html += '<table><thead><tr><th>Rank</th><th>Username</th><th>Level</th></tr></thead><tbody>';
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
            data: { gioco: "SIMON", order: "notReverse", funzione: "aggiorna_classifica", punteggio: level, username: username, email: email },
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
