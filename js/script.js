// let amount = 9;
let page = 1;
let totalPages = 6;
let imgContainers;
const scrollOffset = (document.querySelector("#header").offsetHeight) -80;

document.addEventListener("DOMContentLoaded", function () {
    //if page = 1 then get 9 text jokes ... else get 10
    //if page != 1 then hide song container show first text container
    imgContainers = document.querySelectorAll(".column > .img-joke-container");
    hideLoadingScreen(); 
    // fetchTest(); 
});


document.querySelectorAll(".prevPage").forEach(button => {
        button.addEventListener("click", () => {
        if (page > 1) {
            page--;
            showLoadingScreen();
            hideLoadingScreen();
            window.scrollTo({ top: scrollOffset, behavior: "smooth" });
        }
        
    });
});

document.querySelectorAll(".nextPage").forEach(button => {
    button.addEventListener("click", () => {
        if (page < totalPages) {
            page++;
            showLoadingScreen();
            hideLoadingScreen();
            window.scrollTo({ top: scrollOffset, behavior: "smooth" });
        }
    
    });
});

document.querySelectorAll(".firstPage").forEach(button => {
    button.addEventListener("click", () => {
        page = 1;
        showLoadingScreen();
        hideLoadingScreen();
        window.scrollTo({ top: scrollOffset, behavior: "smooth" });   
    });
});

document.querySelectorAll(".lastPage").forEach(button => {
    button.addEventListener("click", () => {
        page = totalPages;
        showLoadingScreen();
        hideLoadingScreen();
        window.scrollTo({ top: scrollOffset, behavior: "smooth" });  
    });
});



async function fetchJokes() {
    
    updatePaginationButtons();

    await handleFirstSlot(page);

    if (page < 4) {
        imgContainers.forEach(container => {
            container.classList.add("img-joke-container");
            container.classList.remove("text-joke-container", "border-style-4");
            container.style.display = "flex";
            if (!container.querySelector("img.img-joke")) {
                const img = document.createElement("img");
                img.classList.add("img-joke");
                container.prepend(img);
            }
        })
        
        fetchTextJokes(page);
        fetchImageJokes(page);
    } else {
        imgContainers.forEach(container => {
            container.classList.remove("img-joke-container");
            container.classList.add("text-joke-container", "border-style-4");
            container.style.display = "flex";
            const img = container.querySelector("img.img-joke");
            if (img) {img.remove();}
        })
        
        console.log("page: "+ page + "    total pages: " + totalPages);
          
    }
    if (page === totalPages) {
        fetchTextJokes(page).then( () => adjustColumns());
    } else {
        // Restore all columns when navigating away from the last page
        document.querySelectorAll(".column").forEach(column => {
            column.style.display = "flex"; // Ensure all columns are visible
            // column.style.width = "33%"; // Reset to default width
            column.classList.remove("hidden");
        });

    fetchTextJokes(page);
           
    }  
}



async function handleFirstSlot(page) {
    const container = document.getElementById("first-slot")
    if (page === 1) {
        const response = await fetch(`/api/jokes/song`);
        const data = await response.json();

        console.log("Fetched Data: ", data);
        console.log("Song Image:", data.songImage[0]); 
        console.log("Song Audio:", data.songAudio[0]);
            
        const songImage = data.songImage[0]?.image_path;  
        const songAudio = data.songAudio[0]?.image_path;

        container.innerHTML = `
            <div class="song-container">
                <img id="song-img" src="${songImage}" alt="Captain LOL Theme Song Artwork">
                <audio controls> 
                    <source title="Captain LOL Theme Song" src="${songAudio}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <div class="separator"></div>
            </div>`;  
    } else {
        container.innerHTML = `
                <div class="text-joke-container first-slot-text border-style-3"></div>`; //modify css for text joke in first slot
    }
}



