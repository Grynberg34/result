document.getElementsByClassName('menu__button')[0].addEventListener('click', submitForm);

function submitForm() {
    document.getElementsByClassName('menu__button')[0].disabled = "true";
    document.getElementById('form').submit()
}