var select = document.getElementsByClassName('menu__select')[1];

select.addEventListener("change", mostrarGabarito);

function mostrarGabarito() {

    console.log(select.value)

    if (select.value == 'múltipla escolha' || select.value == 'completar texto') {
        document.getElementsByClassName('gabarito')[0].style.display = 'block';
    }

    if (select.value == 'perguntas abertas') {
        document.getElementsByClassName('gabarito')[0].style.display = 'none'
    }

}

var num = document.getElementById("numero");

num.addEventListener("change", criarPerguntas);

function criarPerguntas() {

    if (document.getElementById("perguntas") !== null) {
        document.getElementById("perguntas").remove();
        console.log('remove')
    }

    var n = parseInt(num.value) +1;

    var perguntas = document.createElement('DIV');
    perguntas.id = "perguntas";

    for (var i=1; i < n; i++) {
        var div = document.createElement('DIV');
        var label = document.createElement('LABEL');
        var input = document.createElement('INPUT');
        div.classList.add('gabarito__pergunta');
        label.innerText = "Pergunta " + i;
        label.classList.add('menu__label');
        input.classList.add('menu__input')
        input.setAttribute("type", "text");
        input.setAttribute("name", i);
        input.id = i;
        div.appendChild(label);
        div.appendChild(input);
        perguntas.appendChild(div);
        document.getElementsByClassName('gabarito')[0].appendChild(perguntas);
    }






}
