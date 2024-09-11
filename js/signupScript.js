const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";

// Diese Funktion sendet Daten an die angegebene URL und gibt die Serverantwort zurück.
async function postData(path = "", data = {}) {
    try {
        console.log(`Daten werden gesendet an: ${BASE_URL + path + ".json"}`);
        console.log("Daten: ", JSON.stringify(data));
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        let responseToJson = await response.json();
        console.log("Antwort vom Server: ", responseToJson);
        return responseToJson;
    } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
        throw error;
    }
}

// Diese Funktion holt Daten von der angegebenen URL und gibt sie zurück.
async function getData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        let responseToJson = await response.json();
        console.log("Daten vom Server: ", responseToJson);
        return responseToJson;
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        throw error;
    }
}

// Diese Funktion fügt einen neuen Benutzer hinzu, nachdem sie überprüft hat, dass das Bild angeklickt wurde und die Passwörter übereinstimmen.
async function addUser(event) {
    event.preventDefault();
    if (!isImageClicked) {
        showMessage("PrivacyPolicy");
        return;
    }

    let name = document.getElementById('signup-name').value.trim(),
        email = document.getElementById('signup-email').value.trim().toLowerCase(),
        password = document.getElementById('signup-password').value,
        confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        showMessage("FailedtoSingUp");
        return;
    }

    let userData = { name: name, email: email, password: password };
    console.log("Zu sendende Benutzerdaten: ", userData);

    try {
        let users = await getData("users");
        if (users) {
            for (let userId in users) {
                const existingUser = users[userId];
                console.log(`Überprüfung: ${existingUser.email.toLowerCase()} === ${email} oder ${existingUser.name.toLowerCase()} === ${name.toLowerCase()}`);
                
                if (existingUser.email.toLowerCase() === email) {
                    showMessage("Emailexists");
                    return;
                }
                if (existingUser.name.toLowerCase() === name.toLowerCase()) {
                    showMessage("Nameexists");
                    return;
                }
            }
        }

        let response = await postData("users", userData);
        if (response) {
            console.log("Antwort vom Server:", response);
            showMessage("AlertSignUp", true);
        } else {
            showMessage("FailedtoSingUp");
        }
    } catch (error) {
        console.error("Fehler:", error);
        showMessage("FailedtoSingUp");
    }
}

// Diese Funktion zeigt eine Nachricht an und leitet gegebenenfalls zur Login-Seite weiter.
function showMessage(className, redirectToLogin = false) {
    const alertContainer = document.querySelector('.singUp-Alert');
    if (!alertContainer) {
        console.error('Fehler: Alert-Container nicht gefunden.');
        return;
    }
    console.log('Alert-Container gefunden.');

    // Zeige den Alert-Container an
    alertContainer.style.display = 'flex';
    console.log('Alert-Container sichtbar gemacht.');

    // Alle Kinder des Containers ausblenden
    const messages = alertContainer.children;
    for (let i = 0; i < messages.length; i++) {
        messages[i].style.display = 'none';
    }
    console.log('Alle Nachrichten ausgeblendet.');

    // Zeige die spezifische Nachricht an
    const alertMessage = document.querySelector(`.${className}`);
    if (alertMessage) {
        alertMessage.style.display = 'flex';
        console.log(`Nachricht mit der Klasse ${className} angezeigt.`);
    } else {
        console.error(`Fehler: Nachricht mit der Klasse ${className} nicht gefunden.`);
    }

    // Automatisch nach 2 Sekunden ausblenden
    setTimeout(() => {
        alertContainer.style.display = 'none';
        console.log('Alert-Container nach Timeout ausgeblendet.');
        if (redirectToLogin) {
            window.location.href = 'login.html';
        }
    }, 2000);
}


const visibilityOffIcon = "./assets/icon/visibility_off.svg",
    visibilityIcon = "./assets/icon/visibility.svg",
    lockIcon = "./assets/icon/lock.webp";

// Diese Funktion aktualisiert das Symbol zum Umschalten der Passwortsichtbarkeit basierend auf der Eingabelänge.
function updateToggleIcon(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId),
        passwordToggle = document.getElementById(toggleId);
    passwordToggle.src = passwordInput.value.length > 0 ? visibilityOffIcon : lockIcon;
}

// Diese Funktion schaltet die Sichtbarkeit des Passworts um und aktualisiert das Symbol entsprechend.
function togglePasswordVisibility(inputId, toggleId) {
    const passwordField = document.getElementById(inputId),
        passwordToggle = document.getElementById(toggleId);
    if (passwordField.value.length === 0) return;
    if (passwordToggle.src.includes('visibility_off.svg')) {
        passwordField.type = "text";
        passwordToggle.src = visibilityIcon;
    } else if (passwordToggle.src.includes('visibility.svg')) {
        passwordField.type = "password";
        passwordToggle.src = visibilityOffIcon;
    }
}

let isImageClicked = false;

// Diese Funktion fügt Event-Listener für das Bild hinzu, um dessen Zustand bei Hover und Klick zu ändern.
function addEventListeners() {
    const imageContainer = document.getElementById("image-container"),
        mainImage = document.getElementById("main-image");
    if (imageContainer && mainImage) {
        let isDefault = true,
            defaultSrc = "./assets/icon/Property 1=Default.svg",
            hoverSrc = "./assets/icon/Property 1=checked.svg";
        mainImage.src = defaultSrc;
        isImageClicked = false;

        imageContainer.addEventListener("mouseover", () => {
            if (isDefault) mainImage.src = hoverSrc;
        });

        imageContainer.addEventListener("mouseout", () => {
            if (isDefault) mainImage.src = defaultSrc;
        });

        imageContainer.addEventListener("click", () => {
            isDefault = !isDefault;
            mainImage.src = isDefault ? defaultSrc : hoverSrc;
            isImageClicked = !isDefault;
        });
    } else {
        console.error("Elemente wurden nicht gefunden. Überprüfen Sie die IDs.");
    }
}

// Diese Funktion stellt sicher, dass das DOM geladen ist, bevor die Event-Listener hinzugefügt werden.
document.addEventListener("DOMContentLoaded", function() {
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && document.getElementById("image-container") && document.getElementById("main-image")) {
                addEventListeners();
                observer.disconnect();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (document.getElementById("image-container") && document.getElementById("main-image")) {
        addEventListeners();
    }
});
