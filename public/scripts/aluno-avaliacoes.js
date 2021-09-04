var nota = document.getElementsByClassName('nota');

for (var i=0; i < nota.length; i++) {
    if (nota[i].innerText == '0') {
        nota[i].innerText = 'aguardando correção';
        nota[i].style.fontStyle = 'italic';
    }
    if (nota[i].innerText == '') {
        nota[i].parentElement.style.display = "none";
    }

}