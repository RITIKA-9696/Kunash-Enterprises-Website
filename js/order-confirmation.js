// Order Confirmation Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initOrderConfirmation();
});

// Initialize order confirmation page
function initOrderConfirmation() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (!orderId) {
        // Try to get order from localStorage
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
        if (currentOrder && currentOrder.order) {
            displayOrderConfirmation(currentOrder);
        } else {
            showOrderNotFound();
        }
    } else {
        // In a real application, you would fetch order details from an API
        // For now, we'll use localStorage data
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
        if (currentOrder && currentOrder.order.orderId === orderId) {
            displayOrderConfirmation(currentOrder);
        } else {
            showOrderNotFound();
        }
    }
}

// Display order confirmation
function displayOrderConfirmation(orderData) {
    // Update order ID
    document.getElementById('orderId').textContent = orderData.order.orderId;
    
    // Display order items
    displayOrderItems(orderData.order.items);
    
    // Display order summary
    displayOrderSummary(orderData.order.summary);
    
    // Display shipping information
    displayShippingInfo(orderData.shipping, orderData.shippingMethod);
    
    // Display payment method
    displayPaymentMethod(orderData.paymentMethod);
    
    // Update dates
    updateOrderDates(orderData.order.timestamp);
}

// Display order items
function displayOrderItems(items) {
    const container = document.getElementById('orderItems');
    
    container.innerHTML = items.map(item => `
        <div class="order-item flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <img src="${item.image}" alt="${item.name}" 
                 class="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                 onerror="this.src='https://via.placeholder.com/80x80?text=Product'">
            <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 text-sm mb-1">${item.name}</h4>
                <p class="text-gray-500 text-xs mb-2">Quantity: ${item.quantity}</p>
                <div class="flex items-center justify-between">
                    <span class="text-green-600 font-bold">₹${(item.price * item.quantity).toLocaleString()}</span>
                    ${item.originalPrice ? `
                        <span class="text-gray-400 text-xs line-through">₹${(item.originalPrice * item.quantity).toLocaleString()}</span>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Display order summary
function displayOrderSummary(summary) {
    document.getElementById('subtotal').textContent = `₹${Math.round(summary.subtotal).toLocaleString()}`;
    document.getElementById('taxAmount').textContent = `₹${Math.round(summary.tax).toLocaleString()}`;
    document.getElementById('discount').textContent = `-₹${Math.round(summary.discount).toLocaleString()}`;
    document.getElementById('totalAmount').textContent = `₹${Math.round(summary.total).toLocaleString()}`;
    
    const shippingElement = document.getElementById('shippingCost');
    if (summary.shipping === 0) {
        shippingElement.textContent = 'FREE';
        shippingElement.className = 'font-medium text-green-600';
    } else {
        shippingElement.textContent = `₹${summary.shipping.toLocaleString()}`;
        shippingElement.className = 'font-medium text-gray-900';
    }
}

// Display shipping information
function displayShippingInfo(shipping, shippingMethod) {
    const addressContainer = document.getElementById('shippingAddress');
    const methodContainer = document.getElementById('shippingMethod');
    
    // Format shipping address
    addressContainer.innerHTML = `
        <p class="font-medium">${shipping.firstName} ${shipping.lastName}</p>
        <p>${shipping.address}</p>
        <p>${shipping.city}, ${shipping.state} ${shipping.pincode}</p>
        ${shipping.landmark ? `<p>Landmark: ${shipping.landmark}</p>` : ''}
    `;
    
    // Format shipping method
    let methodText = '';
    switch(shippingMethod) {
        case 'standard':
            methodText = 'Standard Delivery (3-5 business days)';
            break;
        case 'express':
            methodText = 'Express Delivery (1-2 business days) • ₹199';
            break;
        case 'same-day':
            methodText = 'Same Day Delivery • ₹399';
            break;
        default:
            methodText = 'Standard Delivery';
    }
    methodContainer.textContent = methodText;
}

// Display payment method
function displayPaymentMethod(paymentMethod) {
    const container = document.getElementById('paymentMethod');
    container.textContent = paymentMethod;
}

// Update order dates
function updateOrderDates(timestamp) {
    const orderDate = new Date(timestamp);
    const formattedDate = orderDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('orderDate').textContent = formattedDate;
    document.getElementById('timelineDate').textContent = formattedDate;
}

// Show order not found message
function showOrderNotFound() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="max-w-2xl mx-auto text-center py-16">
            <div class="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p class="text-gray-600 mb-8">We couldn't find the order you're looking for. It may have been cancelled or the order ID is incorrect.</p>
            <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <a href="products.html" class="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                    Continue Shopping
                </a>
                <a href="index.html" class="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                    Go to Homepage
                </a>
            </div>
        </div>
    `;
}

// Download invoice
function downloadInvoice() {
    showNotification('Preparing your invoice for download...', 'info');
    
    // Simulate invoice generation
    setTimeout(() => {
        showNotification('Invoice downloaded successfully!', 'success');
        
        // In a real application, this would trigger a file download
        // For demo purposes, we'll just show a success message
    }, 2000);
}

// Print order
function printOrder() {
    showNotification('Opening print dialog...', 'info');
    
    setTimeout(() => {
        window.print();
    }, 1000);
}

// Track order
function trackOrder() {
    showNotification('Opening order tracking page...', 'info');
    
    // In a real application, this would redirect to tracking page
    setTimeout(() => {
        showNotification('Tracking feature would open here', 'info');
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.order-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `order-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'error' ? 'fa-exclamation-circle' : 
                type === 'success' ? 'fa-check-circle' : 'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Update brand name in checkout.js
// In your existing checkout.js, update the brand name:
function updateBrandName() {
    // Replace any "TechBazaar" references with "Kunash Enterprises"
    // Update order ID generation to use "KE" prefix
}

// Update the order ID generation in checkout.js:
function generateOrderId() {
    return 'KE' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}