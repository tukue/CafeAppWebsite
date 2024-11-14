// Cart state management
let cart = [];
let cartTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    setupEventListeners();
    initializeCart();
});

// Load menu items from API
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        const menuItems = await response.json();
        displayMenuItems(menuItems);
    } catch (error) {
        console.error('Error loading menu:', error);
        showNotification('Failed to load menu items', 'error');
    }
}

// Display menu items in the grid
function displayMenuItems(items) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image">
                <img src="${item.image}?auto=format&fit=crop&w=400&h=300" 
                     alt="${item.name}"
                     loading="lazy">
            </div>
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-price">$${item.price.toFixed(2)}</p>
                <p class="menu-item-description">${item.description}</p>
                <button class="btn btn-primary add-to-cart" 
                        data-id="${item.id}"
                        data-name="${item.name}"
                        data-price="${item.price}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Set up all event listeners
function setupEventListeners() {
    // Menu filter buttons
    setupFilterButtons();
    
    // Cart modal
    setupCartModal();
    
    // Add to cart buttons
    setupAddToCartButtons();
    
    // Checkout button
    setupCheckoutButton();
}

// Initialize cart from localStorage
function initializeCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
}

// Setup filter buttons
function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMenu(btn.dataset.category);
        });
    });
}

// Setup cart modal
function setupCartModal() {
    const cartIcon = document.querySelector('.cart-icon');
    const modal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close-modal');


    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Setup add to cart buttons
function setupAddToCartButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const item = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                quantity: 1
            };
            addToCart(item);
        }
    });
}

// Setup checkout button
function setupCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'warning');
            return;
        }
        processCheckout();
    });
}

// Filter menu items by category
function filterMenu(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${item.name} added to cart`, 'success');
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="btn-quantity" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}
                <button class="btn-quantity" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                <button class="btn-remove" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

// Process checkout
async function processCheckout() {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            })
        });

        if (response.ok) {
            cart = [];
            localStorage.removeItem('cart');
            updateCartDisplay();
            showNotification('Order placed successfully!', 'success');
            document.getElementById('cart-modal').style.display = 'none';
        } else {
            throw new Error('Failed to process order');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Failed to process order', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        opacity: 0;
        transform: translateY(-100%);
        transition: all 0.3s ease;
        z-index: 9999;
    }
    
    .notification.success { background-color: #2ecc71; }
    .notification.error { background-color: #e74c3c; }
    .notification.warning { background-color: #f1c40f; }
    .notification.info { background-color: #3498db; }
`;
document.head.appendChild(style);

