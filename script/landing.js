let passwordToggle;
let passwordInput;
let email ={}, password ={}, signInButton;
let ratingList = [];



//============================================================================================================================================================
//#region ==== Add event listeners //
const enableListeners = function(){
    console.log("enableListeners");
    email.input.addEventListener('blur', function(){
        console.log("BLUR event");
        let field = email.field;
        let input = email.input;
        let error = email.error;

        checkErrors(input, field, error);
    });

    if(signInButton){
        signInButton.addEventListener('click', function(event){
            event.preventDefault();
            if(!isEmpty(email.input.value) && isValidEmailAddress(email.input.value)){
                console.log("Succeeded to submit form!");
                console.log(`Email: ${email.input.value}`);
            }
            else{
                console.log("Failed to submit form!");
                let field = email.field;
                let input = email.input;
                let error = email.error;
                checkErrors(input, field, error);
            }
        });
    }
};

const checkErrors = function(input, field, error){
    if(isEmpty(input.value)){
        addErrors(field, error);
        input.removeEventListener('input', doubleCheckEmail); //to avoid multiple events
        input.addEventListener('input', doubleCheckEmail);
    }
    else if (!isValidEmailAddress(input.value)){
        addErrors(field, error, "Invalid email address");
        input.removeEventListener('input', doubleCheckEmail); //to avoid multiple events
        input.addEventListener('input', doubleCheckEmail);
    }
    else{
        removeErrors(field, error);
    }
};
//#endregion



//============================================================================================================================================================
//#region ==== isValid functions //
const isValidEmailAddress = function(emailAddress)
{
    // Basis manier om e-mailadres te checken.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function(fieldValue) {
    return !fieldValue || !fieldValue.length;
 };
//#endregion



//============================================================================================================================================================
//#region ==== Error functions //
const addErrors = function(formField, errorField, errorMessage = "This field is required"){
    console.log("Add error");
    //console.log(formField);
    formField.classList.add("has-error");
    signInButton.disabled = true;
    signInButton.classList.add("c-form__button--disabled");
    if(errorField){
        errorField.innerHTML = errorMessage;
        errorField.style.display = 'block'; //kan via class
    }
 };

 const removeErrors = function(formField, errorField){
    console.log("Remove error");
    //console.log(formField);
    formField.classList.remove("has-error");
    signInButton.classList.remove("c-form__button--disabled");
    signInButton.disabled = false;
    if(errorField){
        //errorField.innerHTML = "";
        errorField.style.display = 'none'; //kan via class
    }
};
//#endregion



//============================================================================================================================================================
//#region ==== Check functions //
const doubleCheckEmail = function(){
    console.log("INPUT EMAIL");
    let field = email.field;
    let input = email.input;
    let error = email.error;
    if(!isEmpty(input.value) && isValidEmailAddress(input.value)){
        removeErrors(field, error);
        input.removeEventListener('input', doubleCheckEmail);
    }
    else if(isEmpty(input.value)){
        addErrors(field, error);
    }
    else{
        addErrors(field, error, "Invalid email address");
    }
};
//#endregion



//============================================================================================================================================================
//#region ==== Get DOM elements //
const getDOMElements = function(){
    email.field = document.querySelector('.js-email-field');
    email.error = document.querySelector('.js-email-error');
    email.input = document.querySelector('.js-email-input')
    email.label = document.querySelector('.js-email-label')
    
    signInButton = document.querySelector('.js-sign-up-button');
};
//#endregion



//============================================================================================================================================================
//#region ==== DOMContentLoaded //
document.addEventListener('DOMContentLoaded', function () {
  console.log('Script loaded!');
  getDOMElements();
  enableListeners();
});
//#endregion
