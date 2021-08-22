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


console.log(presença.length)