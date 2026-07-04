/* ==========================================================================
   KREYBA ESSENCES - Lógica de Interfaz de Usuario (UI)
   ========================================================================== */

/**
 * Inicializa los eventos de scroll dinámicos para el Header y barra de progreso.
 */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  const progressBar = document.getElementById('scroll-progress');
  
  if (!header) return;

  window.addEventListener('scroll', () => {
    // Calculo del scroll actual
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // 1. Cambio de estado del Header (Reducción y sombra)
    if (scrollTop > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 2. Cálculo de barra de progreso superior
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }
    }
  }, { passive: true }); // passive: true mejora radicalmente el rendimiento de scroll en móviles
}

/**
 * Control del alternador de Modo Oscuro (Premium Add-on)
 */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    // Nota: Guardaremos este estado en LocalStorage más adelante en el módulo state.js
  });
}

// Exportamos o auto-ejecutamos para la fase inicial de desarrollo local
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initThemeToggle();
});