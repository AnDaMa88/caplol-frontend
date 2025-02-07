// let amount = 9;
let page = 1;
let totalPages = 6;
let imgContainers;
const scrollOffset = (document.querySelector("#header").offsetHeight) -80;

document.addEventListener("DOMContentLoaded", function () {
    //if page = 1 then get 9 text jokes ... else get 10
    //if page != 1 then hide song container show first text container
    imgContainers = document.querySelectorAll(".main-content > .img-joke-container");
    fetchJokes(); 
    // fetchTest(); 
});

document.querySelectorAll(".prevPage").forEach(button => {
        button.addEventListener("click", () => {
        if (page > 1) {
            page--;
            fetchJokes();
            window.scrollTo({ top: scrollOffset, behavior: "smooth" });
        }
        
    });
});

document.querySelectorAll(".nextPage").forEach(button => {
    button.addEventListener("click", () => {
        if (page < totalPages) {
            page++;
            fetchJokes();
            window.scrollTo({ top: scrollOffset, behavior: "smooth" });
        }
    
    });
});

document.querySelectorAll(".firstPage").forEach(button => {
    button.addEventListener("click", () => {
        page = 1;
        fetchJokes();
        window.scrollTo({ top: scrollOffset, behavior: "smooth" });   
    });
});

document.querySelectorAll(".lastPage").forEach(button => {
    button.addEventListener("click", () => {
        page = totalPages;
        fetchJokes();
        window.scrollTo({ top: scrollOffset, behavior: "smooth" });  
    });
});



function fetchJokes() {
    
    updatePaginationButtons();

    handleFirstSlot(page);

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
        
        fetchTextJokes(page);

        
    }
    
}





function handleFirstSlot(page) {
    const container = document.getElementById("first-slot")
    if (page === 1) {
        fetch(`http://localhost:8080/api/jokes/song`)
        .then(response => response.json())
        .then(data => {
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
                </div>`;
        })
    } else {
        container.innerHTML = `
                <div class="text-joke-container first-slot-text border-style-3"></div>`; //modify css for text joke in first slot
    }
}



function fetchTextJokes(page) {
    fetch(`http://localhost:8080/api/jokes/text?page=${page}`)
        .then(response => response.json())
        .then(data => {
            console.log(page);
            console.log("Fetched Text Jokes:", data);  // Debugging output
            totalPages = data.totalPages;
            const jokeContainers = document.querySelectorAll('.text-joke-container');

            jokeContainers.forEach(container => {
                container.innerHTML = ""; // Clear all previous jokes before inserting new ones
            });
            
            data.jokes.forEach((joke, index) => {
                if (jokeContainers[index]) {
                    jokeContainers[index].innerHTML = `<p class="text-joke">${joke.joke_text}</p>
                                           <p class="joke-credit">${joke.joke_credit}</p>`;
                    jokeContainers[index].style.display = "flex"; //show container when filled
                }
            });
            //remove extra containers on last page
            if (page === totalPages) {
                for (let i = data.jokes.length; i < jokeContainers.length; i++) {
                    jokeContainers[i].style.display = "none";
                }
            } else {
                jokeContainers.forEach(container => {
                    if (container.style.display === "none") {
                        container.style.display = "flex"; // Ensure it's visible again
                    }
                });
            }
        })
        .catch(error => console.error("Error fetching jokes:", error));
}

function fetchImageJokes(page) {
    fetch(`http://localhost:8080/api/jokes/image?page=${page}`)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched image Jokes:", data);  // Debugging output
            const jokesContainer = document.querySelectorAll('.img-joke-container');
            
            jokesContainer.forEach((container, index) => {
                const joke = data.jokes[index];
                if (joke) {
                    container.innerHTML = `<img class="img-joke" src="${joke.image_path}" alt="Joke Image">`;
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













function fetchTest() {
    fetch(`http://localhost:8080/api/jokes/text?page=1&amount=1`)
    .then(response => response.json())
    .then(data => {
        const textContainers = document.querySelectorAll('.test-container');
        textContainers.forEach((container, index) => {
            const joke = data.jokes[index]; 
            container.innerHTML = `aso;dkhfj;alkwfjlkasjdflkjflkjwefjwe  CHASDCHASDKCHJWALEJ d klashjdlkjs dlk cjlk`;
        })
    })
}

