// se l'utente è loggato, viene impossibilitato ad accedere alla pagina registrazione e viene reindirizzato alla pagina home
$(function () {
	$('body').hide();
	if (localStorage.getItem('isLoggedIn') === 'true') {
		window.location.href = '?p=home';
	}
	$('body').show();
});

// funzione per mostrare/nascondere la password
$(".toggle-password").click(function () {
	$(this).find('i').toggleClass("fa-eye-slash fa-eye");
	var input = $($(this).attr("toggle"));
	if (input.attr("type") == "password") {
		input.attr("type", "text");
	} else {
		input.attr("type", "password");
	}
});

// funzione per mostrare/nascondere la repeat password
$(".toggle-re_password").click(function () {
	$(this).find('i').toggleClass("fa-eye-slash fa-eye");
	var input = $($(this).attr("toggle"));
	if (input.attr("type") == "password") {
		input.attr("type", "text");
	} else {
		input.attr("type", "password");
	}
});

// applica stili css in caso di errore
function already_exist() {
	$('#email').addClass('error');
	$('#email').next('small').addClass('error');
	$('#email + small').text('This email is already registered, try to login');
	$('#username').removeClass('error');
	$('#username').next('small').removeClass('error');
	$('#username').next('small').text('');
}

// controlla se l'username è già in uso e applica stili css in caso di errore o successo
$('#username').on('input', function () {
	var username = $(this).val();
	if (!username) {
		$('#username').removeClass('error');
		$('#username').next('small').text('');
		return;
	}
	$.ajax({
		type: 'POST',
		url: 'handle_db.php',
		data: { username: username, funzione: 'check_username' },
		success: function (data) {
			if (data == 1) {
				$('#username').addClass('error');
				$('#username').next('small').removeClass('available').addClass('error');
				$('#username').next('small').text('Username already in use');
			}
			else {
				$('#username').removeClass('error');
				$('#username').next('small').removeClass('error').addClass('available');
				$('#username').next('small').text('Username available');
			}
		},
		error: function (xhr, status, error) {
			console.log("Errore: " + xhr.responseText);
		}
	});
});

// rimuove stili css alla pressione di un tasto
$('#email').on('input', function () {
	var email = $(this).val();
	if (email === '') {
		$('#email').removeClass('error');
		$('#email').next('small').text('');
		return;
	}
});

// verifica che la password sia lunga almeno 8 caratteri e applica stili css in caso di errore e li rimuove al focus
$("#password").on({
	"blur": function () {
		var password = $(this).val();
		var passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
		if (password && password.length < 8) {
			$(this).addClass('error');
			$(this).next('small').addClass('error');
			$(this).next('small').text('The password must be at least 8 characters long');
			$('.toggle-password').addClass('field-icon-error1');
		}
		else if (!passwordRegex.test(password)) {
			$(this).removeClass('error');
			$(this).addClass('error');
			$(this).next('small').addClass('error');
			$(this).next('small').text('The password must contain at least one uppercase letter and one number');
			$('.toggle-password').addClass('field-icon-error2');
		}
	},
	focus: function () {
		$(this).removeClass('error');
		$(this).next('small').removeClass('error');
		$(this).next('small').text('');
		$('.toggle-password').removeClass('field-icon-error1');
		$('.toggle-password').removeClass('field-icon-error2');
		$('#re_password').removeClass('error');
		$('#re_password').next('small').removeClass('error');
		$('#re_password').next('small').text('');
		$('.toggle-re_password').removeClass('field-icon-error1');
	}
});

// verifica che la password contenga almeno un carattere maiuscolo e un numero e applica stili css in caso di errore e li rimuove al focus
$("#re_password").on({
	"blur": function () {
		var firstPassword = $("#password").val();
		if ($(this).val() && $(this).val() != firstPassword) {
			$(this).addClass('error');
			$(this).next('small').addClass('error');
			$(this).next('small').text('The passwords do not match');
			$('.toggle-re_password').addClass('field-icon-error1');
		}
	},
	focus: function () {
		$(this).removeClass('error');
		$(this).next('small').removeClass('error');
		$(this).next('small').text('');
		$('.toggle-re_password').removeClass('field-icon-error1');
		$("#password").removeClass('error');
		$("#password").next('small').removeClass('error');
		$("#password").next('small').text('');
		$('.toggle-password').removeClass('field-icon-error1');
		$('.toggle-password').removeClass('field-icon-error2');
	}
});

// al submit del form, controlla che l'utente non esista già nel database e che la password sia valida e in caso positivo, lo registra
$('#registration_form').submit(function (event) {
	event.preventDefault();

	var email = $(this).find('#email').val();
	var username = $(this).find('#username').val();
	var password = $(this).find('#password').val();
	var re_password = $(this).find('#re_password').val();

	// controlla campi
	if ($(this).find('#username').hasClass("error"))
		return false;

	var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		$('#email').addClass('error');
		$('#email').next('small').removeClass('available').addClass('error');
		$('#email').next('small').text('Email not valid');
		return false;
	}

	if (password.length < 8) {
		$('#password').addClass('error');
		$('#password').next('small').addClass('error');
		$('#password').next('small').text('The password must be at least 8 characters long');
		return false;
	}

	var passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
	if (!passwordRegex.test(password)) {
		console.log('Password non valida')
		$('#password').addClass('error');
		$('#password').next('small').addClass('error');
		$('#password').next('small').text('The password must contain at least one uppercase letter and one number');
		return false;
	}

	if (password != re_password) {
		$('#re_password').addClass('error');
		$('#re_password').next('small').addClass('error');
		$('#re_password').next('small').text('The passwords do not match');
		return false;
	}

	$.ajax({
		type: $(this).attr('method'),
		url: 'handle_db.php',
		data: { email: email, username: username, password: password, funzione: 'registration' },
		success: function (data) {
			if (data.trim() === '0') {
				already_exist();
			} else {
				localStorage.setItem('isLoggedIn', true);
				localStorage.setItem('username', username);
				localStorage.setItem('email', email);
				window.location.href = '?p=home';
			}
		},
		error: function (xhr, status, error) {
			$('#email').addClass('error');
			$('#email').next('small').removeClass('available').addClass('error');
			$('#email').next('small').text('We are sorry, the server is currently down. Try again later');
			$('#username').addClass('error');
			$('#username').next('small').removeClass('available').addClass('error');
			$('#username').next('small').text('We are sorry, the server is currently down. Try again later');
			console.log("Errore: " + xhr.responseText);
		}
	});
});
