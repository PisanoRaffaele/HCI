/******************** Bottom Header ********************/
$('#playButton').click(function() {
    var audio = document.getElementById("relaxing-music");
    audio.loop = true;
    audio.play();
    $('#playButton').addClass('no-show');
    $('#pauseButton').removeClass('no-show');
    localStorage.setItem('audioState', 'playing');
});

$('#pauseButton').click(function() {
    var audio = document.getElementById("relaxing-music");
    audio.pause();
    $('#pauseButton').addClass('no-show');
    $('#playButton').removeClass('no-show');
    localStorage.setItem('audioState', 'paused');
});

$('#dayButton').click(function() {
    document.body.classList.remove('night-mode');
    document.body.classList.add('light-mode');
    $('footer').addClass('light-mode');
    $('header').addClass('light-mode');
    $('#dayButton').addClass('no-show');
    $('#nightButton').removeClass('no-show');
    if (localStorage.getItem('mode') == 'night')
    {
        localStorage.setItem('mode', 'light');
        location.reload();
    }
});

$('#nightButton').click(function() {
    document.body.classList.remove('light-mode');
    document.body.classList.add('night-mode');
    $('footer').removeClass('light-mode');
    $('header').removeClass('light-mode');
    $('#nightButton').addClass('no-show');
    $('#dayButton').removeClass('no-show');
    if (localStorage.getItem('mode') == 'light')
    {
        localStorage.setItem('mode', 'night');
        location.reload();
    }

});

$('#upButton').click(function() {
    $('#upButton').addClass('no-show');
    $('#downButton').removeClass('no-show');
    $('.settings').addClass('show');
});

$('#downButton').click(function() {
    $('#downButton').addClass('no-show');
    $('#upButton').removeClass('no-show');
    $('.settings').removeClass('show');
});

/******************* Top Header *******************/

$(() => {

    const button1 = document.querySelector('#nightButton');
    const button2 = document.querySelector('#dayButton');
    if (localStorage.getItem('mode') == 'night')
        button1.click();
    else
        button2.click();
    if (localStorage.getItem('audioState') == 'playing')
    {
        $('#playButton').addClass('no-show');
        $('#pauseButton').removeClass('no-show');
    }
    else
    {
        $('#pauseButton').addClass('no-show');
        $('#playButton').removeClass('no-show');
    }

    $('#hamburger').on('click', function () {
        $('.animated-togglebutton').toggleClass('open');
        $('.dropdown-nav-container').toggleClass('show');
        $('#search-btn').toggleClass('show');
    });

    if (localStorage.getItem('isLoggedIn') == null) {
        localStorage.setItem('isLoggedIn', false);
    }

    var isLoggedIn = localStorage.getItem('isLoggedIn');

    $('[name="personal"]').each(function () {
        var elem = $(this);
        if (isLoggedIn == 'true') {
            elem.html('Profile');
            elem.attr('href', '?p=profile');
        }
    });
});

// al ridimensionamento della pagina, se la larghezza è maggiore di 991px, rimuove le classi open e show
// per far scomparire il menu hamburger e il menu dropdown
$(window).on('resize', function () {
    if ($(window).innerWidth() > 991) {
        $('.fa-search').removeClass('open');
        $('.dropdown-nav-container').removeClass('show');
        $('.animated-togglebutton').removeClass('open');
    }
});

// fa apparire il search dropdown quando si clicca sull'icona della ricerca e nasconde l'header e il menu hamburger
$('#search-btn2, #search-btn').on('click', function () {
    $('.dropdown-search-container').toggleClass('show');
    $("header").css('visibility', 'hidden');
    $(".animated-togglebutton, .animated-togglebutton span").css('transition', '0s');
    $('.video-container').css('margin-top', '0');
    get_game('');
});

// all input nella barra di ricerca, chiama la funzione get_game() che ottiene i giochi dal database
$('.search-input').on('input', function () {
    get_game($(this).val());
});

// al click del bottone chiudi, nasconde il search dropdown e fa riapparire l'header e il menu hamburger
$('.close-search').on('click', function () {
    $('.dropdown-search-container').removeClass('show');
    $("header").css('visibility', 'visible');
    $(".animated-togglebutton").css('transition', '0.5s');
    $(".animated-togglebutton span").css('transition', '0.25s');
    $('.video-container').css('margin-top', '80');
});


// ottiene i giochi dal database e li aggiunge al search dropdown in base all'input dell'utente
// crea dinamicamente gli elementi html per ogni gioco trovato e li aggiunge al search dropdown
function get_game(input_data) {
    $.ajax({
        type: 'POST',
        url: 'fetch.php',
        dataType: "json",
        success: function (data) {
            var html = data
                .filter(function (value) {
                    return input_data === '' || value.title.toLowerCase().startsWith(input_data.toLowerCase());
                })
                .map(function (value) {
                    return `
                            <div class="dropdown-game-container">
                                <a class="d-flex search-game-link" href="${value.link}">
                                    <div class="search-game-img">
                                        <img src="${value.image}" alt="${value.image}">
                                    </div>
                                    <div class="search-game-text">
                                        <h4 class="search-game-title">${value.title}</h4>
                                        <div class="search-game-description">${value.description}</div>
                                    </div>
                                </a>
                            </div>
                            <div class="dropdown-separator-search"></div>
                        `;
                }).join("");
            if (html == '') {
                html = '<div class="dropdown-game-container"><div class="search-game-text"><h4 class="search-game-title">No game found</h4></div></div>';
            }
            $(".search-game-result").html(html);
        },
        error: function (xhr, status, error) {
            var html = "<div class='dropdown-game-container'><div class='search-game-text'><h4 class='search-game-title'>We are sorry, the server is currently down. Try again later</h4></div></div>";
            $(".search-game-result").html(html);
        }
    });
}
