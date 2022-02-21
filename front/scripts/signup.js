const form = document.querySelector('.js-signUpForm');
const formBtn = document.querySelector('.js-formBtn');

function validateUser(data){

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(
        data['username'].length > 5 && data['username'].length < 16 &&
        emailRegex.test(data['email']) && 
        data['password'].length > 7 && data['password'].length < 101 &&
        data['password'] === data['repeat_password']
    ){
        return true;
    }

    return false;
}

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    formBtn.disabled = true;
    
    let data = {};

    for(input of evt.target.elements){
        data[input.name] = input.value;
    }

    if(validateUser(data) === false){
        return showError('Please fill the form correctly');
    }

    delete data['repeat_password'];
    delete data['submit'];

    const request = await fetch('/users',{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const response = await request.json();

    if(request.status !== 202){
        return showError(response.message)
    }

    showError('You can login now. Have fun!', true)
    
});


function showError(msg, isPositive = false){

    if(document.querySelector('.js-formFeedback') !== null){
        document.querySelector('.js-formFeedback').remove();
    }

    let feedbackStatus = 'red';
    if(isPositive){
        feedbackStatus = 'green';
    }

    let htmlToInject = `
        <div class="js-formFeedback ${isPositive ? '-positive' :'' } form-feedback border border-${feedbackStatus}-200 p-2 rounded bg-${feedbackStatus}-100 text-${feedbackStatus}-800 text-center">
            <p role="alert" class="feedback-text font-semibold">${msg}</p>
        </div> 
    `;

    form.insertAdjacentHTML('beforebegin', htmlToInject);
    formBtn.disabled = false;
}