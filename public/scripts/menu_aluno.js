var label = document.getElementsByTagName('label')[0];
var options = document.getElementsByClassName('menu__options')[0];

label.addEventListener('click', abrirMenu);

function abrirMenu() {
    options.style.display = "block";
    label.removeEventListener("click", abrirMenu);
    label.addEventListener("click", fecharMenu);
}

function fecharMenu() {
    options.style.display = "none";
    label.removeEventListener("click", fecharMenu);
    label.addEventListener("click", abrirMenu);
}