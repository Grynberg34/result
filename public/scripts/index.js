var option = document.getElementsByClassName('equipe__menu__option');

for(var i=0; i< option.length; i++){
  option[i].addEventListener("click", selectOption);

}

function selectOption() {
    
    for (var i=0; i < option.length; i++) {
        option[i].classList.remove('equipe__active');
        document.getElementsByClassName('equipe__members__member')[i].style.display = 'none'
    }

    document.getElementById(this.id).classList.add('equipe__active')

    document.getElementById(`t-${this.id}`).style.display = "block"

}