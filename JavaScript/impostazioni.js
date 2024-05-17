// impostazioni.js

// Funzione per impostare la lingua
function setLanguage(language) {
    if (language === "italiano") {
        // Imposta la lingua italiana
        document.documentElement.lang = "it";
    } else if (language === "inglese") {
        // Imposta la lingua inglese
        document.documentElement.lang = "en";
    }
}

// Funzione per impostare il volume
function setVolume(volume) {
    // Imposta il volume
    // Ad esempio, potresti aggiornare un'interfaccia utente o fare altre azioni in base al volume selezionato
}

// Funzione per attivare/disattivare la modalità notturna
function setLightMode() {
    document.body.classList.remove('night-mode');
    document.body.classList.add('light-mode');
    document.getElementById('night-mode-toggle').checked = false;
    localStorage.setItem('mode', 'light');
}

function setNightMode() {
    document.body.classList.remove('light-mode');
    document.body.classList.add('night-mode');
    document.getElementById('night-mode-toggle').checked = true;
    localStorage.setItem('mode', 'night');
}

function toggleNightMode() {
    if (document.getElementById('night-mode-toggle').checked) {
        setNightMode();
    } else {
        setLightMode();
    }
}

// Imposta la modalità all'avvio in base alle preferenze salvate
window.onload = function() {
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'night') {
        setNightMode();
    } else {
        setLightMode();
    }
}


