var form = document.getElementById('form');
var submitButton = document.getElementsByClassName('form__button')[0];

form.addEventListener('submit', function() {

   submitButton.setAttribute('disabled', 'disabled');
			
}, false);