document.addEventListener('DOMContentLoaded', function () {
    initCheckoutPage();
});

// Global variables
let cartItems = [];
let orderSummary = {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
};

// Initialize checkout page
function initCheckoutPage() {
    console.log('Initializing checkout page...');
    loadCartItems();
    setupEventListeners();
    updateCartCount();
    calculateOrderSummary();
    initializeShippingUI();
    initializePaymentUI();
}

// Load cart items from localStorage
function loadCartItems() {
    try {
        cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Cart items loaded:', cartItems);

        if (cartItems.length === 0) {
            showEmptyCartMessage();
            return;
        }

        displayOrderItems();
        calculateOrderSummary();
    } catch (error) {
        console.error('Error loading cart items:', error);
        showEmptyCartMessage();
    }
}

// Display cart items in order summary
function displayOrderItems() {
    const container = document.getElementById('orderItems');
    if (!container) {
        console.error('Order items container not found!');
        return;
    }

    container.innerHTML = cartItems.map(item => `
        <div class="order-summary-item flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <img src="${sanitizeHTML(item.image)}" alt="${sanitizeHTML(item.name)}" 
                 class="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                 onerror="this.src='https://via.placeholder.com/80x80?text=Product'">
            <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 text-sm truncate">${sanitizeHTML(item.name)}</h4>
                <p class="text-gray-500 text-xs mt-1">Qty: ${item.quantity}</p>
                <div class="flex items-center justify-between mt-2">
                    <span class="text-orange-600 font-semibold">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    ${item.originalPrice ? `
                        <span class="text-gray-400 text-xs line-through">₹${(item.originalPrice * item.quantity).toLocaleString('en-IN')}</span>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Calculate order summary
function calculateOrderSummary() {
    if (cartItems.length === 0) return;

    orderSummary.subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingRadio = document.querySelector('input[name="shipping"]:checked');
    orderSummary.shipping = shippingRadio ? {
        standard: 0,
        express: 199,
        'same-day': 399
    }[shippingRadio.value] || 0 : 0;
    orderSummary.tax = orderSummary.subtotal * 0.18;
    orderSummary.discount = orderSummary.subtotal > 50000 ? orderSummary.subtotal * 0.1 : 0;
    orderSummary.total = orderSummary.subtotal + orderSummary.tax + orderSummary.shipping - orderSummary.discount;

    updateOrderSummaryDisplay();
}

// Update order summary display
function updateOrderSummaryDisplay() {
    const elements = {
        subtotal: document.getElementById('subtotal'),
        taxAmount: document.getElementById('taxAmount'),
        discount: document.getElementById('discount'),
        shippingCost: document.getElementById('shippingCost'),
        totalAmount: document.getElementById('totalAmount')
    };

    if (elements.subtotal) elements.subtotal.textContent = `₹${Math.round(orderSummary.subtotal).toLocaleString('en-IN')}`;
    if (elements.taxAmount) elements.taxAmount.textContent = `₹${Math.round(orderSummary.tax).toLocaleString('en-IN')}`;
    if (elements.discount) elements.discount.textContent = `-₹${Math.round(orderSummary.discount).toLocaleString('en-IN')}`;
    if (elements.shippingCost) {
        elements.shippingCost.textContent = orderSummary.shipping === 0 ? 'FREE' : `₹${orderSummary.shipping.toLocaleString('en-IN')}`;
        elements.shippingCost.className = `font-medium ${orderSummary.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`;
    }
    if (elements.totalAmount) elements.totalAmount.textContent = `₹${Math.round(orderSummary.total).toLocaleString('en-IN')}`;
}

// Show empty cart message
function showEmptyCartMessage() {
    const container = document.getElementById('orderItems');
    if (!container) return;

    container.innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-600 mb-2">Your cart is empty</p>
            <p class="text-sm text-gray-500 mb-4">Add some items to proceed with checkout</p>
            <a href="products.html" class="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                Continue Shopping
            </a>
        </div>
    `;

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.classList.add('opacity-50', 'cursor-not-allowed');
        placeOrderBtn.classList.remove('hover:bg-orange-700', 'hover:shadow-xl');
    }
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Form submission
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submitted, processing checkout...');
            processCheckout();
        });
    } else {
        console.error('Checkout form not found!');
    }

    // Shipping method change
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', function () {
            console.log('Shipping method changed:', this.value);
            document.querySelectorAll('input[name="shipping"]').forEach(r => {
                const label = r.closest('label');
                if (label) {
                    label.classList.toggle('border-orange-500', r.checked);
                    label.classList.toggle('bg-orange-50', r.checked);
                    label.classList.toggle('border-gray-300', !r.checked);
                }
            });
            calculateOrderSummary();
        });
    });

    // Payment method selection
    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('click', function () {
            console.log('Payment method clicked:', this.querySelector('span').textContent);
            document.querySelectorAll('.payment-card').forEach(c => {
                c.classList.remove('selected', 'border-orange-500');
                c.classList.add('border-gray-300');
            });
            this.classList.add('selected', 'border-orange-500');
            this.classList.remove('border-gray-300');

            const cardDetails = document.getElementById('cardDetails');
            if (cardDetails) {
                cardDetails.classList.toggle('hidden', this.querySelector('span').textContent !== 'Credit/Debit Card');
            }
        });
    });

    // Real-time form validation
    setupFormValidation();
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    if (!form) {
        console.error('Form not found for validation');
        return;
    }

    const inputs = form.querySelectorAll('input[required], select[required]');
    console.log('Setting up validation for', inputs.length, 'inputs');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });
        input.addEventListener('input', function () {
            clearFieldError(this);
        });
    });

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (value.length > 16) value = value.slice(0, 16);
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
            if (value.length > 4) value = value.slice(0, 4);
            if (value.length >= 2) {
                e.target.value = value.slice(0, 2) + '/' + value.slice(2);
            } else {
                e.target.value = value;
            }
        });
    }

    // CVV formatting
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function (e) {
            let value = e.target.value.replace(/[^0-9]/gi, '');
            if (value.length > 4) value = value.slice(0, 4);
            e.target.value = value;
        });
    }
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.id) {
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            errorMessage = 'Please enter a valid email address';
            break;
        case 'phone':
            isValid = /^[6-9]\d{9}$/.test(value);
            errorMessage = 'Please enter a valid 10-digit phone number';
            break;
        case 'pincode':
            isValid = /^\d{6}$/.test(value);
            errorMessage = 'Please enter a valid 6-digit PIN code';
            break;
        case 'cardNumber':
            if (field.value && !document.getElementById('cardDetails').classList.contains('hidden')) {
                isValid = /^\d{16}$/.test(field.value.replace(/\s/g, ''));
                errorMessage = 'Please enter a valid 16-digit card number';
            }
            break;
        case 'expiryDate':
            if (field.value && !document.getElementById('cardDetails').classList.contains('hidden')) {
                isValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(field.value);
                if (isValid) {
                    const [month, year] = field.value.split('/');
                    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                    isValid = expiry > new Date();
                    errorMessage = isValid ? '' : 'Card has expired';
                } else {
                    errorMessage = 'Please enter a valid expiry date (MM/YY)';
                }
            }
            break;
        case 'cvv':
            if (field.value && !document.getElementById('cardDetails').classList.contains('hidden')) {
                isValid = /^\d{3,4}$/.test(field.value);
                errorMessage = 'Please enter a valid CVV (3 or 4 digits)';
            }
            break;
        default:
            isValid = value !== '';
            errorMessage = 'This field is required';
    }

    if (!isValid && value !== '') {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    const errorDiv = document.getElementById(`${field.id}-error`);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.parentElement.classList.add('error');
    }
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = document.getElementById(`${field.id}-error`);
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.parentElement.classList.remove('error');
    }
}

// Process checkout with payment handling
function processCheckout() {
    console.log('Processing checkout...');

    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const form = document.getElementById('checkoutForm');
    if (!form) {
        showNotification('Form not found', 'error');
        return;
    }

    const inputs = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification('Please fix the errors in the form before proceeding', 'error');
        return;
    }

    const selectedPaymentCard = document.querySelector('.payment-card.selected');
    if (!selectedPaymentCard) {
        showNotification('Please select a payment method', 'error');
        return;
    }

    const paymentMethod = selectedPaymentCard.querySelector('span').textContent;
    if (paymentMethod === 'Credit/Debit Card' && !validateCardDetails()) {
        showNotification('Please check your card details', 'error');
        return;
    }

    const orderData = {
        contact: {
            email: sanitizeHTML(document.getElementById('email').value),
            phone: sanitizeHTML(document.getElementById('phone').value),
            newsletter: document.getElementById('newsletter')?.checked || false
        },
        shipping: {
            firstName: sanitizeHTML(document.getElementById('firstName').value),
            lastName: sanitizeHTML(document.getElementById('lastName').value),
            address: sanitizeHTML(document.getElementById('address').value),
            city: sanitizeHTML(document.getElementById('city').value),
            state: sanitizeHTML(document.getElementById('state').value),
            pincode: sanitizeHTML(document.getElementById('pincode').value),
            landmark: sanitizeHTML(document.getElementById('landmark')?.value || '')
        },
        shippingMethod: document.querySelector('input[name="shipping"]:checked')?.value || 'standard',
        paymentMethod: paymentMethod,
        paymentDetails: getPaymentDetails(),
        order: {
            items: cartItems,
            summary: orderSummary,
            orderId: generateOrderId(),
            timestamp: new Date().toISOString()
        }
    };

    console.log('Order data collected:', orderData);

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (!placeOrderBtn) {
        showNotification('Error: Place order button not found', 'error');
        return;
    }

    const originalText = placeOrderBtn.innerHTML;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing Payment...';
    placeOrderBtn.disabled = true;

    processPayment(orderData)
        .then(paymentResult => {
            console.log('Payment result:', paymentResult);
            if (paymentResult.success) {
                completeOrder(orderData, paymentResult);
            } else {
                showNotification(`Payment failed: ${paymentResult.message}`, 'error');
                resetPlaceOrderButton(placeOrderBtn, originalText);
            }
        })
        .catch(error => {
            console.error('Payment processing error:', error);
            showNotification('Payment processing failed. Please try again.', 'error');
            resetPlaceOrderButton(placeOrderBtn, originalText);
        });
}

// Validate card details
function validateCardDetails() {
    const fields = [
        { id: 'cardNumber', regex: /^\d{16}$/, message: 'Please enter a valid 16-digit card number' },
        { id: 'expiryDate', regex: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Please enter a valid expiry date (MM/YY)' },
        { id: 'cvv', regex: /^\d{3,4}$/, message: 'Please enter a valid CVV (3 or 4 digits)' },
        { id: 'cardName', regex: /.+/, message: 'Please enter name on card' }
    ];

    let isValid = true;

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input && !document.getElementById('cardDetails').classList.contains('hidden')) {
            const value = input.value.replace(/\s/g, '');
            if (!field.regex.test(value)) {
                showFieldError(input, field.message);
                isValid = false;
            } else if (field.id === 'expiryDate') {
                const [month, year] = value.split('/');
                const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                if (expiry < new Date()) {
                    showFieldError(input, 'Card has expired');
                    isValid = false;
                }
            }
        }
    });

    return isValid;
}

// Get payment details based on method
function getPaymentDetails() {
    const selectedPaymentCard = document.querySelector('.payment-card.selected');
    if (!selectedPaymentCard) return {};

    const paymentMethod = selectedPaymentCard.querySelector('span').textContent;

    switch (paymentMethod) {
        case 'Credit/Debit Card':
            return {
                cardNumber: sanitizeHTML(document.getElementById('cardNumber')?.value.replace(/\s/g, '') || ''),
                expiryDate: sanitizeHTML(document.getElementById('expiryDate')?.value || ''),
                cvv: sanitizeHTML(document.getElementById('cvv')?.value || ''),
                cardName: sanitizeHTML(document.getElementById('cardName')?.value || ''),
                lastFour: document.getElementById('cardNumber')?.value.slice(-4) || ''
            };
        case 'UPI':
            return { upiId: 'will_be_provided', method: 'upi' };
        case 'Net Banking':
            return { bank: 'selected_bank', method: 'netbanking' };
        case 'Cash on Delivery':
            return { method: 'cod', paymentOnDelivery: true };
        default:
            return {};
    }
}

// Process payment (simulated)
function processPayment(orderData) {
    return new Promise((resolve, reject) => {
        console.log('Processing payment for:', orderData.paymentMethod);

        setTimeout(() => {
            const paymentMethod = orderData.paymentMethod;
            let success = true;
            let message = 'Payment processed successfully';

            if (paymentMethod === 'Credit/Debit Card') {
                if (Math.random() < 0.15) {
                    success = false;
                    const failures = ['Insufficient funds', 'Card declined', 'Invalid card details', 'Transaction timeout'];
                    message = failures[Math.floor(Math.random() * failures.length)];
                }
            } else if (paymentMethod === 'UPI') {
                if (Math.random() < 0.05) {
                    success = false;
                    message = 'UPI transaction failed';
                }
            } else if (paymentMethod === 'Net Banking') {
                if (Math.random() < 0.10) {
                    success = false;
                    message = 'Bank transaction failed';
                }
            }

            console.log('Payment result:', { success, message });

            resolve({
                success: success,
                message: message,
                transactionId: success ? 'TXN_' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase() : null,
                paymentMethod: paymentMethod,
                timestamp: new Date().toISOString()
            });
        }, 2000);
    });
}

// Complete order after successful payment
function completeOrder(orderData, paymentResult) {
    console.log('Completing order...');

    orderData.paymentResult = paymentResult;
    orderData.status = 'confirmed';
    orderData.order.confirmedAt = new Date().toISOString();

    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    saveToOrderHistory(orderData);
    localStorage.removeItem('cart');
    updateCartCount();
    showNotification('Order placed successfully! Redirecting...', 'success');

    setTimeout(() => {
        window.location.href = `order-confirmation.html?orderId=${orderData.order.orderId}`;
    }, 1500);
}

// Save order to order history
function saveToOrderHistory(orderData) {
    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    orderHistory.unshift(orderData);
    if (orderHistory.length > 50) {
        orderHistory = orderHistory.slice(0, 50);
    }
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

// Reset place order button
function resetPlaceOrderButton(button, originalText) {
    if (button) {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Generate random order ID
function generateOrderId() {
    return 'KE' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);

    const existingNotification = document.querySelector('.checkout-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `checkout-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${
        type === 'error' ? 'bg-red-500' :
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white`;

    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'success' ? 'fa-check-circle' : 'fa-info-circle'
            } mr-2"></i>
            <span>${sanitizeHTML(message)}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Initialize shipping method UI
function initializeShippingUI() {
    const defaultShipping = document.querySelector('input[name="shipping"][value="standard"]');
    if (defaultShipping) {
        defaultShipping.checked = true;
        const label = defaultShipping.closest('label');
        if (label) {
            label.classList.add('border-orange-500', 'bg-orange-50');
            label.classList.remove('border-gray-300');
        }
    }
}

// Initialize payment method UI
function initializePaymentUI() {
    const firstPaymentCard = document.querySelector('.payment-card');
    if (firstPaymentCard) {
        firstPaymentCard.click();
    }
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}