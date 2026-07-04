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
  const submenuWrapper = document.querySelector('.mobile-nav-link-wrapper');
  const submenuList = document.getElementById('mobile-submenu');
  const toggleIcon = document.querySelector('#mobile-submenu-toggle svg');

  if (!menuToggle || !mobileMenu) return;

  // Abrir/Cerrar menú principal desde la hamburguesa
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-active');
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
      if(submenuList) {
        submenuList.style.maxHeight = null;
        submenuList.classList.remove('expanded');
        if(toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
      }
    }
  });

  // Lógica del Acordeón para "Productos"
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

/**
 * NUEVO: Sistema robusto de navegación para anclas (#nosotros, #contacto, etc.)
 */
function initSmoothScroll() {
  // Seleccionamos todos los enlaces que empiezan con "#"
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Si el enlace es solo un # vacío o apunta a los dropdowns internos, lo ignoramos
      if (targetId === '#' || targetId === '#mujer' || targetId === '#hombre' || targetId === '#importados' || targetId === '#esencias' || targetId === '#combos') return;

      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault(); // Detenemos el salto brusco y roto del navegador

        // 1. Cerramos el menú móvil (si está abierto) y devolvemos la movilidad a la página
        const mobileMenu = document.getElementById('mobile-menu');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if(menuToggle) menuToggle.classList.remove('is-active');
          document.body.style.overflow = '';
        }

        // 2. Esperamos 50ms (imperceptible) para asegurar que la página ya es scrolleable, y luego viajamos a la sección
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start' // Asegura que el título quede en la parte superior
          });
        }, 50);
      }
    });
  });
}

// Exportamos las funciones al objeto global UI para que main.js lo inicie
window.UI = {
  init: () => {
    initHeaderScroll();
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll(); // Inicializamos el nuevo sistema de navegación
  }
};