var nota = document.getElementsByClassName('nota');

for (var i=0; i < nota.length; i++) {
    if (nota[i].innerText == '') {
        nota[i].parentElement.style.display = "none";
    }
}