var numero = document.getElementsByClassName('alunos__aluno__input');

var alunos= [];

for (var i=0; i < numero.length; i++) {

    alunos.push(numero[i].id)
    
}

document.getElementById('alunos').value = alunos;