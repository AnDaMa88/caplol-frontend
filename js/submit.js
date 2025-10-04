document.addEventListener("DOMContentLoaded", function () {
    hideLoadingScreen();
    toggleContainer('login-container');
    
});

function hideLoadingScreen() {  
    // Wait 2 seconds before hiding the loader and showing the main content
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.querySelector('.main-content-submit').style.display = 'flex';
    }, 500); // 2000 milliseconds = 2 seconds
    }

function showLoadingScreen() {
    document.getElementById('loader').style.display = 'flex';
    document.querySelector('.main-content').style.display = 'none';
}


//log in
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.text().then(text => {
                throw new Error(text || "Login failed");
            })
        }      
    })
    .then(data => {
        localStorage.setItem('jwtToken', data.token);
        document.getElementById('message').textContent = "Login successful!";
        toggleContainer('submission-container');
    })
    .catch(error => {
        document.getElementById('message').textContent = error.message; //create an error message to pop up
    });
});

const registerform = document.getElementById('register-form');
registerform.addEventListener('submit', function(event) {

    event.preventDefault();
    if (!this.checkValidity()) {
        this.reportValidity();
        return;
    }

    const firstName = document.getElementById('reg-first-name').value;
    const lastInitial = document.getElementById('reg-last-init').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const city = document.getElementById('reg-city').value;
    const state = document.getElementById('reg-state').value;
    const oldEnough = document.getElementById('reg-old-enough').checked;

    fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName,
            lastInitial,
            email,
            password,
            oldEnough,
            city,
            state
        })
    })
    .then(response => response.text())
    .then(message => {
        document.getElementById('message').textContent = message;
        // After registration, the user should check their email for verification.
        toggleContainer('login-container');
    })
    .catch(error => {
        document.getElementById('message').textContent = error.message;
    });
});

const createAccountButton = document.getElementById('create-account-button');
createAccountButton.addEventListener('click', function() {
    toggleContainer('register-container');
});

const backToLoginButton = document.getElementById('back-to-login-button');
backToLoginButton.addEventListener('click', function() {
    toggleContainer('login-container');
});


function toggleContainer(targetId) {
    // Remove 'visible' from all containers with class 'user-container'
    const containers = document.querySelectorAll('.user-container');
    containers.forEach(container => {
      container.classList.remove('visible');
      // Optionally, also add a hidden class:
      container.classList.add('hidden');
    });
    // Add 'visible' and remove 'hidden' from the target container
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add('visible');
      target.classList.remove('hidden');
    }
  }


//for selecting joke type and showing correct container
document.getElementById('joke-type').addEventListener('change', function() {
    // Hide all fields initially
    document.querySelectorAll('.joke-fields').forEach(function(div) {
      div.style.display = 'none';
    });
    
    // Show the selected field group based on the selected value
    const selectedType = this.value;
    if (selectedType === 'qa') {
      document.getElementById('qa-fields').style.display = 'flex';
    } else if (selectedType === 'knock') {
      document.getElementById('knock-fields').style.display = 'flex';
    } else if (selectedType === 'dialogue') {
      document.getElementById('dialogue-fields').style.display = 'flex';
    }
  });



//handle submissions
const submitJokeButton = document.getElementById('submit-joke-button');
submitJokeButton.addEventListener('click', function() {
    // Determine joke type from dropdown
    const jokeType = document.getElementById('joke-type').value;
    let jokeText = "";
    if (jokeType === 'qa') {
        const question = document.getElementById('qa-question').value;
        const answer = document.getElementById('qa-answer').value;
        jokeText = `<span class="question">${question}</span><br><span class="answer">${answer}</span>`;
    } else if (jokeType === 'knock') {
        const knockResponse = document.getElementById('knock-response').value;
        const knockFinal = document.getElementById('knock-final').value;
        jokeText = `<span class="question">Knock, knock.</span><br>
                    <span class="answer">Who’s there?</span><br>
                    <span class="question">${knockResponse}.</span><br>
                    <span class="answer">${knockResponse} who?</span><br>
                    <span class="question">${knockFinal}</span>`;
    } else if (jokeType === 'dialogue') {
        const speaker1 = document.getElementById('speaker-1').value;
        const dialogue1 = document.getElementById('dialogue-1').value;
        const speaker2 = document.getElementById('speaker-2').value;
        const dialogue2 = document.getElementById('dialogue-2').value;
        const speaker3 = document.getElementById('speaker-3').value;
        const dialogue3 = document.getElementById('dialogue-3').value;
        const speaker4 = document.getElementById('speaker-4').value;
        const dialogue4 = document.getElementById('dialogue-4').value;
        // Extend with more dialogue fields if needed.
        jokeText = `<span class="dialogue-1">${speaker1}: </span>${dialogue1}<br>
                    <span class="dialogue-1">${speaker2}: </span>${dialogue2}`;
        if (speaker3 !== "" && dialogue3 !== "") {
            jokeText += `<br>
                         <span class="dialogue-1">${speaker3}: </span>${dialogue3}`;
        }
        if (speaker4 !== "" && dialogue4 !== "") {
            jokeText += `<br>
                         <span class="dialogue-1">${speaker4}: </span>${dialogue4}<br>`;
        }
    }
    //maybe remove this because user should be logged in to see submit button
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        document.getElementById('message').textContent = "Please log in first.";
        toggleContainer('login-container');
        return;
    }
    fetch('/api/jokes/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ jokeText })
    })
    .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          // Read the backend error message from the response body
          return response.text().then(text => {
            // If the response text is empty, use a fallback message
            throw new Error(text || (response.status === 401 ? "Session expired, please log in again." : "Joke submission failed"));
          });
        }
      })
    .then(message => {
    document.getElementById('message').textContent = message;
    document.getElementById('submission-container').classList.remove('visible');
    document.getElementById('submission-container').classList.add('hidden');
    })
    .catch(error => {
    document.getElementById('message').textContent = error.message;
    document.getElementById('submission-container').classList.remove('visible');
    document.getElementById('submission-container').classList.add('hidden');
    if (error.message.includes("expired")) {
        localStorage.removeItem('jwtToken');
        toggleContainer('login-container');
    }
    });
});

// Handle Logout
document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('jwtToken');
    document.getElementById('message').textContent = "Logged out successfully.";
    document.getElementById('login-email').value = "";
    document.getElementById('login-password').value = "";
    toggleContainer('login-container');
      
});

//handle tooltips
document.querySelectorAll('#register-form input.submit-input').forEach(input => {
  input.addEventListener('focus', function() {
    // Assuming the tooltip is the very next sibling
    const tooltip = this.nextElementSibling;
    if (tooltip && tooltip.classList.contains('tooltip')) {
      tooltip.textContent = this.getAttribute('title');
      tooltip.style.display = 'flex';
    }
  });
  
  input.addEventListener('blur', function() {
    const tooltip = this.nextElementSibling;
    if (tooltip && tooltip.classList.contains('tooltip')) {
      tooltip.style.display = 'none';
    }
  });
});
