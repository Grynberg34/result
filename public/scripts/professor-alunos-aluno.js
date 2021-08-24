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

var aulas = document.getElementsByClassName('aula');

for (var i=0; i < aulas.length; i++) {

    if (aulas[i].innerText == 'Aula :') {
        aulas[i].parentElement.style.display = 'none'
    }

}

function formatarData() {

    var data = document.getElementsByClassName('timestamp')

    for (var i = 0; i < data.length; i++) {
        let dia = data[i].textContent.substr(8,2);
        let anohora = data[i].textContent.substr(0, 4);
        let mes = data[i].textContent.substr(5,2);
        
        let str = dia + '/' + mes + '/' + anohora;

        data[i].textContent = str;
    }

}

formatarData();