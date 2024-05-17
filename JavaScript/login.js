// se l'utente è loggato, viene impossibilitato ad accedere alla pagina login e viene reindirizzato alla pagina home
$(function () {
	$('body').hide();
	if (localStorage.getItem('isLoggedIn') === 'true') {
		window.location.href = '?p=home';
	}
	$('body').show();
});

// al click del bottone mostra/nascondi password, cambia l'icona e mostra/nasconde la password
$(".toggle-password").click(function () {
	$(this).find('i').toggleClass("fa-eye-slash fa-eye");
	var input = $($(this).attr("toggle"));
	if (input.attr("type") == "password") {
		input.attr("type", "text");
	} else {
		input.attr("type", "password");
	}
});

// funzione che viene chiamata quando l'utente inserisce un email o username non validi
function NotValid() {
	$('#username_email').addClass('error');
	$('#username_email').next('small').addClass('error');
	$('#username_email + small').text('Username o password non validi');
	$("#password").addClass('error');
	$("#password").next('small').addClass('error');
}

// rimuove stile di errore quando l'utente inizia a scrivere
$('#username_email').on('input', function () {
	$('#username_email').removeClass('error');
	$('#username_email').next('small').removeClass('error');
	$('#username_email').next('small').text('');
	$("#password").removeClass('error');
	$("#password").next('small').addClass('error');
});

$("#password").on('input', function () {
	$('#username_email').removeClass('error');
	$('#username_email').next('small').removeClass('error');
	$('#username_email').next('small').text('');
	$("#password").removeClass('error');
	$("#password").next('small').addClass('error');
});

function dberror() {
	console.log("Errore nel database");
}

// Funzione per impostare la modalità chiara
function setLightMode() {
	$("body").removeClass("night-mode").addClass("light-mode");
	localStorage.setItem('mode', 'light'); // Salva la modalità nella memoria locale
}

// Funzione per impostare la modalità scura
function setNightMode() {
	$("body").removeClass("light-mode").addClass("night-mode");
	localStorage.setItem('mode', 'night'); // Salva la modalità nella memoria locale
}

// Imposta la modalità al caricamento della pagina
function setModeOnLoad() {
	const savedMode = localStorage.getItem('mode');
	if (savedMode === 'night') {
		setNightMode();
	} else {
		setLightMode();
	}
}

// Chiamata alla funzione per impostare la modalità al caricamento della pagina
setModeOnLoad();


// al submit del form, controlla che l'utente esista nel database e che la password sia corretta e in caso positivo, lo reindirizza alla pagina home
// in caso negativo, mostra un messaggio di errore e non procede con il login
$('#login_form').submit(function (event) {
	event.preventDefault();

	var username_email = $(this).find('#username_email').val();
	var password = $(this).find('#password').val();

	$.ajax({
		type: $(this).attr('method'),
		url: 'handle_db.php',
		data: { username: username_email, password: password, funzione: 'login' },
		success: function (data) {
			if (data.trim() === '0') {
				NotValid();
			} else {
				var userData = JSON.parse(data);
				localStorage.setItem('isLoggedIn', true);
				localStorage.setItem('username', userData.username);
				localStorage.setItem('email', userData.email);
				window.location.href = '?p=home';
			}
		},
		error: function (xhr, status, error) {
			dberror();
		}
	});
});
