var icon = document.getElementsByClassName('aulas__aula__icon');

for (var i=0; i < icon.length; i++) {

    icon[i].addEventListener("click", submitForm)

}


function submitForm() {

    var id = this.id;

    var c = "c" + id;

    var t = "t" + id;

    var d = "d" + id;

    document.getElementsByClassName('form__input')[0].value = id;

    document.getElementsByClassName('form__input')[1].value = document.getElementById(c).value;

    document.getElementsByClassName('form__input')[2].value = document.getElementById(t).value;

    document.getElementsByClassName('form__input')[3].value = document.getElementById(d).value;


    document.getElementById('form').submit();

}

// Chamada

var presença = document.getElementsByClassName('presença');

for (var i=0; i < presença.length; i++) {

    if (presença[i].innerText == "true") {
        presença[i].innerText = "presente"
    }

    else if (presença[i].innerText == "false") {
        presença[i].innerText = 'ausente'
        presença[i].style.color = "#d9d7d7"
    }

}


// Adicionar link

var form__button = document.getElementsByClassName('form-link__button');

for (var i=0; i < form__button.length; i++) {

    form__button[i].addEventListener("click", function(i){
        document.getElementsByClassName('form-link__button')[i].disabled = "true";
        document.getElementsByClassName('form-link')[i].submit()
    })

}

// Deletar link 

var link__icon = document.getElementsByClassName('aulas__aula__links__icon');

for (var i=0; i < link__icon.length; i++) {
    link__icon[i].addEventListener("click", submitForm2)
}

function submitForm2() {
    var id = this.id;

    document.getElementsByClassName('form__input')[4].value = document.getElementById(id).id;

    document.getElementById('form2').submit();
}