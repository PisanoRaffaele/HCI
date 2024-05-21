// impostazioni.js

// Funzione per impostare la lingua


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




