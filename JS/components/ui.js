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
      progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
    }
  }, { passive: true });
}

function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;
  const html = document.documentElement;
  const submenuWrapper = document.querySelector('.mobile-nav-link-wrapper');
  const submenuList = document.getElementById('mobile-submenu');
  const toggleIcon = document.querySelector('#mobile-submenu-toggle svg');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-active');
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden'; // Doble candado para iOS
    } else {
      body.style.overflow = '';
      html.style.overflow = '';
      if(submenuList) {
        submenuList.style.maxHeight = null;
        submenuList.classList.remove('expanded');
        if(toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
      }
    }
  });

  if (submenuWrapper && submenuList) {
    submenuWrapper.addEventListener('click', (e) => {
      e.preventDefault();
      submenuList.classList.toggle('expanded');
      if (submenuList.classList.contains('expanded')) {
        submenuList.style.maxHeight = submenuList.scrollHeight + "px";
        if(toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
      } else {
        submenuList.style.maxHeight = null;
        if(toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
      }
    });
  }
}

function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (['#', '#mujer', '#hombre', '#importados', '#esencias', '#combos'].includes(targetId)) return;

      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();

        // DESTRUIMOS CUALQUIER CANDADO DE SCROLL QUE HAYA QUEDADO
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        const mobileMenu = document.getElementById('mobile-menu');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if(menuToggle) menuToggle.classList.remove('is-active');
        }

        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });
}

window.UI = {
  init: () => {
    initHeaderScroll();
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
  }
};