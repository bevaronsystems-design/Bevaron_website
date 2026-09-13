// Render Lucide icons
lucide.createIcons();

// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menuBtn.setAttribute('aria-expanded', menuOpen);
  menuBtn.innerHTML = menuOpen
    ? '<i data-lucide="x" class="w-6 h-6"></i>'
    : '<i data-lucide="menu" class="w-6 h-6"></i>';
  mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0px';
  mobileMenu.style.opacity = menuOpen ? '1' : '0';
  lucide.createIcons();
});

document.querySelectorAll('#mobile-menu a').forEach(a => a.addEventListener('click', () => {
  menuOpen = false;
  mobileMenu.style.maxHeight = '0px';
  mobileMenu.style.opacity = '0';
  menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
  lucide.createIcons();
}));

// Demo form handler (no backend wired up — replace with your endpoint,
// or switch the <form> to Netlify Forms / Formspree)
function handleSubmit(e) {
  e.preventDefault();
  const status = document.getElementById('form-status');
  status.textContent = "Thanks — your request was received. We'll follow up within 48 hours.";
  status.classList.remove('hidden');
  e.target.reset();
  document.getElementById('file-label').textContent = 'Drop a file here or click to browse';
  return false;
}
