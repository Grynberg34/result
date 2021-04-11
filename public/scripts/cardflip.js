function toggle(id) {
    document.getElementById(id).classList.add('is-flipped')
    document.getElementById(id).removeAttribute('onclick')
    document.getElementById(id).children[0].children[1].style.display = "none"
}