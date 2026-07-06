/* ==========================================================================
   KREYBA ESSENCES - Motor del Carrito de Compras (LocalStorage & WhatsApp)
   ========================================================================== */

window.Cart = (function() {
  // Estado local del carrito
  let cart = [];
  const WHATSAPP_NUMBER = "5491125117007"; 

  // Elementos del DOM
  let cartOverlay, cartSidebar, cartCloseBtn, cartToggleBtns;
  let itemsContainer, subtotalEl, totalEl, badgeEl, checkoutBtn, emptyBtn;

  function init() {
    // 1. Recuperar datos de LocalStorage
    const storedCart = localStorage.getItem('kreyba_cart');
    if (storedCart) cart = JSON.parse(storedCart);

    // 2. Vincular elementos del DOM
    cartOverlay = document.getElementById('cart-overlay');
    cartSidebar = document.getElementById('cart-sidebar');
    cartCloseBtn = document.getElementById('cart-close');
    cartToggleBtns = document.querySelectorAll('#cart-toggle');
    
    itemsContainer = document.getElementById('cart-items-container');
    subtotalEl = document.getElementById('cart-subtotal');
    totalEl = document.getElementById('cart-total');
    badgeEl = document.getElementById('cart-count');
    checkoutBtn = document.getElementById('btn-checkout');
    emptyBtn = document.getElementById('btn-empty-cart');

    // 3. Configurar Event Listeners
    setupEvents();

    // 4. Renderizado inicial
    updateUI();
  }

  function setupEvents() {
    // Abrir carrito
    cartToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => toggleCart(true));
    });

    // Cerrar carrito
    if(cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleCart(false));
    if(cartOverlay) {
      cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) toggleCart(false);
      });
    }

    // Vaciar carrito
    if(emptyBtn) {
      emptyBtn.addEventListener('click', () => {
        if(confirm("¿Estás seguro de vaciar el carrito?")) {
          cart = [];
          saveCart();
          updateUI();
        }
      });
    }

    // Finalizar compra (WhatsApp)
    if(checkoutBtn) {
      checkoutBtn.addEventListener('click', processCheckout);
    }
  }

  function toggleCart(show) {
    if(!cartOverlay) return;
    if (show) {
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Bloquea scroll de fondo
    } else {
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function add(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    
    saveCart();
    updateUI();
    toggleCart(true); // Abrir panel al agregar
  }

  function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if(item) {
      item.qty += change;
      if (item.qty <= 0) remove(id);
      else {
        saveCart();
        updateUI();
      }
    }
  }

  function remove(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateUI();
  }

  function saveCart() {
    localStorage.setItem('kreyba_cart', JSON.stringify(cart));
  }

  function updateUI() {
    if (!itemsContainer) return;

    let total = 0;
    let count = 0;
    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
      itemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío. Descubre nuestras esencias.</p>';
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.5';
      checkoutBtn.style.cursor = 'not-allowed';
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.cursor = 'pointer';

      cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        count += item.qty;

        itemsContainer.innerHTML += `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <div>
                <h4 class="cart-item-title">${item.name}</h4>
                <span class="cart-item-price">$${item.price.toLocaleString('es-AR')}</span>
              </div>
              <div class="cart-item-actions">
                <div class="qty-selector">
                  <button class="qty-btn" onclick="window.Cart.updateQty('${item.id}', -1)">-</button>
                  <span class="qty-value">${item.qty}</span>
                  <button class="qty-btn" onclick="window.Cart.updateQty('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="window.Cart.remove('${item.id}')">Eliminar</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    // Actualizar Totales y Badges
    if(subtotalEl) subtotalEl.textContent = `$${total.toLocaleString('es-AR')}`;
    if(totalEl) totalEl.textContent = `$${total.toLocaleString('es-AR')}`;
    if(badgeEl) badgeEl.textContent = count;
  }

  function processCheckout() {
    if (cart.length === 0) return;

    let total = 0;
    let message = "Hola!%0AQuiero realizar el siguiente pedido:%0A%0A";

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      message += `*Producto:* ${item.name} (${item.categoryName})%0A`;
      message += `*Cantidad:* ${item.qty}%0A`;
      message += `*Precio:* $${item.price.toLocaleString('es-AR')}%0A`;
      message += `---------------------------%0A`;
    });

    message += `%0A*TOTAL: $${total.toLocaleString('es-AR')}*%0A%0A`;
    message += `Muchas gracias.`;

    // CAMBIO CLAVE: Usamos wa.me
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // El truco infalible: Crear un enlace invisible y simular un clic nativo
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Exponer métodos públicamente
  return {
    init,
    add,
    updateQty,
    remove
  };
})();