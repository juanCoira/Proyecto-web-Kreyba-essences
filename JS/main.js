/* ==========================================================================
   KREYBA ESSENCES - Punto de Entrada de la Aplicación
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializamos UI y Carrito
  if(window.UI) window.UI.init();
  if(window.Cart) window.Cart.init();

  // 2. Cargamos el catálogo dinámico
  renderProducts();

  // 3. Lógica del Formulario de Contacto hacia WhatsApp
  initContactForm();
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

    grid.innerHTML = products.map(product => {
      let badgesHTML = '';
      if (product.badges && product.badges.length > 0) {
        badgesHTML = `<div class="badges-container">
                        ${product.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                      </div>`;
      }

      // Convertimos el objeto a un string seguro para pasarlo en el onclick
      const productData = JSON.stringify(product).replace(/"/g, '&quot;');

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
            
            <button class="btn-add-cart" onclick="window.Cart.add(${productData})">
              Agregar al Carrito
            </button>
          </div>
        </article>
      `;
    }).join('');
    
  } catch (error) {
    console.error('Error cargando los productos:', error);
  }
}

function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const waText = `Hola Kreyba Essences!%0A%0AMi nombre es: ${encodeURIComponent(name)}%0ACorreo: ${encodeURIComponent(email)}%0A%0A*Consulta:*%0A${encodeURIComponent(message)}`;
    const waNumber = "5491125117007"; 
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
    
    // CAMBIO: En lugar de crear elementos y hacer clic, usamos window.location.href directo.
    // Esto es interpretado por el navegador como un cambio de página, no como una ventana emergente.
    window.location.href = waUrl;
    
    contactForm.reset();
  });
}
