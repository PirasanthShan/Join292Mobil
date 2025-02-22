document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL2 = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
    const icons = {
        visibilityOff: "./assets/icon/visibility_off.svg",
        visibility: "./assets/icon/visibility.svg",
        lock: "./assets/icon/lock.webp",
        rememberDefault: "./assets/icon/Property 1=Default.svg",
        rememberChecked: "./assets/icon/Property 1=checked.svg"
    };

    // Setzt den Zustand auf "Remember Default" beim Start
    localStorage.setItem("isRememberDefault", "true");

   // Aktualisiert das Icon des Passwort-Toggles basierend auf dem Eingabeinhalt
function updatePasswordToggleIcon(inputId, toggleId) {
    const input = document.getElementById(inputId);
    document.getElementById(toggleId).src = input.value.length > 0 ? visibilityOffIcon : lockIcon;
}

// Schaltet die Sichtbarkeit des Passworts um
function togglePasswordVisibilityIcon(inputId, toggleId) {
    const field = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (field.value.length === 0) return;
    if (toggle.src.includes('visibility_off.svg')) {
        field.type = "text";
        toggle.src = visibilityIcon;
    } else {
        field.type = "password";
        toggle.src = visibilityOffIcon;
    }
}

    // Fügt Event-Listener für "Remember Me"-Funktion hinzu
    function addRememberEventListeners() {
        const container = document.getElementById("remember-image-container");
        const image = document.getElementById("remember-main-image");
        if (container && image) {
            let isDefault = localStorage.getItem("isRememberDefault") === "true";
            image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;

            container.addEventListener("mouseover", () => { if (isDefault) image.src = icons.rememberChecked; });
            container.addEventListener("mouseout", () => { if (isDefault) image.src = icons.rememberDefault; });
            container.addEventListener("click", () => {
                isDefault = !isDefault;
                image.src = isDefault ? icons.rememberDefault : icons.rememberChecked;
                localStorage.setItem("isRememberDefault", isDefault);

                if (!isDefault) {
                    const email = document.getElementById('login-email').value;
                    const password = document.getElementById('login-password').value;
                    localStorage.setItem("rememberedEmail", email);
                    localStorage.setItem("rememberedPassword", password);
                } else {
                    localStorage.removeItem("rememberedEmail");
                    localStorage.removeItem("rememberedPassword");
                    // Leert die Felder, wenn Remember Me deaktiviert ist
                    document.getElementById('login-email').value = '';
                    document.getElementById('login-password').value = '';
                }
            });
        }
    }

    // Überwacht DOM-Änderungen, um Event-Listener hinzuzufügen
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && document.getElementById("remember-image-container") && document.getElementById("remember-main-image")) {
                addRememberEventListeners();
                observer.disconnect();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Setzt die Felder auf leer, da Remember Me standardmäßig deaktiviert ist
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';

    // Abrufen der Benutzerdaten von der Datenbank
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL2}/users.json`);
            if (!response.ok) throw new Error(`Fehler: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            showMessage("FailedtoSingUp");
        }
    };

    // Validiert Benutzeranmeldedaten
    const validateUser = (users, email, password) => {
        return Object.values(users).some(user => user.email.toLowerCase() === email && user.password === password);
    };

    // Event-Listener für Login-Button
    const logBtn = document.getElementById("logBtn");
    if (logBtn) {
        logBtn.onclick = async function(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value.trim().toLowerCase();
            const password = document.getElementById('login-password').value.trim();

            if (!email || !password) {
                showMessage("EmailandPassword");
                return;
            }

            const users = await fetchUsers();
            if (users && validateUser(users, email, password)) {
                window.location.href = "summary.html";
            } else {
                showMessage("UserDontExist");
            }
        };
    }

    // Event-Listener für Gast-Login-Button
    const guestBtn = document.getElementById("guestBtn");
    if (guestBtn) {
        guestBtn.onclick = () => { window.location.href = "summary.html"; };
    }

    // Zeigt eine Benachrichtigung an
    function showMessage(className, redirectToLogin = false) {
        const alertContainer = document.querySelector('.singUp-Alert2');
        if (!alertContainer) {
            console.error('Fehler: Alert-Container nicht gefunden.');
            return;
        }
    
        // Zeige den Alert-Container an
        alertContainer.style.display = 'flex';
    
        // Alle Kinder des Containers ausblenden
        const messages = alertContainer.children;
        for (let i = 0; i < messages.length; i++) {
            messages[i].style.display = 'none';
        }
    
        // Zeige die spezifische Nachricht an
        const alertMessage = document.querySelector(`.${className}`);
        if (alertMessage) {
            alertMessage.style.display = 'flex';
        } else {
            console.error(`Fehler: Nachricht mit der Klasse ${className} nicht gefunden.`);
        }
    
        // Automatisch nach 2 Sekunden ausblenden
        setTimeout(() => {
            alertContainer.style.display = 'none';
            if (redirectToLogin) {
                window.location.href = 'login.html';
            }
        }, 2000);
    }})
    