const ratingEls = document.querySelectorAll(".rating");
const btnEl = document.getElementById("btn");
const containerEl = document.getElementById("container");

let selectedRating = "";

// Check for previous feedback in local storage
const previousFeedback = localStorage.getItem('userFeedback');
if (previousFeedback) {
    showThankYouMessage(JSON.parse(previousFeedback));
}

// Add keyboard navigation
ratingEls.forEach((ratingEl) => {
    ratingEl.addEventListener("click", (event) => handleRatingSelection(event));
    ratingEl.addEventListener("keypress", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleRatingSelection(event);
        }
    });
});

function handleRatingSelection(event) {
    removeActive();
    const target = event.target.closest('.rating');
    if (!target) return;

    selectedRating = target.querySelector('small').textContent;
    target.classList.add("active");
    target.setAttribute('aria-checked', 'true');
    
    // Enable submit button
    btnEl.removeAttribute('disabled');
    
    // Add animation to button
    btnEl.style.transform = 'scale(1.05)';
    setTimeout(() => {
        btnEl.style.transform = 'scale(1)';
    }, 200);
}

btnEl.addEventListener("click", () => {
    if (selectedRating !== "") {
        const feedback = {
            rating: selectedRating,
            timestamp: new Date().toISOString()
        };
        
        // Store in local storage
        localStorage.setItem('userFeedback', JSON.stringify(feedback));
        
        showThankYouMessage(feedback);
    }
});

function showThankYouMessage(feedback) {
    const date = new Date(feedback.timestamp);
    const formattedDate = date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    containerEl.innerHTML = `
        <div class="success-message">
            <strong>Thank you for your feedback!</strong>
            <br>
            <strong>You rated: ${feedback.rating}</strong>
            <p>We'll use your feedback to improve our customer support.</p>
            <p class="feedback-date">Submitted on: ${formattedDate}</p>
            <button class="btn" onclick="resetFeedback()">
                <i class="fas fa-redo"></i> Give New Feedback
            </button>
        </div>
    `;
}

function resetFeedback() {
    localStorage.removeItem('userFeedback');
    location.reload();
}

function removeActive() {
    ratingEls.forEach((ratingEl) => {
        ratingEl.classList.remove("active");
        ratingEl.setAttribute('aria-checked', 'false');
    });
}