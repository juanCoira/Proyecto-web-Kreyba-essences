/* ==========================================================================
   KREYBA ESSENCES - Punto de Entrada de la Aplicación
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializamos la Interfaz de Usuario
  if(window.UI) {
    window.UI.init();
  }

  // 2. Cargamos el catálogo dinámico
  renderProducts();
});

/**
 * Función que obtiene el JSON y renderiza las Cards Premium
 */
async function renderProducts() {
  try {
    const response = await fetch('./js/data/products.json');
    if (!response.ok) throw new Error('Error al cargar la base de datos de productos.');
    
    const products = await response.json();
    const grid = document.getElementById('product-grid');
    
    if (!grid) return;

    // Mapeamos los productos a nuestro nuevo HTML premium
    grid.innerHTML = products.map(product => {
      
      // Lógica para crear las etiquetas (Badges) dinámicamente
      let badgesHTML = '';
      if (product.badges && product.badges.length > 0) {
        badgesHTML = `<div class="badges-container">
                        ${product.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                      </div>`;
      }

      return `
        <article class="product-card">
          <div class="product-image-container">
            ${badgesHTML}
            <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
          </div>
          
          <div class="product-info">
            <span class="product-category">${product.categoryName}</span>
            <h3 class="product-name">${product.name}</h3>
            <span class="product-inspiration">Inspirado en: ${product.inspiredBy}</span>
            <span class="product-price">$${product.price.toLocaleString('es-AR')}</span>
            
            <button class="btn-add-cart" onclick="console.log('Agregado: ${product.name}')">
              Agregar al Carrito
            </button>
          </div>
        </article>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error cargando los productos:', error);
    const grid = document.getElementById('product-grid');
    if(grid) {
      grid.innerHTML = `<p style="text-align:center; width:100%; color:var(--color-text-muted);">El catálogo se está actualizando. Vuelve en unos instantes.</p>`;
    }
  }
}