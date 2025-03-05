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

//log in
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    fetch('http://localhost:8080/users/login', {
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
        toggleContainer('moderator-container');
    })
    .catch(error => {
        document.getElementById('message').textContent = error.message; //create an error message to pop up
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


//show pending
document.getElementById('pending-button').addEventListener('click', function() {
    const token = localStorage.getItem('jwtToken');
    fetch('http://localhost:8080/moderator/jokes/pending', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { 
          throw new Error(text || "Failed to fetch pending jokes"); 
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Pending jokes:", data);
      const pendingContainer = document.getElementById('pending-container');
      pendingContainer.innerHTML = ""; // Clear any previous content

      if (data.length === 0) {
        document.getElementById('message').textContent = "There are no pending jokes at this time";
      } else {
        // data is an array of Joke objects
      data.forEach(joke => {
        // Create a new div element for each joke
        const jokeDiv = document.createElement('div');
        jokeDiv.classList.add('text-joke-container');
        
        // Fill the div with the joke's content
        jokeDiv.innerHTML = `
          <p class="text-joke">${joke.joke_text}</p>
          <p class="joke-credit">Joke by ${joke.joke_credit}</p>
          <button class="user-buttons approve-button" data-id="${joke.id}">Approve</button>
          <button class="user-buttons-2 delete-button" data-id="${joke.id}">Delete</button>
          <div class="separator"></div>
        `;
        pendingContainer.appendChild(jokeDiv);
      });
    
      // Attach event listeners for the approve/delete buttons
      document.querySelectorAll('.approve-button').forEach(button => {
        button.addEventListener('click', function() {
          const jokeId = this.getAttribute('data-id');
          approveJoke(jokeId);
        });
      });
      document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
          const jokeId = this.getAttribute('data-id');
          deleteJoke(jokeId);
        });
      });
      }
    
      toggleContainer('pending-container');
    })
    .catch(error => {
      console.error("Error fetching pending jokes:", error);
    });
  });
  

  //approve
  function approveJoke(jokeId) {
    const token = localStorage.getItem('jwtToken');
    fetch(`http://localhost:8080/moderator/jokes/${jokeId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { 
          throw new Error(text || "Failed to approve joke"); 
        });
      }
      return response.text();
    })
    .then(message => {
      console.log("Approval response:", message);
      document.getElementById('message').textContent = message;
      // Optionally refresh the pending jokes list
      document.getElementById('pending-button').click();
    })
    .catch(error => {
      console.error("Error approving joke:", error);
    });
  }

//delete joke
function deleteJoke(jokeId) {
    const token = localStorage.getItem('jwtToken');
    fetch(`http://localhost:8080/moderator/jokes/${jokeId}/delete`, {
      method: 'POST',  // or DELETE if your backend is configured to accept DELETE
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { 
          throw new Error(text || "Failed to delete joke"); 
        });
      }
      return response.text();
    })
    .then(message => {
      console.log("Delete response:", message);
      document.getElementById('message').textContent = message + "....reloading pending jokes";

      setTimeout(() => {
        // Refresh the pending jokes list
      document.getElementById('pending-button').click();
    }, 3000); // 2000 milliseconds = 3 seconds

      
    })
    .catch(error => {
      console.error("Error deleting joke:", error);
      document.getElementById('message').textContent = error.message;
    });
  }