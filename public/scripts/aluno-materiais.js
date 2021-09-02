var material = document.getElementsByClassName('materiais__link');

for (var i=0; i < material.length; i++) {
    
    var nivel = material[i].classList[1];

    console.log(material[i].classList);

    document.getElementById(nivel).appendChild(material[i]);

}