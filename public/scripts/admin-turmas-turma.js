// Deletar

var icon = document.getElementsByClassName('menu__icon')[0];

icon.addEventListener("click", deleteTurma);

function deleteTurma(){
    
    document.getElementsByClassName('menu')[0].style.display = "none";
    document.getElementsByClassName('delete')[0].style.display = "block";

}

document.getElementById('deleteSubmit').addEventListener('click', submitForm);

function submitForm() {
    document.getElementById('deleteSubmit').disabled = "true";
    document.getElementById('delete__form').submit()
}

document.getElementById('deleteReturn').addEventListener('click', returnForm);

function returnForm() {
    document.getElementsByClassName('menu')[0].style.display = "block";
    document.getElementsByClassName('delete')[0].style.display = "none";
}