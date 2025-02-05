// pagination.js

// Current page variable
let currentPage = 1;
console.log("working");

// Get DOM elements
const content = document.getElementById('main-content');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const pageNumbers = document.querySelectorAll('.page-number');

// Function to update the content based on the current page
function updateContent(page) {
    // Example: Replace content with placeholder text
    content.innerHTML = `<p>Content for Page ${page}</p>`;
}

// Function to update the pagination UI
function updatePaginationUI() {

    // Disable "Previous" button on the first page
    prevButton.disabled = currentPage === 1;

    // Disable "Next" button on the last page (assume 10 for now)
    nextButton.disabled = currentPage === 10;

    // Highlight the active page number
    pageNumbers.forEach((pageNumber) => {
        if (parseInt(pageNumber.dataset.page, 10) === currentPage) {
            pageNumber.classList.add('active');
        } else {
            pageNumber.classList.remove('active');
        }
    });
}

// Event listeners for page numbers
pageNumbers.forEach((pageNumber) => {
    pageNumber.addEventListener('click', () => {
        const page = parseInt(pageNumber.dataset.page, 10);
        currentPage = page;
        console.log("page button clicked");
        updateContent(page);
        updatePaginationUI();
    });
});

// Event listeners for "Previous" and "Next" buttons
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateContent(currentPage);
        updatePaginationUI();
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < 10) {
        currentPage++;
        updateContent(currentPage);
        updatePaginationUI();
    }
});

// Initialize the pagination on page load
updateContent(currentPage);
updatePaginationUI();