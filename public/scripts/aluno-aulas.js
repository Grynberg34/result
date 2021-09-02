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