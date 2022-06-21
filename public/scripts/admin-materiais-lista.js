var icon = document.getElementsByClassName('materiais__material__icon')

for (var i = 0; i < icon.length; i++) {
    document.getElementsByClassName('materiais__material__icon')[i].addEventListener('click', submitForm);
}

function submitForm() {
    var id = this.id;
    document.getElementsByClassName('form__input')[0].value = id;
    document.getElementById('form').submit()
}