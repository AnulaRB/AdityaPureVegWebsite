// ============================================================
//  Aditya Pure Veg — Reviews (Firebase Firestore backend)
// ============================================================

// ── STEP 1: Paste your Firebase config here ──────────────────
//  Go to: https://console.firebase.google.com
//  → Create a project → Add a Web App → Copy the firebaseConfig object
//  → Also go to Firestore Database → Create database (start in test mode)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE",
};

// ── Init ─────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const COLLECTION = "reviews";

// ── DOM refs ─────────────────────────────────────────────────
const form        = document.getElementById("review-form");
const nameInput   = document.getElementById("user-name");
const textInput   = document.getElementById("review-text");
const container   = document.getElementById("reviews-container");
const submitBtn   = document.getElementById("submit-btn");
const starInputs  = document.querySelectorAll(".star-input");
const starDisplay = document.querySelector(".stars-select");

let selectedRating = 0;

// ── Star rating interaction ───────────────────────────────────
starInputs.forEach((star) => {
  // Hover preview
  star.addEventListener("mouseover", () => highlightStars(+star.dataset.value));
  star.addEventListener("mouseout",  () => highlightStars(selectedRating));
  // Click to select
  star.addEventListener("click", () => {
    selectedRating = +star.dataset.value;
    highlightStars(selectedRating);
    starDisplay.dataset.selected = selectedRating;
  });
});

function highlightStars(count) {
  starInputs.forEach((s) => {
    s.classList.toggle("active", +s.dataset.value <= count);
  });
}

// ── Submit review ─────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name   = nameInput.value.trim();
  const text   = textInput.value.trim();
  const rating = selectedRating;

  if (!name || !text) return;
  if (rating === 0) {
    showError("Please select a star rating before submitting.");
    return;
  }

  submitBtn.disabled    = true;
  submitBtn.textContent = "Submitting…";

  try {
    await addDoc(collection(db, COLLECTION), {
      name,
      text,
      rating,
      createdAt: serverTimestamp(),
    });

    // Reset form
    nameInput.value   = "";
    textInput.value   = "";
    selectedRating    = 0;
    highlightStars(0);
    starDisplay.dataset.selected = 0;

    showSuccess("Thank you for your review! 🙏");
    await loadReviews(); // Refresh list
  } catch (err) {
    console.error("Error saving review:", err);
    showError("Something went wrong. Please try again.");
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = "Submit Review";
  }
});

// ── Load reviews from Firestore ───────────────────────────────
async function loadReviews() {
  container.innerHTML = `<p class="loading-msg">Loading reviews…</p>`;

  try {
    const q        = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `<p class="loading-msg">No reviews yet — be the first! 🌟</p>`;
      return;
    }

    container.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      container.appendChild(buildCard(data));
    });
  } catch (err) {
    console.error("Error loading reviews:", err);
    container.innerHTML = `<p class="loading-msg error-msg">Could not load reviews. Check your Firebase config.</p>`;
  }
}

// ── Build a review card element ───────────────────────────────
function buildCard({ name, text, rating, createdAt }) {
  const card = document.createElement("div");
  card.className = "review-item";

  const stars = renderStars(rating || 0);
  const date  = createdAt?.toDate
    ? formatDate(createdAt.toDate())
    : "Just now";

  card.innerHTML = `
    <div class="review-header">
      <span class="reviewer-name">${escapeHtml(name)}</span>
      <span class="review-stars">${stars}</span>
    </div>
    <p class="review-text">${escapeHtml(text)}</p>
    <span class="review-date">📅 ${date}</span>
  `;

  return card;
}

// ── Helpers ───────────────────────────────────────────────────
function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="${i < rating ? "star filled" : "star"}">★</span>`
  ).join("");
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

function showSuccess(msg) {
  showToast(msg, "toast-success");
}

function showError(msg) {
  showToast(msg, "toast-error");
}

function showToast(msg, cls) {
  const existing = document.getElementById("review-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id        = "review-toast";
  toast.className = `review-toast ${cls}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", loadReviews);
