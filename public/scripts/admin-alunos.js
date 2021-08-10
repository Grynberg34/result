// Formatar data

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

// Editar

var turma = document.getElementsByClassName('edit__icon');

for(var i=0; i< turma.length; i++){
  turma[i].addEventListener("click", editUser);
}

function editUser(){

    var id = this.id;
    var nome = document.getElementsByClassName(id)[0].innerHTML;
    document.getElementsByClassName('edit__input')[0].value = id;
    document.getElementsByClassName('edit__aluno')[0].innerHTML = nome;
    
    document.getElementsByClassName('menu')[0].style.display = "none";
    document.getElementsByClassName('edit')[0].style.display = "block";


}


document.getElementById('editSubmit').addEventListener('click', submitForm);

function submitForm() {
    document.getElementById('editSubmit').disabled = "true";
    document.getElementById('edit__form').submit()
}

document.getElementById('editReturn').addEventListener('click', returnForm);

function returnForm() {
    document.getElementsByClassName('menu')[0].style.display = "block";
    document.getElementsByClassName('edit')[0].style.display = "none";
}


// Deletar

var aluno = document.getElementsByClassName('delete__icon');

for(var i=0; i< aluno.length; i++){
  aluno[i].addEventListener("click", deleteUser);
}

function deleteUser(){

    var id = this.id;
    document.getElementsByClassName('delete__input')[0].value = id;
    
    document.getElementsByClassName('menu')[0].style.display = "none";
    document.getElementsByClassName('delete')[0].style.display = "block";


}


document.getElementById('deleteSubmit').addEventListener('click', submitForm2);

function submitForm2() {
    document.getElementById('deleteSubmit').disabled = "true";
    document.getElementById('delete__form').submit()
}

document.getElementById('deleteReturn').addEventListener('click', returnForm2);

function returnForm2() {
    document.getElementsByClassName('menu')[0].style.display = "block";
    document.getElementsByClassName('delete')[0].style.display = "none";
}