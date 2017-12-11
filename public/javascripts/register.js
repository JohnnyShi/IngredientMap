/*----------------------------------
	A CustomValidation prototype class
	- keeps track of the list of invalid messages
	- keeps track of what validity checks need to be performed
	- performs validity checks and sends feedback to the front end
----------------------------------*/

function CustomValidation(input){
	this.invalidities = []; // array of invalid messages
	this.validityChecks = []; // items to be checked
	this.inputNode = input; // add reference to the input node
	this.registerListener(); // trigger method to attach the listener
}

CustomValidation.prototype = {
	addInvalidity: function(message){
		this.invalidities.push(message); // add a message into array
	},
	getInvalidities: function(message){
		return this.invalidities.join('.\n'); // join all invalid messages
	},
	checkValidity: function(input){
		for (var i = 0; i < this.validityChecks.length; i++){
			var isInvalid = this.validityChecks[i].isInvalid(input);
			if (isInvalid){
				this.addInvalidity(this.validityChecks[i].invalidityMessage);
			}
			var requirementElement = this.validityChecks[i].element;
			// add 'valid' or 'invalid' class to 'li' elements
			if (requirementElement){ 
				if(isInvalid){
					requirementElement.classList.add('invalid');
					requirementElement.classList.remove('valid');
				} else{
					requirementElement.classList.add('valid');
					requirementElement.classList.remove('invalid');
				}
			}
		}
	},
	checkInput: function(){
		this.inputNode.CustomValidation.invalidities = [];
		this.checkValidity(this.inputNode);
		if (this.inputNode.CustomValidation.invalidities.length === 0 && this.inputNode.value !== ''){
			this.inputNode.setCustomValidity(''); //  Use the empty string to indicate that the element does not have a custom validity error.
		} else{
			var message = this.inputNode.CustomValidation.getInvalidities();
			this.inputNode.setCustomValidity(message);
		}
	},
	registerListener: function(){
		var CustomValidation = this;
		this.inputNode.addEventListener('keyup', function(){
			CustomValidation.checkInput();
		})
	}
}

/*----------------------------------
	validity checks

	The arrays of validity checks for each input
	comprised of three things:
		1. isInvalid() - the function to determine if the input fulfills a particular requirement
		2. invalidityMessage - the error message to display if the field is invalid
		3. element - The element that states the requirement
----------------------------------*/

var usernameValidityChecks = [
	{
		isInvalid: function(input){
			return input.value.length < 6;
		},
		invalidityMessage: 'This input needs to be at least 6 characters',
		element: document.querySelector('#username_div .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input){
			var illegalCharacters = input.value.match(/[^a-zA-Z0-9]/g);
			return illegalCharacters ? true : false;
		},
		invalidityMessage: 'Only letters and numbers are allowed',
		element: document.querySelector('#username_div .input-requirements li:nth-child(2)')
	}
];

var passwordValidityChecks = [
	{
		isInvalid: function(input){
			return input.value.length < 8 | input.value.length > 30;
		},
		invalidityMessage: 'This input needs to be between 8 and 30 characters',
		element: document.querySelector('#password_div .input-requirements li:nth-child(1)')
	},
	{
		isInvalid: function(input){
			return !input.value.match(/[0-9]/g);
		},
		invalidityMessage: 'At least 1 number is required',
		element: document.querySelector('#password_div .input-requirements li:nth-child(2)')
	},
	{
		isInvalid: function(input){
			return !input.value.match(/[a-z]/g);
		},
		invalidityMessage: 'At least 1 lowercase letter is required',
		element: document.querySelector('#password_div .input-requirements li:nth-child(3)')
	},
	{
		isInvalid: function(input){
			return !input.value.match(/[A-Z]/g);
		},
		invalidityMessage: 'At least 1 uppercase letter is required',
		element: document.querySelector('#password_div .input-requirements li:nth-child(4)')
	},
	{
		isInvalid: function(input){
			return !input.value.match(/[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/g);
		},
		invalidityMessage: 'You need one of the required special characters',
		element: document.querySelector('#password_div .input-requirements li:nth-child(5)')
	}
];

var passwordRepeatValidityChecks = [
	{
		isInvalid: function(){
			return passwordRepeatInput.value != passwordInput.value;
		},
		invalidityMessage: 'This password needs to match the first one'
	}
];

/*----------------------------------
	setup CustomValidation

	Setup the CustomValidation prototype for each input
	Also sets which array of validity checks to use for that input
----------------------------------*/

var usernameInput = document.getElementById('username');
var passwordInput = document.getElementById('password');
var passwordRepeatInput = document.getElementById('password_repeat');

usernameInput.CustomValidation = new CustomValidation(usernameInput);
usernameInput.CustomValidation.validityChecks = usernameValidityChecks;

passwordInput.CustomValidation = new CustomValidation(passwordInput);
passwordInput.CustomValidation.validityChecks = passwordValidityChecks;

passwordRepeatInput.CustomValidation = new CustomValidation(passwordRepeatInput);
passwordRepeatInput.CustomValidation.validityChecks = passwordRepeatValidityChecks;

/*----------------------------------
	Event Listeners
----------------------------------*/

var inputs = document.querySelectorAll('input:not([type="submit"])'); //select elements that do not match given selector
var submit = document.querySelector('input[type="submit"]');
var form = document.getElementById('reg-form');

function validate(){
	for (var i = 0; i < inputs.length; i++){
		inputs[i].CustomValidation.checkInput();
	}
}
if (submit){
	submit.addEventListener('click', validate);
	form.addEventListener('submit', validate);
}
