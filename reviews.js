// Get references to the form elements
const reviewForm = document.getElementById("review-form");
const reviewText = document.getElementById("review-text");
const userName = document.getElementById("user-name");
const reviewsContainer = document.getElementById("reviews-container");

// Load existing reviews from localStorage when the page loads
document.addEventListener("DOMContentLoaded", loadReviews);

// Handle form submission
reviewForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const review = reviewText.value.trim();
  const name = userName.value.trim();

  if (review && name) {
    // Create a new review object
    const newReview = {
        name: name,
      text: review
    };

    // Store the new review in localStorage
    saveReview(newReview);

    // Reset the form fields
    reviewText.value = "";
    userName.value = "";

    // Re-load reviews to display the new one
    loadReviews();
  }
});

// Save review to localStorage
function saveReview(review) {
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.push(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

// Load and display all reviews from localStorage
function loadReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviewsContainer.innerHTML = ""; // Clear current reviews

  // Loop through all the reviews and display them
  reviews.forEach(review => {
    const reviewItem = document.createElement("div");
    reviewItem.classList.add("review-item");

    // Create the review content
    reviewItem.innerHTML = `
      <p>"${review.text}"</p>
      <span>- ${review.name}</span>
    `;

    // Append the review to the container
    reviewsContainer.appendChild(reviewItem);
  });
}
