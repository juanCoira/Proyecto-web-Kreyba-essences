/* ==========================================================================
   KREYBA ESSENCES - Punto de Entrada de la Aplicación
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializamos la UI
  window.UI.init();

  // Cargamos los productos para testeo visual
  loadTestProducts();
});

/**
 * Función temporal para inyectar tarjetas y probar la responsividad del layout
 */
async function loadTestProducts() {
  try {
    const response = await fetch('js/data/products.json');
    if (!response.ok) throw new Error('Error al cargar JSON');
    
    const products = await response.json();
    const grid = document.getElementById('test-product-grid');
    
    if (!grid) return;

    grid.innerHTML = products.map(product => `
      <div style="border: 1px solid var(--glass-border); padding: var(--spacing-sm); border-radius: var(--radius-lg); background: var(--glass-bg); display: flex; flex-direction: column; gap: var(--spacing-xs);">
        <img src="${product.image}" alt="${product.name}" style="border-radius: var(--radius-md); width: 100%; aspect-ratio: 3/4; object-fit: cover;">
        <div style="padding: var(--spacing-xs) 0;">
          <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-gold-mate);">${product.category}</p>
          <h3 style="font-size: 1.25rem; font-weight: 400;">${product.name}</h3>
          <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-bottom: var(--spacing-sm);">Inspirado en: ${product.inspiredBy}</p>
          <p style="font-weight: 500; font-size: 1.1rem;">$${product.price.toLocaleString('es-AR')}</p>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error cargando los productos:', error);
  }
}