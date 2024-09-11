function signUp() {
  let signUp = document.getElementById('RegisterWindow');
  document.getElementById('formId').classList.add('d-none')
  document.getElementById('RegisterWindow').classList.remove('d-none')
  document.getElementById('signUpNone').classList.add('d-none')
  signUp.innerHTML = "";
  signUp.innerHTML = renderSignUp();
  addEventListeners(); // Stelle sicher, dass die Event-Listener hinzugefügt werden
}

function backtoSignUp() {
  const formId = document.getElementById('formId');
  const registerWindow = document.getElementById('RegisterWindow');
  const signUpNone = document.getElementById('signUpNone');

  // Anwenden der Ausblend-Animation auf das Registrierungsfenster
  registerWindow.classList.add('fade-out');

  setTimeout(() => {
    // Versteckt das RegisterWindow nach der Animation
    registerWindow.classList.add('d-none');
    registerWindow.classList.remove('fade-out'); // Entferne nur die fade-out Klasse
    registerWindow.classList.remove('hidden'); // Entferne sicherheitshalber die hidden Klasse

    // Zeige das Anmeldefenster mit Einblend-Animation
    formId.classList.remove('d-none');
    formId.classList.add('fade-in');

    setTimeout(() => {
      formId.classList.remove('fade-in'); // Entferne fade-in nach der Animation
    }, 300); // Dauer der Einblendanimation

    signUpNone.classList.remove('d-none'); // Zeige das Sign-Up wieder an
  }, 300); // Dauer der Ausblendanimation
}


function animateLogoToEndPosition() {
  const loadingLogo = document.querySelector('.loadingScreen img');
  const loadingScreen = document.querySelector('.loadingScreen');
  const finalLogo = document.querySelector('.logo-Ctn img');
  const content = document.querySelector('.content');

  // Zielposition innerhalb des .content Containers
  const targetX = -63.5; // margin-left innerhalb des Containers
  const targetY = -85; // top innerhalb des Containers

  // Startposition und -größe des Logos auf dem Bildschirm
  const loadingLogoRect = loadingLogo.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();

  // Berechnung der Offset-Position relativ zum Container
  const translateX = contentRect.left + targetX - loadingLogoRect.left;
  const translateY = contentRect.top + targetY - loadingLogoRect.top;

  // Berechnung der Skalierung für das Logo
  const scaleX = 64 / loadingLogoRect.width;  // Zielbreite 64px
  const scaleY = 78 / loadingLogoRect.height;  // Zielhöhe 78px

  // Transformation setzen
  loadingLogo.style.transformOrigin = "top left";
  
  // Start der Animation
  setTimeout(() => {
      loadingLogo.style.transition = 'transform 1s';
      loadingLogo.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      loadingScreen.style.transition = 'background-color 1s';
      loadingScreen.style.backgroundColor = 'transparent';
  }, 250);

  // Änderung des Bildes während der Animation (ohne Opazität oder andere Effekte)
  setTimeout(() => {
      loadingLogo.src = './assets/icon/JoinMainLogo.webp'; // Ändere die Bildquelle hier
  }, 250); // Zeitpunkteinstellung für den Bildwechsel

  // Vollendung der Animation und Bildanzeige
  setTimeout(() => {
      finalLogo.style.opacity = '1';
  }, 1250);

  setTimeout(() => {
      loadingScreen.style.display = 'none';
  }, 1500);
}

// Aufruf der Funktion beim Laden der Seite
window.onload = animateLogoToEndPosition;



function renderSignUp(){
return ` 
        <div class="registration-Ctn">
          <div class="regiCtn">
            <img onclick="backtoSignUp()" src="./assets/icon/arrow-left-line.webp" alt="">
            <div class="h2Ctn">
            <h2>Sign up</h2>
            </div>
          </div>
          <div class="underline-Ctn2"></div>

          <div class="CtnInput2">
            <form class="formRegi" onsubmit="addUser(event);">
        <div class="input-Ctn">
            <input class="input" type="text" placeholder="Name" id="signup-name" required autocomplete="current-Name">
            <img src="./assets/icon/Person1.webp" alt="">
        </div>
        <div class="input-Ctn">
            <input class="input" type="email" placeholder="Email" id="signup-email" required autocomplete="current-email">
            <img src="./assets/icon/mail.webp" alt="">
        </div>
          <div class="input-Ctn">
            <input class="input" type="password" placeholder="Password" id="signup-password" autocomplete="current-password" required oninput="updateToggleIcon('signup-password', 'signup-password-toggle')">
            <img src="./assets/icon/lock.webp" alt="" id="signup-password-toggle" onclick="togglePasswordVisibility('signup-password', 'signup-password-toggle')">
          </div>
        <div class="input-Ctn">
          <input class="input" type="password" placeholder="Confirm Password" autocomplete="current-password" id="confirm-password" required oninput="updateToggleIcon('confirm-password', 'confirm-password-toggle')">
          <img src="./assets/icon/lock.webp" alt="" id="confirm-password-toggle" onclick="togglePasswordVisibility('confirm-password', 'confirm-password-toggle')">
        </div>
          
           <div class="remember-Ctn2" id="image-container">
            <img src="./assets/icon/Property 1=Default.svg" alt="" id="main-image">
            <p>I accept the</p> <em>Privacy Policy</em>
           </div>
        
        <div class="SignUpButton-Ctn">
            <button class="SignUpButton" id="signUpButton" type="submit">Sign up</button>
        </div>

        <div class="footer2">
  
           <a href="privacyPolicy.html">Privacy Policy</a>
           <a href="LegalNotice.html">Legal Notice</a>
          
        </div>
              
      </form>


     </div>
  </div>

  <div class="singUp-Alert" style="display: none;">
        <div class="AlertSignUp" style="display: none;">
            <p>You Signed Up successfully</p>
        </div>
        <div class="Emailexists" style="display: none;">
            <p>Email already exists!</p>
        </div>
        <div class="Nameexists" style="display: none;">
            <p>Name already exists!</p>
        </div>
        <div class="FailedtoSingUp" style="display: none;">
            <p>Your password don't Match!</p>
        </div>
        <div class="PrivacyPolicy" style="display: none;">
            <p>Please check the Privacy Policy!</p>
        </div>
      </div>

  `
}
