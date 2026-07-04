/* ==========================================================================
   KREYBA ESSENCES - Lógica de Interfaz de Usuario (UI)
   ========================================================================== */

function initHeaderScroll() {
  const header = document.getElementById('main-header');
  const progressBar = document.getElementById('scroll-progress');
  
  if (!header) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollTop > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0 && progressBar) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
  }, { passive: true });
}

function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;
  const submenuToggleBtn = document.getElementById('mobile-submenu-toggle');
  const submenuList = document.getElementById('mobile-submenu');

  if (!menuToggle || !mobileMenu) return;

  // Abrir/Cerrar menú principal
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-active');
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
      // Resetear submenú al cerrar
      if(submenuList) {
        submenuList.style.maxHeight = null;
        submenuList.classList.remove('expanded');
        submenuToggleBtn.querySelector('svg').style.transform = 'rotate(0deg)';
      }
    }
  });

  // Lógica del Acordeón para "Productos"
  if (submenuToggleBtn && submenuList) {
    submenuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      submenuList.classList.toggle('expanded');
      
      if (submenuList.style.maxHeight) {
        submenuList.style.maxHeight = null;
        submenuToggleBtn.querySelector('svg').style.transform = 'rotate(0deg)';
      } else {
        submenuList.style.maxHeight = submenuList.scrollHeight + "px";
        submenuToggleBtn.querySelector('svg').style.transform = 'rotate(180deg)';
      }
    });
  }

  // Cerrar menú al hacer click en links finales
  const mobileLinks = mobileMenu.querySelectorAll('a:not(.mobile-nav-link-wrapper a)');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('is-active');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
    });
  });
}

window.UI = {
  init: () => {
    initHeaderScroll();
    initThemeToggle();
    initMobileMenu();
  }
};