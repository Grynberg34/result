// Pontos restantes

var pontos = document.getElementsByClassName('pontos');
var total = 0

for (var i=0; i < pontos.length; i++) {

    total = total + parseInt(pontos[i].innerText)

}

var restantes = 100 - total;

document.getElementById('restantes').innerText = restantes;

// Submit form

var button = document.getElementsByClassName('avaliacoes__avaliacao__button');

for (var i=0; i < button.length; i++) {
    button[i].addEventListener("click", function(){
        var id = this.id

        document.getElementById('a_id').value = id;

        document.getElementById('form').submit();
    })
}

var button_gabarito = document.getElementsByClassName('avaliacoes__avaliacao__button--gabarito');

for (var i=0; i < button_gabarito.length; i++) {
    button_gabarito[i].addEventListener("click", function(){
        var id = this.id

        document.getElementById('a_id_gabarito').value = id;

        document.getElementById('form_gabarito').submit();
    })
}