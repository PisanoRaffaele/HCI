// se l'utente non è loggato, viene impossibilitato ad accedere alla pagina profilo e viene reindirizzato alla pagina home
$(function () {
	$('body').hide();
	if (localStorage.getItem('isLoggedIn') === 'false' || localStorage.getItem('isLoggedIn') === 'null') {
		window.location.href = '?p=home';
	}
	$('body').show();
    $('#profile1').hide();
});

// prende in localStorage i dati dell'utente e li mostra nella pagina profilo
$(function () {
    var username = localStorage.getItem('username');
    var email = localStorage.getItem('email');

    $('#user-profile').text(username);
    $('#email-profile').text(email);
});

// quando perde il focus, controlla che le 2 password coincidano, senno mostra un messaggio di errore
// quando prende il focus, rimuove lo stile di errore
$("#rePassword").on({
	"blur": function () {
		var firstPassword = $("#newPassword").val();
		if ($(this).val() && $(this).val() != firstPassword) {
			$(this).addClass('error');
			$(this).next('small').addClass('error');
			$(this).next('small').text('Passwords do not match');
		}
	},
	focus: function () {
		$(this).removeClass('error');
		$(this).next('small').removeClass('error');
		$(this).next('small').text('');
	}
});

// al submit del form, controlla che la password sia valida e in caso positivo, la cambia
$('#reset-pass-form').submit(function (event) {
    event.preventDefault();

    var oldPassword = $(this).find('#oldPassword').val();
    var newPassword = $(this).find('#newPassword').val();
    var rePassword = $(this).find('#rePassword').val();
    var username = localStorage.getItem('username');
    var email = localStorage.getItem('email');

    if (newPassword.length < 8) {
        $('#newPassword').addClass('error');
        $('#newPassword').next('small').addClass('error');
        $('#newPassword').next('small').text('The password must be at least 8 characters long');
        return false;
    }

    var passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(newPassword)) {
        $('#newPassword').addClass('error');
        $('#newPassword').next('small').addClass('error');
        $('#newPassword').next('small').text('The password must contain at least one uppercase letter and one number');
        return false;
    }

    if (oldPassword === newPassword) {
        $('#newPassword').addClass('error');
        $('#newPassword').next('small').addClass('error');
        $('#newPassword').next('small').text('The new password must be different from the old one');
        return false;
    }

    if (newPassword != rePassword)
        return false;

    $.ajax({
        type: $(this).attr('method'),
        url: 'handle_db.php',
        data: { oldPassword: oldPassword, newPassword: newPassword, email: email, username: username, funzione: 'reset_password' },
        success: function (data) {
            if (data.trim() === '0') {
                $('.profile-button').next('small').removeClass('available').addClass('error');
                $('.profile-button').next('small').text('We are sorry, the server is currently down. Try again later');
            }
            else if (data.trim() === '2') {
                $('#oldPassword').next('small').removeClass('available').addClass('error');
                $('#oldPassword').next('small').text('The old password is incorrect');
            }
            else {
                $('.profile-button').next('small').removeClass('error').addClass('available');
                $('.profile-button').next('small').text('Password changed successfully');
                $('#oldPassword').removeClass('error');
                $('#oldPassword').next('small').removeClass('error');
                $('#oldPassword').next('small').text('');
                $('#newPassword').removeClass('error');
                $('#newPassword').next('small').removeClass('error');
                $('#newPassword').next('small').text('');
                $('#rePassword').removeClass('error');
                $('#rePassword').next('small').removeClass('error');
                $('#rePassword').next('small').text('');
                $('#oldPassword').val('');
                $('#newPassword').val('');
                $('#rePassword').val('');
            }
        },
        error: function (xhr, status, error) {
            console.log("Errore: " + xhr.responseText);
            $('.profile-button').next('small').removeClass('available').addClass('error');
            $('.profile-button').next('small').text('We are sorry, the server is currently down. Try again later');
        }
    });
});

$('#change-username-form').submit(function (event) {
    event.preventDefault();

    var newUsername = $(this).find('#newUsername').val();
    var currentPassword = $(this).find('#currentPassword').val();
    var username = localStorage.getItem('username');
    var email = localStorage.getItem('email');

    if (newUsername === username) {
        $('#newUsername').addClass('error');
        $('#newUsername').next('small').addClass('error');
        $('#newUsername').next('small').text('The new username must be different from the old one');
        return false;
    }

    $.ajax({
        type: $(this).attr('method'),
        url: 'handle_db.php',
        data: { newUsername: newUsername, currentPassword: currentPassword, email: email, username: username, funzione: 'reset_username' },
        success: function (data) {
            if (data.trim() === '0') {
                $('.profile-button').next('small').removeClass('available').addClass('error');
                $('.profile-button').next('small').text('We are sorry, the server is currently down. Try again later');
            }
            else if (data.trim() === '2') {
                $('#currentPassword').next('small').removeClass('available').addClass('error');
                $('#currentPassword').next('small').text('The password is incorrect');
            }
            else {
                $('.profile-button').next('small').removeClass('error').addClass('available');
                $('.profile-button').next('small').text('Username changed successfully');
                $('#currentPassword').removeClass('error');
                $('#currentPassword').next('small').removeClass('error');
                $('#currentPassword').next('small').text('');
                $('#currentPassword').val('');
                $('#newUsername').removeClass('error');
                $('#newUsername').next('small').removeClass('error');
                $('#newUsername').next('small').text('');
                $('#newUsername').val('');
                localStorage.setItem('username', newUsername);
                $('#user-profile').text(newUsername);

            }
        },
        error: function (xhr, status, error) {
            console.log("Errore: " + xhr.responseText);
            $('.profile-button').next('small').removeClass('available').addClass('error');
            $('.profile-button').next('small').text('We are sorry, the server is currently down. Try again later');
        }
    });

});


// al click del bottone logout, rimuove i dati dell'utente dal localStorage e lo reindirizza alla pagina home
$('#logout').click(function () {
    localStorage.setItem('isLoggedIn', null);
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    window.location.href = '?p=home';
});

$('#change-password').click(function () {
    $('#profile1').show();
    $('#profile2').hide();
    $('#cu-text').css('text-decoration', 'none');
    $('#cp-text').css('text-decoration', 'underline');
});

$('#change-username').click(function () {
    $('#profile1').hide();
    $('#profile2').show();
    $('#cu-text').css('text-decoration', 'underline');
    $('#cp-text').css('text-decoration', 'none');
});

