// Submit Form

var icons = document.getElementsByClassName('aluno__icon');
var delete_icons = document.getElementsByClassName('aluno__icon--delete');

for (var i=0; i < icons.length; i++) {

    icons[i].addEventListener("click", submitForm)

}

function submitForm() {

    var id = this.id.substring(1);

    document.getElementsByClassName('form__input')[0].value = document.getElementById(`n${id}`).value;
    document.getElementsByClassName('form__input')[1].value = id;

    document.getElementById('form').submit();

}

for (var i=0; i < delete_icons.length; i++) {

    delete_icons[i].addEventListener("click", submitForm2)

}

function submitForm2() {

    var id = this.id.substring(1);

    document.getElementsByClassName('form__delete__input')[0].value = id;

    document.getElementById('form__delete').submit();

}


