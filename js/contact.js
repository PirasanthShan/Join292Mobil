document.addEventListener('DOMContentLoaded', function () {
    let currentContact = null, contacts = [];

    // Button zum Hinzufügen eines Kontakts
    document.getElementById('addContactBtn').addEventListener('click', e => {
        e.stopPropagation();
        openContactForm(true, {}); // Öffne das Formular für einen neuen Kontakt
    });

    // Zurück-Button Klick-Event hinzufügen
    const backButton = document.querySelector('.back-svg');
    if (backButton) {
        backButton.addEventListener('click', e => {
            e.preventDefault(); // Verhindere das Standardverhalten des Links
            showContactList();  // Funktion zum Anzeigen der Kontaktliste
        });
    }

    // Funktion zum Anzeigen der Kontaktliste
    const showContactList = () => {
        const card = document.querySelector('.mid-Content');
        if (card) {
            card.classList.remove('visible');
            card.style.display = 'none';
        }

        const contactList = document.querySelector('.Content-Contacts');
        if (contactList) {
            contactList.style.display = 'flex';
        }

        const optionMenu = document.getElementById("optionMenu");
        if (optionMenu) {
            optionMenu.style.display = 'none';  // Menü in der Kontaktliste ausblenden
        }
    };

    // Funktion zum Öffnen des Kontaktformulars
    function openContactForm(isNewContact, contact) {
        const formContainer = document.createElement('div');
        formContainer.id = 'next';
        formContainer.classList.add('Full-Container');

        formContainer.innerHTML = `
            <div class="AddContactCard">
                <div class="leftSide">
                    <img id="close-contact-form" src="./assets/icon/closewhite.svg" alt="Close Icon">
                    <div class="innerAddContact">
                        <h1>${isNewContact ? 'Add Contact' : 'Edit Contact'}</h1>
                        <p>Tasks are better with a team!</p>
                        <div class="TaskLine"></div>
                    </div>
                </div>

                <!-- Profil-Bild hier eingefügt -->
                <div class="profil-img">
                    ${isNewContact 
                        ? `<img src="./assets/icon/person.svg" alt="Default Person Icon" />` 
                        : generateInitialsImage(contact.name, 120, contact.color)}
                </div>

                <div class="rightSide">
                    <div class="rightSide-middle">
                        <form id="contact-form">
                            <div><input id="contact-name" type="text" placeholder="Name" value="${contact.name || ''}"><img class="iconInput" src="./assets/icon/Person1.webp"></div>
                            <div><input id="contact-email" type="email" placeholder="Email" value="${contact.email || ''}"><img class="iconInput" src="./assets/icon/mail.webp"></div>
                            <div><input id="contact-phone" type="text" placeholder="Phone" value="${contact.phone || ''}"><img class="iconInput" src="./assets/icon/call.svg"></div>
                        </form>
                    </div>
                    <div class="ctn-button" style="${isNewContact ? '' : 'margin-left: 0;'}">
                        <button style="display:none" id="Cancel-Btn" class="cancel">
                            ${isNewContact ? 'Cancel' : 'Delete'}
                            <div class="icon-container">
                                <img class="default-icon" src="./assets/icon/close.svg">
                                <img class="hover-icon" src="./assets/icon/closeBlue.svg">
                            </div>
                        </button>
                        <button id="save-contact" class="create" style="${isNewContact ? '' : 'width: 100px;'}">
                            ${isNewContact ? 'Create contact' : 'Save'}
                            <img src="./assets/icon/check.svg">
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Formular in den Body einfügen
        document.body.appendChild(formContainer);

        // Event-Listener für den Schließen-Button
        document.getElementById('close-contact-form').addEventListener('click', closeContactForm);

        // Event-Listener für den Cancel/Delete Button
        document.getElementById('Cancel-Btn').addEventListener('click', function () {
            if (isNewContact) {
                closeContactForm();
            } else {
                // Hier kannst du eine Funktion aufrufen, die den Kontakt löscht
                console.log('Kontakt löschen');
                closeContactForm();
            }
        });

        // Event-Listener für den Speichern/Erstellen Button
        document.getElementById('save-contact').addEventListener('click', function () {
            // Hier kannst du den Kontakt speichern
            saveContactWithValidation(isNewContact, contact);
        });
    }

    // Funktion zum Schließen des Kontaktformulars
    function closeContactForm() {
        const formContainer = document.getElementById('next');
        if (formContainer) {
            document.body.removeChild(formContainer);
        }
    }

    // Funktion zum Rendern der Kontaktkarte
    const renderContactCard = contact => {
        const imgContainer = document.querySelector('.float-img');
        imgContainer.innerHTML = ''; // Leeren

        if (isHTML(contact.img)) {
            imgContainer.innerHTML = contact.img;
        } else if (contact.img && isValidURL(contact.img)) {
            imgContainer.innerHTML = `<img src="${contact.img}" alt="Profile Image">`;
        } else {
            imgContainer.innerHTML = generateInitialsImage(contact.name, 80, contact.color);
        }

        const nameElement = document.querySelector('.float-Edit-Delet-Ctn h3');
        if (nameElement) {
            nameElement.textContent = contact.name;
        }

        const emailElement = document.querySelector('.contact-Information2 .email-blue');
        if (emailElement) {
            emailElement.textContent = contact.email;
            emailElement.href = `mailto:${contact.email}`;
        }

        const phoneElement = document.querySelector('.contact-Information2 p:nth-child(4)');
        if (phoneElement) {
            phoneElement.textContent = contact.phone;
        }
    };

    // Funktion zum Rendern der Kontaktliste
    const renderContactList = () => {
        const contactList = document.getElementById('contact-list');
        contactList.innerHTML = '';
        const grouped = groupContactsByLetter(contacts);

        for (const letter in grouped) {
            contactList.innerHTML += `
                <div class="AtoZ-Ctn"><p>${letter}</p></div>
                <div class="line-Ctn"><div class="line"></div></div>
                ${grouped[letter].map(contact => `
                    <div class="contact-data" data-email="${contact.email}">
                        ${isHTML(contact.img) ? contact.img : contact.img && isValidURL(contact.img) ? `<img src="${contact.img}" alt="Profile Image" style="width: 42px; height: 42px; border-radius: 50%;">` : generateInitialsImage(contact.name, 42, contact.color)}
                        <div><h1>${contact.name}</h1><p>${contact.email}</p></div>
                    </div>`).join('')}
            `;
        }

        attachContactClickEvents();
    };

    // Funktion zur Überprüfung, ob der img-Wert ein HTML-String ist
    const isHTML = (str) => {
        const div = document.createElement('div');
        div.innerHTML = str;
        return div.children.length > 0;
    };

    // Funktion zur Überprüfung, ob die URL gültig ist
    const isValidURL = (url) => {
        try {
            const validUrl = new URL(url);
            return validUrl.protocol === "http:" || validUrl.protocol === "https:";
        } catch (_) {
            return false;
        }
    };

    // Funktion zum Anzeigen der Kontaktkarte bei Klick
    const showContactCard = email => {
        const contact = contacts.find(c => c.email === email);
        if (contact) {
            renderContactCard(contact);
        }

        const card = document.querySelector('.mid-Content');
        const optionMenu = document.getElementById("optionMenu");

        if (card) {
            card.style.display = 'block';
            card.classList.add('visible');
        }

        const contactList = document.querySelector('.Content-Contacts');
        if (contactList) {
            contactList.style.display = 'none';
        }

        // Zeige das Menü nur, wenn die Kontaktkarte sichtbar ist
        if (optionMenu) {
            optionMenu.style.display = 'flex';
        }
    };

    // Funktion zum Ausblenden der Kontaktkarte
    const hideContactCard = () => {
        const card = document.querySelector('.mid-Content');
        const optionMenu = document.getElementById("optionMenu");

        if (card) {
            card.style.display = 'none';
            card.classList.remove('visible');
        }

        const contactList = document.querySelector('.Content-Contacts');
        if (contactList) {
            contactList.style.display = 'flex';
        }

        // Verstecke das Menü, wenn die Kontaktkarte ausgeblendet wird
        if (optionMenu) {
            optionMenu.style.display = 'none';
        }
    };

    // Funktion zum Umschalten des Menüs und Wechseln des Icons
    function toggleMenu() {
        const optionMenu = document.getElementById("optionMenu");
        const menuDotIcon = document.querySelector('.MenuDot img'); // Hier greifen wir auf das Icon zu

        // Das Menü wird nur angezeigt, wenn die Kontaktkarte sichtbar ist
        const card = document.querySelector('.mid-Content');
        if (card && card.style.display === 'block') {
            if (optionMenu.style.display === 'flex') {
                optionMenu.style.display = 'none';
                // Wechsel zurück zu dem ursprünglichen Icon
                menuDotIcon.src = "assets/icon/threeDot.svg";
            } else {
                optionMenu.style.display = 'flex';
                // Wechsel zum neuen Icon mit RELATIVEM PFAD
                menuDotIcon.src = "assets/icon/threeDotTrue.svg";
            }
        }
    }

    // Schließen des Menüs, wenn außerhalb geklickt wird, und Icon zurückwechseln
    document.addEventListener('click', function(event) {
        const optionMenu = document.getElementById("optionMenu");
        const menuDot = document.querySelector('.MenuDot');
        const menuDotIcon = document.querySelector('.MenuDot img');

        if (!optionMenu.contains(event.target) && !menuDot.contains(event.target)) {
            optionMenu.style.display = 'none';
            // Icon zurückwechseln, wenn außerhalb geklickt wird
            menuDotIcon.src = "assets/icon/threeDot.svg";
        }
    });

    // Event-Listener für das Menü-Icon
    const menuIcon = document.getElementById('menu-icon');
    menuIcon.addEventListener('click', toggleMenu);

    // Funktion zum Erstellen eines Avatars mit Initialen
    const generateInitialsImage = (name, size, color) => `
        <div class="initials-avatar" style="background-color: ${color}; width: ${size}px; height: ${size}px; font-size: ${size / 2.5}px; display: flex; justify-content: center; align-items: center; border-radius: 50%;">
            ${name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>`;

    // Funktion zum Abrufen einer zufälligen Farbe für den Kontakt
    const getUniqueColor = () => {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A5', '#FF8F33', '#33FFD1'];
        return colors.find(color => !contacts.some(contact => contact.color === color)) || colors[Math.floor(Math.random() * colors.length)];
    };

    // Funktion zum Hinzufügen von Klick-Events zu den Kontakten
    const attachContactClickEvents = () => {
        document.querySelectorAll('.contact-data').forEach(el => {
            el.addEventListener('click', function () {
                if (currentContact === this) {
                    this.classList.remove('clicked');
                    hideContactCard();  // Hier wird die Funktion aufgerufen
                    currentContact = null;
                } else {
                    document.querySelectorAll('.contact-data').forEach(el => el.classList.remove('clicked'));
                    this.classList.add('clicked');
                    currentContact = this;
                    showContactCard(this.querySelector('p').innerText);
                }
            });
        });
    };

    // Funktion zum Gruppieren der Kontakte nach Buchstaben
    const groupContactsByLetter = contacts => {
        return contacts.sort((a, b) => a.name.localeCompare(b.name))
            .reduce((acc, contact) => {
                const letter = contact.name[0].toUpperCase();
                (acc[letter] = acc[letter] || []).push(contact);
                return acc;
            }, {});
    };

    // Funktion zum Abrufen der Kontakte von Firebase
    const loadContactsFromFirebase = async () => {
        contacts = await getData('contacts').then(data => Object.values(data).map(contact => ({
            ...contact,
            color: contact.color || getUniqueColor(),
            img: contact.img || ''  // Bild muss in Firebase vorhanden sein
        })));
        renderContactList();
    };

    // Funktion zum Abrufen der Daten von Firebase
    const getData = async path => {
        const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/";
        const res = await fetch(`${BASE_URL}${path}.json`);
        return res.ok ? await res.json() : console.error('Fetch error');
    };

    // Lade Kontakte aus Firebase
    loadContactsFromFirebase();

    // Neue Funktion: Validierung und Duplikatprüfung beim Speichern eines Kontakts
    function saveContactWithValidation(isNewContact, contact) {
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();

        // Validierung
        if (!name || !email || !phone) {
            alert('Please fill out all fields.');
            return;
        }

        // Überprüfung auf doppelte Kontakte
        const existingContact = contacts.find(c => c.name === name || c.email === email);
        if (existingContact) {
            alert('A contact with this name or email already exists.');
            return;
        }

        // Kontakt hinzufügen und in Firebase speichern, assignedToTask wird immer false sein
        const newContact = {
            name,
            email,
            phone,
            color: getUniqueColor(),
            assignedToTask: false // Setzt den Wert immer auf false
        };
        
        addContactToFirebase(newContact).then(() => {
            contacts.push(newContact); // Kontakt zur Liste hinzufügen
            renderContactList(); // Liste aktualisieren
            closeContactForm(); // Formular schließen
        });
    }

    // Funktion zum Hinzufügen eines Kontakts zu Firebase
    const addContactToFirebase = async contact => {
        const BASE_URL = "https://remotestorage-f8df7-default-rtdb.europe-west1.firebasedatabase.app/contacts.json";
        const res = await fetch(BASE_URL, {
            method: 'POST',
            body: JSON.stringify(contact),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.ok;
    };

    // Verbindung der neuen Validierungslogik mit dem "save-contact"-Button
    document.getElementById('save-contact').addEventListener('click', function () {
        saveContactWithValidation(true, {});
    });

});
