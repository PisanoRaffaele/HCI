// crea dinamicamente gli elementi html per ogni gioco trovato e li aggiunge alla pagina home
$(function () {

    // Funzione per impostare la modalità chiara
    function setLightMode() {
        $("body").removeClass("night-mode").addClass("light-mode");
        localStorage.setItem('mode', 'light'); // Salva la modalità nella memoria locale
        changeVideoSource('assets/HomeVideo2.mp4'); // Cambia la sorgente del video
        $('#imgFade').css('visibility', 'hidden');
    }

    // Funzione per cambiare la fonte del video
    function changeVideoSource(source) {
        $(".video-container video").attr("src", source);
        var videoElement = $(".video-container video").get(0);
        videoElement.load();
        videoElement.play();
    }

    // Funzione per impostare la modalità scura
    function setNightMode() {
        $("body").removeClass("light-mode").addClass("night-mode");
        localStorage.setItem('mode', 'night'); // Salva la modalità nella memoria locale
        $('#imgFade').css('visibility', 'visible');
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

    $.ajax({
        url: "fetch.php",
        dataType: "json",
        success: function (data) {
            var html = data.slice(0, 4).map(function (value) {
                var X = Math.floor(Math.random() * 30);
                var Y = Math.floor(Math.random() * 30);
                return `
                <div class="card" style="background-position: ${X}% ${Y}%;">
                    <img src="assets/cardFoto.png" class="jumping-foto">
                    <div class="logo-container">
                        <img src="${value.image}" alt="${value.title}">
                    </div>
                    <div class="title-container">
                        <h4 class="card-title">${value.title}</h4>
                    </div>
                    <div class="description-container">
                        <p class="card-text">${value.description}</p>
                        <a class="play-button" href="${value.link}">Let's play</a>
                    </div>
                </div>
            `;
            }).join("");
            $(".game-list").html(html);
        },
        error: function (xhr, status, error) {
            console.log("Errore: " + xhr.responseText);
            var html = '<div class="card"><h4 class="card-title">We are sorry, the server is currently down. Unable to load the games</h4></div>';
            $(".game-list").html(html);
        }
    });
});
