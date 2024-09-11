function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop durch alle HTML-Elemente */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /* Sucht nach dem Attribut "w3-include-html" */
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* HTTP-Anfrage verwenden, um den HTML-Inhalt zu laden */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          elmnt.innerHTML = this.responseText;
          elmnt.removeAttribute("w3-include-html");
          includeHTML(); // Ruft includeHTML rekursiv auf, um weitere Includes zu laden
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return; // Schleifen-Durchlauf beenden, da das Include-HTML geladen wird
    }
  }
}
