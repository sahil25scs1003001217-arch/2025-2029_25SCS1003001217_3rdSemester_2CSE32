// =========================================================
// FOOTER YEAR
// =========================================================
document.getElementById("year").textContent = new Date().getFullYear();

// =========================================================
// DARK MODE TOGGLE (remembers choice using localStorage)
// =========================================================
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

function applyDarkMode(isDark) {
  body.classList.toggle("dark-mode", isDark);
  darkModeToggle.textContent = isDark ? "☀️" : "🌙";
}

// On page load, use the saved preference (if any)
const savedTheme = localStorage.getItem("theme");
applyDarkMode(savedTheme === "dark");

darkModeToggle.addEventListener("click", () => {
  const isDark = !body.classList.contains("dark-mode");
  applyDarkMode(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// =========================================================
// MOBILE MENU TOGGLE
// =========================================================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close the mobile menu after clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// =========================================================
// SCROLL REVEAL ANIMATION
// =========================================================
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  // Opt elements into the hidden starting state only once we know
  // we can actually reveal them again — avoids a blank page if this
  // script fails to run for any reason.
  revealItems.forEach((item) => item.classList.add("pre"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// =========================================================
// ACTIVE NAV LINK + SLIDING INDICATOR
// =========================================================
const sections = document.querySelectorAll(".section");
const navAnchors = document.querySelectorAll(".nav-links a");
const navIndicator = document.getElementById("navIndicator");

function slideIndicatorTo(link) {
  if (!link || !navIndicator) return;
  navIndicator.style.width = `${link.offsetWidth}px`;
  navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
}

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navAnchors.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
        const activeLink = document.querySelector(".nav-links a.active");
        slideIndicatorTo(activeLink);
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" } // triggers when a section is near the middle of the screen
);

sections.forEach((section) => navObserver.observe(section));

// Re-measure on window resize (link widths/positions can shift)
window.addEventListener("resize", () => {
  slideIndicatorTo(document.querySelector(".nav-links a.active"));
});

// Fonts loading late can shift text widths — nudge the indicator once
// everything has settled after the initial page load.
window.addEventListener("load", () => {
  slideIndicatorTo(document.querySelector(".nav-links a.active"));
});

// Google Fonts can finish loading slightly after "load" fires, which
// shifts text width — re-measure once the web font is actually ready.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    slideIndicatorTo(document.querySelector(".nav-links a.active"));
  });
}

// =========================================================
// TYPING EFFECT — hero "status" line in the code card
// =========================================================
const typedStatusEl = document.getElementById("typedStatus");
const statusMessages = ["Learning & Building", "Open to internships", "Building this site"];

let messageIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentMessage = statusMessages[messageIndex];

  if (!isDeleting) {
    charIndex++;
    typedStatusEl.textContent = currentMessage.slice(0, charIndex);
    if (charIndex === currentMessage.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1400); // pause before deleting
      return;
    }
  } else {
    charIndex--;
    typedStatusEl.textContent = currentMessage.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      messageIndex = (messageIndex + 1) % statusMessages.length;
    }
  }

  setTimeout(typeLoop, isDeleting ? 40 : 80);
}

// Respect users who prefer reduced motion — just show the first message
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) {
  typedStatusEl.textContent = statusMessages[0];
} else {
  typeLoop();
}

// =========================================================
// CONTACT FORM VALIDATION (no backend — practice only)
// =========================================================
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    showFeedback("Please fill in all fields before sending.", "error");
    return;
  }

  if (!email.includes("@")) {
    showFeedback("Please enter a valid email address.", "error");
    return;
  }

  // No backend yet — this is where you'd normally send data to a server.
  showFeedback("Thanks! Your message has been noted.", "success");
  contactForm.reset();
});

function showFeedback(text, type) {
  formFeedback.textContent = text;
  formFeedback.className = "form-feedback " + type;
}