async function fetchTextJokes(page) {
    return fetch(`/api/jokes/text?page=${page}`)
        .then(response => response.json())
        .then(data => {
            console.log("Page: " + page);
            console.log("Fetched Text Jokes:", data);  // Debugging output
            totalPages = data.totalPages;
            const jokeContainers = document.querySelectorAll('.text-joke-container');

            jokeContainers.forEach(container => {
                container.innerHTML = ""; // Clear all previous jokes before inserting new ones
            });
            
            data.jokes.forEach((joke, index) => {
                if (jokeContainers[index]) {
                    jokeContainers[index].innerHTML = `<p class="text-joke">${joke.joke_text}</p>
                                           <p class="joke-credit">Joke by ${joke.joke_credit}</p>
                                           <div class="separator"></div>`;
                    jokeContainers[index].style.display = "flex"; //show container when filled
                }
            });
            //remove extra containers on last page
            if (page === totalPages) {
                for (let i = data.jokes.length; i < jokeContainers.length; i++) {
                    jokeContainers[i].style.display = "none";
                    jokeContainers[i].classList.add("hidden");
                }
            } else {
                jokeContainers.forEach(container => {
                    if (container.style.display === "none") {
                        container.style.display = "flex";
                        container.classList.remove("hidden"); // Ensure it's visible again
                    }
                });
            }
        })
        .catch(error => console.error("Error fetching jokes:", error));
}

function fetchImageJokes(page) {
    fetch(`/api/jokes/image?page=${page}`)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched image Jokes:", data);  // Debugging output
            const jokesContainer = document.querySelectorAll('.img-joke-container');
            
            jokesContainer.forEach((container, index) => {
                const joke = data.jokes[index];
                if (joke) {
                    container.innerHTML = `<img class="img-joke" src="${joke.image_path}" alt="Joke Image">
                                            <div class="separator"></div>`;
                }
            });
        })
        .catch(error => console.error("Error fetching jokes:", error));
}

function updatePaginationButtons() {
    document.querySelectorAll(".currentPage").forEach(element => {
        element.innerHTML = page;
    });
    document.querySelectorAll(".prevPage").forEach(button => {
        button.classList.toggle("disabled", page === 1);
    });

    document.querySelectorAll(".nextPage").forEach(button => {
        button.classList.toggle("disabled", page === totalPages);
    });

    document.querySelectorAll(".firstPage").forEach(button => {
        button.classList.toggle("disabled", page === 1);
    });

    document.querySelectorAll(".lastPage").forEach(button => {
        button.classList.toggle("disabled", page === totalPages);
    });
}



function adjustColumns() {
    const columns = document.querySelectorAll(".column");
    let visibleColumns = 0;
  
    columns.forEach(column => {
      // Get all joke containers within the column
      const jokeContainers = column.querySelectorAll(".text-joke-container");
      let hasVisibleJoke = false;
      jokeContainers.forEach(container => {
        // If any container is not hidden (i.e. display is not "none"), mark the column as having content.
        if (container.style.display !== "none") {
            hasVisibleJoke = true;
        }
      });
      if (hasVisibleJoke) {
        column.style.display = "flex";
        visibleColumns++;
      } else {
        column.style.display = "none";
      }
    });
  
    // Adjust the main content container's justification based on the number of visible columns.
    const mainContent = document.querySelector(".main-content");
    if (visibleColumns === 1) {
      mainContent.style.justifyContent = "center";
    } else if (visibleColumns === 2) {
      mainContent.style.justifyContent = "center";
    } else {
      mainContent.style.justifyContent = "space-evenly";
    }
  }

async function hideLoadingScreen() {
    try {
        // Wait for your fetch function to complete loading data into the DOM
        await fetchJokes();
      } catch (error) {
        console.error("Error loading jokes:", error);
      } finally {
        // Wait 2 seconds before hiding the loader and showing the main content
        setTimeout(() => {
          document.getElementById('loader').style.display = 'none';
          document.querySelector('.main-content').style.display = 'flex';
          document.querySelector('#book-section').style.display = 'flex';
        }, 500); // 2000 milliseconds = 2 seconds
      }
}

function showLoadingScreen() {
    document.getElementById('loader').style.display = 'flex';
    document.querySelector('.main-content').style.display = 'none';
    document.querySelector('#book-section').style.display = 'none';
}


document.getElementById('mailing-list-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Validate the form (the browser should already do this if the field is 'required')
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
  
    const email = document.getElementById('mailing-list-email').value;
  
    fetch('/api/mailing-list/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    .then(response => {
      if (response.ok) return response.text();
      else return response.text().then(text => { throw new Error(text || "Subscription failed"); });
    })
    .then(message => {
      document.getElementById('mailing-list-message').textContent = message;
      // Optionally clear the email field after successful subscription
      document.getElementById('mailing-list-email').value = "";
    })
    .catch(error => {
      document.getElementById('mailing-list-message').textContent = error.message;
    });
  });
//end

