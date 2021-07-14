document.getElementById('hamburger1').addEventListener('change', function() {
    if (document.getElementById("hamburger1").checked == true) {
        document.getElementsByClassName('mobile__menu')[0].style.display = 'block';
    }

    if (document.getElementById("hamburger1").checked == false) {
        document.getElementsByClassName('mobile__menu')[0].style.display = 'none';
    }
})