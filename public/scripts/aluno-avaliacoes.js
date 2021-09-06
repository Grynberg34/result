var nota = document.getElementsByClassName('nota');

for (var i=0; i < nota.length; i++) {
    if (nota[i].innerText == '0' && document.getElementsByClassName('tipo')[i].innerText == 'perguntas abertas') {
        nota[i].innerText = 'aguardando correção';
        nota[i].style.fontStyle = 'italic';
    }
    if (nota[i].innerText == '') {
        nota[i].parentElement.style.display = "none";
    }

}