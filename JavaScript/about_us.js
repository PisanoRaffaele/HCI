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
