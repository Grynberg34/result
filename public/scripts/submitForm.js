document.getElementsByClassName('menu__button').addEventListener('click', submitForm);

function submitForm() {
    document.getElementsByClassName('menu__button').disabled = "true";
    document.getElementById('form').submit()
}