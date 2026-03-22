// ============================================================
//  Aditya Pure Veg — Chatbot (options-only, always fixed)
// ============================================================

// ── Conversation tree ────────────────────────────────────────
const MENU = {
  root: {
    message: "Namaste! 🙏 How can I help you today?",
    options: [
      { label: "🍽️ Menu & Food",     next: "food"     },
      { label: "🛵 Delivery",         next: "delivery" },
      { label: "⏰ Hours & Location", next: "hours"    },
      { label: "📞 Contact Us",       next: "contact"  },
    ],
  },
  food: {
    message: "What would you like to know about our food?",
    options: [
      { label: "What cuisines do you serve?", next: "cuisines"  },
      { label: "Do you have a full menu?",    next: "viewmenu"  },
      { label: "Is everything vegetarian?",   next: "veg"       },
      { label: "⬅️ Back",                     next: "root"      },
    ],
  },
  cuisines: {
    message: "We serve North Indian, South Indian, and Indo-Chinese cuisines — all pure vegetarian! 🥗",
    options: [
      { label: "See the full menu", next: "viewmenu" },
      { label: "⬅️ Main Menu",      next: "root"     },
    ],
  },
  viewmenu: {
    message: "You can browse our full menu right here on the website! Click below to open it. 📖",
    options: [
      { label: "📋 Open Menu Page", action: () => window.location.href = "./menu.html" },
      { label: "⬅️ Main Menu",      next: "root" },
    ],
  },
  veg: {
    message: "Yes! 🌿 We are 100% pure vegetarian. No eggs, no meat — ever!",
    options: [
      { label: "⬅️ Main Menu", next: "root" },
    ],
  },
  delivery: {
    message: "We offer free home delivery on orders above ₹300! 🛵",
    options: [
      { label: "What are the contact numbers?", next: "contact"       },
      { label: "What is the delivery area?",    next: "deliveryarea"  },
      { label: "⬅️ Main Menu",                  next: "root"          },
    ],
  },
  deliveryarea: {
    message: "We currently deliver in and around Pimpri-Chinchwad, Pune. Call us to confirm your area! 📍",
    options: [
      { label: "📞 Get Contact Numbers", next: "contact" },
      { label: "⬅️ Main Menu",           next: "root"    },
    ],
  },
  hours: {
    message: "We are open daily for lunch and dinner. Visit us at our Pimpri, Pune location! 📍",
    options: [
      { label: "See us on the map", action: () => window.location.href = "./contact.html" },
      { label: "⬅️ Main Menu",      next: "root" },
    ],
  },
  contact: {
    message: "📞 Call us for orders or enquiries:\n\n• 8803677999\n• 8802677999\n• 8983677999\n• 9689677999",
    options: [
      { label: "⬅️ Main Menu", next: "root" },
    ],
  },
};

// ── DOM refs (created once, shared across all pages) ──────────
let chatBox, chatDisplay, chatBtn;

function buildChatUI() {
  // Remove any existing inline chat markup added in HTML files
  document.querySelectorAll('#chat-button, #chat-box').forEach(el => el.remove());

  // Chat button
  chatBtn = document.createElement('div');
  chatBtn.id = 'chat-button';
  chatBtn.innerHTML = '💬';
  chatBtn.setAttribute('aria-label', 'Open chat');
  document.body.appendChild(chatBtn);

  // Chat box
  chatBox = document.createElement('div');
  chatBox.id = 'chat-box';
  chatBox.innerHTML = `
    <div id="chat-header">
      <strong>Aditya Assistant</strong>
      <span id="chat-close" title="Close">✖</span>
    </div>
    <div id="chat-display"></div>
  `;
  document.body.appendChild(chatBox);

  chatDisplay = document.getElementById('chat-display');

  // Toggle open/close
  chatBtn.addEventListener('click', toggleChat);
  document.getElementById('chat-close').addEventListener('click', toggleChat);
}

function toggleChat() {
  const isOpen = chatBox.classList.toggle('open');
  chatBtn.classList.toggle('open', isOpen);
  // Show root menu the first time it's opened
  if (isOpen && chatDisplay.children.length === 0) {
    showNode('root');
  }
}

// ── Render a conversation node ────────────────────────────────
function showNode(key) {
  const node = MENU[key];
  if (!node) return;

  addBotMessage(node.message);

  // Remove any old option buttons
  const oldOptions = chatDisplay.querySelector('.options-row');
  if (oldOptions) oldOptions.remove();

  // Build new option buttons
  const row = document.createElement('div');
  row.className = 'options-row';

  node.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'chat-option-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      // Show what the user picked
      addUserMessage(opt.label);
      // Remove option buttons immediately
      row.remove();
      // Navigate
      if (opt.action) {
        opt.action();
      } else if (opt.next) {
        setTimeout(() => showNode(opt.next), 300);
      }
    });
    row.appendChild(btn);
  });

  chatDisplay.appendChild(row);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function addBotMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'bot-msg';
  // Support newlines in message text
  msg.innerHTML = text.replace(/\n/g, '<br>');
  chatDisplay.appendChild(msg);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function addUserMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'user-msg';
  msg.textContent = text;
  chatDisplay.appendChild(msg);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// ── Navbar hamburger (kept here so index.js isn't needed everywhere) ──
function initNavbar() {
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;
  toggle.addEventListener('click', () => navLinks.classList.toggle('active'));
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildChatUI();
  initNavbar();
});
