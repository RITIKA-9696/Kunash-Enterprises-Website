// Products Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products page
    initProductsPage();
});

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 9;
let currentFilters = {
    categories: [],
    brands: [],
    conditions: [],
    ram: [],
    cpu: [],
    accessories: [],
    maxPrice: 100000
};

// Initialize products page
function initProductsPage() {
    loadProducts();
    setupEventListeners();
}

// Load products from API or local JSON
async function loadProducts() {
    try {
        // Show loading state
        document.getElementById('productsGrid').innerHTML = `
            <div class="col-span-3 text-center py-10">
                <i class="fas fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
                <p class="text-gray-600">Loading products...</p>
            </div>
        `;

        // In a real implementation, this would be an API call
        // For now, we'll use sample data
        const products = await fetchProducts();
        
        allProducts = products;
        filteredProducts = [...allProducts];
        
        // Populate filters
        populateFilters();
        
        // Display products
        displayProducts();
        
        // Update product count
        updateProductCount();
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div class="col-span-3 text-center py-10">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <p class="text-gray-600">Error loading products. Please try again later.</p>
            </div>
        `;
    }
}

// Fetch products (simulate API call)
async function fetchProducts() {
    // In a real implementation, this would be:
    // const response = await fetch('/api/products');
    // return await response.json();
    
    // For now, return sample data
    return [
        {
            id: 1,
            name: "Gaming Laptop Pro",
            description: "High performance gaming laptop with RTX graphics",
            minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            image: "images/P1.png",
            category: "New Laptops",
            brand: "Dell",
            condition: "Best Seller",
            ram: "16GB",
            cpu: "Intel i7",
            accessories: [],
            inStock: true,
            isFeatured: true,
            tags: ["gaming", "high-performance"]
        },
        {
            id: 2,
            name: "Business Ultrabook",
            description: "Sleek and powerful for professionals",
           minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            image: "images/p2.png",
            category: "New Laptops",
            brand: "HP",
            condition: "Best Seller",
            ram: "8GB",
            cpu: "Intel i5",
            accessories: [],
            inStock: true,
            isFeatured: false,
            tags: ["business", "ultrabook"]
        },
        {
            id: 3,
            name: "Wireless / Wired Keyboard & Mouse",
            description: "Ergonomic design with long battery life",
           minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            image: "images/p3.jpg",
            category: "Accessories",
            brand: "Dell",
            condition: "Best Seller",
            ram: null,
            cpu: null,
            accessories: ["keyboard", "mouse"],
            inStock: true,
            isFeatured: true,
            tags: ["wireless", "keyboard", "mouse", "wired"]
        },
        {
            id: 4,
            name: "Desktop Workstation",
            description: "Powerful desktop for professionals",
           minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            image: "images/p4.jpg",
            category: "Desktops",
            brand: "Apple",
            condition: "New",
            ram: "32GB",
            cpu: "Intel i9",
            accessories: [],
            inStock: true,
            isFeatured: false,
            tags: ["workstation", "desktop"]
        },
        {
            id: 5,
            name: "Gaming Monitor",
            description: "27-inch 144Hz gaming monitor",
            minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            image: "images/p11.png",
            category: "Accessories",
            brand: "HP",
            condition: "New",
            ram: null,
            cpu: null,
            accessories: ["monitor"],
            inStock: true,
            isFeatured: true,
            tags: ["gaming", "monitor"]
        },
        {
            id: 6,
            name: "Laptop Bag",
            description: "Durable and stylish laptop bag",
                minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            image: "images/p6.jpg",
            category: "Accessories",
            brand: "Lenovo",
            condition: "Best Seller",
            ram: null,
            cpu: null,
            accessories: ["bag"],
            inStock: true,
            isFeatured: false,
            tags: ["bag", "accessory"]
        },
        {
            id: 7,
            name: "Refurbished Laptop Elite",
            description: "Like-new condition with warranty",
            minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            originalPrice: 60000,
            image: "images/p7.png",
            category: "Old Laptops",
            brand: "Dell",
            condition: "Best Seller",
            ram: "8GB",
            cpu: "Intel i5",
            accessories: [],
            inStock: true,
            isFeatured: true,
            tags: ["refurbished", "budget"]
        },
        {
            id: 8,
            name: "Gaming Mouse",
            description: "High precision gaming mouse with RGB",
            minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            image: "images/p8.png",
            category: "Accessories",
            brand: "Razer",
            condition: "Best Seller",
            ram: null,
            cpu: null,
            accessories: ["mouse"],
            inStock: true,
            isFeatured: false,
            tags: ["gaming", "mouse"]
        },
        {
            id: 9,
            name: "Professional Laptop",
            description: "Business laptop with security features",
            minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            originalPrice: 85000,
            image: "images/p9.jpg",
            category: "New Laptops",
            brand: "Lenovo",
            condition: "Best Seller",
            ram: "16GB",
            cpu: "Intel i7",
            accessories: [],
            inStock: true,
            isFeatured: false,
            tags: ["business", "professional"]
        },
        {
            id: 10,
            name: "Refurbished Gaming Laptop",
            description: "High-performance refurbished gaming laptop",
            minPrice: 80000,    // Minimum price
        maxPrice: 120000,   // Maximum price
            originalPrice: 70000,
            image: "images/p10.png",
            category: "Refurbished",
            brand: "Lenovo",
            condition: "Best Seller",
            ram: "16GB",
            cpu: "Intel i7",
            accessories: [],
            inStock: true,
            isFeatured: true,
            tags: ["refurbished", "gaming"]
        }
    ];
}

// Populate filter options
function populateFilters() {
    populateCategoryFilter();
    populateBrandFilter();
    populateConditionFilter();
    populateRamFilter();
    populateCpuFilter();
    populateAccessoriesFilter();
}

function populateCategoryFilter() {
    const categories = [...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('categoryFilter');
    
    container.innerHTML = categories.map(category => `
        <label class="flex items-center">
            <input type="checkbox" class="form-checkbox text-orange-600 category-filter" value="${category}">
            <span class="ml-2">${category}</span>
        </label>
    `).join('');
}

function populateBrandFilter() {
    const brands = [...new Set(allProducts.map(p => p.brand))];
    const container = document.getElementById('brandFilter');
    
    container.innerHTML = brands.map(brand => `
        <label class="flex items-center">
            <input type="checkbox" class="form-checkbox text-orange-600 brand-filter" value="${brand}">
            <span class="ml-2">${brand}</span>
        </label>
    `).join('');
}

function populateConditionFilter() {
    const conditions = [...new Set(allProducts.map(p => p.condition))];
    const container = document.getElementById('conditionFilter');
    
    container.innerHTML = conditions.map(condition => `
        <label class="flex items-center">
            <input type="checkbox" class="form-checkbox text-orange-600 condition-filter" value="${condition}">
            <span class="ml-2">${condition}</span>
        </label>
    `).join('');
}

function populateRamFilter() {
    const ramOptions = [...new Set(allProducts.filter(p => p.ram).map(p => p.ram))];
    const container = document.getElementById('ramFilter');
    
    container.innerHTML = ramOptions.map(ram => `
        <label class="flex items-center">
            <input type="checkbox" class="form-checkbox text-orange-600 ram-filter" value="${ram}">
            <span class="ml-2">${ram}</span>
        </label>
    `).join('');
}

function populateCpuFilter() {
    const cpuOptions = [...new Set(allProducts.filter(p => p.cpu).map(p => p.cpu))];
    const container = document.getElementById('cpuFilter');
    
    container.innerHTML = cpuOptions.map(cpu => `
        <label class="flex items-center">
            <input type="checkbox" class="form-checkbox text-orange-600 cpu-filter" value="${cpu}">
            <span class="ml-2">${cpu}</span>
        </label>
    `).join('');
}

function populateAccessoriesFilter() {
    const allAccessories = allProducts.flatMap(p => p.accessories);
    const uniqueAccessories = [...new Set(allAccessories)];
    const container = document.getElementById('accessoriesFilter');
    
    container.innerHTML = uniqueAccessories.map(accessory => `
        <label class="flex items-center">
            <input type="checkbox" class="form-checkbox text-orange-600 accessory-filter" value="${accessory}">
            <span class="ml-2">${accessory.charAt(0).toUpperCase() + accessory.slice(1)}</span>
        </label>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Filter application
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', function() {
        sortProducts(this.value);
        displayProducts();
    });
    
    // Price range update
    document.getElementById('priceRange').addEventListener('input', function() {
        document.getElementById('maxPriceLabel').textContent = '₹' + this.value;
    });
}

// Apply filters
function applyFilters() {
    // Get current filter values
    currentFilters.categories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(cb => cb.value);
    
    currentFilters.brands = Array.from(document.querySelectorAll('.brand-filter:checked'))
        .map(cb => cb.value);
    
    currentFilters.conditions = Array.from(document.querySelectorAll('.condition-filter:checked'))
        .map(cb => cb.value);
    
    currentFilters.ram = Array.from(document.querySelectorAll('.ram-filter:checked'))
        .map(cb => cb.value);
    
    currentFilters.cpu = Array.from(document.querySelectorAll('.cpu-filter:checked'))
        .map(cb => cb.value);
    
    currentFilters.accessories = Array.from(document.querySelectorAll('.accessory-filter:checked'))
        .map(cb => cb.value);
    
    currentFilters.maxPrice = parseInt(document.getElementById('priceRange').value);
    
    // Filter products
    filterProducts();
    
    // Reset to first page
    currentPage = 1;
    
    // Display filtered products
    displayProducts();
    
    // Update product count
    updateProductCount();
}

// Reset filters
function resetFilters() {
    // Uncheck all filter checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset price range
    document.getElementById('priceRange').value = 100000;
    document.getElementById('maxPriceLabel').textContent = '₹100000';
    
    // Reset sort
    document.getElementById('sortBy').value = 'price-asc';
    
    // Reset filters object
    currentFilters = {
        categories: [],
        brands: [],
        conditions: [],
        ram: [],
        cpu: [],
        accessories: [],
        maxPrice: 100000
    };
    
    // Reset products
    filteredProducts = [...allProducts];
    currentPage = 1;
    
    // Display all products
    displayProducts();
    
    // Update product count
    updateProductCount();
}

// Filter products based on current filters
function filterProducts() {
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (currentFilters.categories.length > 0 && 
            !currentFilters.categories.includes(product.category)) {
            return false;
        }
        
        // Brand filter
        if (currentFilters.brands.length > 0 && 
            !currentFilters.brands.includes(product.brand)) {
            return false;
        }
        
        // Condition filter
        if (currentFilters.conditions.length > 0 && 
            !currentFilters.conditions.includes(product.condition)) {
            return false;
        }
        
        // RAM filter
        if (currentFilters.ram.length > 0 && product.ram && 
            !currentFilters.ram.includes(product.ram)) {
            return false;
        }
        
        // CPU filter
        if (currentFilters.cpu.length > 0 && product.cpu && 
            !currentFilters.cpu.includes(product.cpu)) {
            return false;
        }
        
        // Accessories filter
        if (currentFilters.accessories.length > 0 && 
            !currentFilters.accessories.some(acc => product.accessories.includes(acc))) {
            return false;
        }
        
        // Price filter
        if (product.price > currentFilters.maxPrice) {
            return false;
        }
        
        return true;
    });
    
    // Apply current sort
    sortProducts(document.getElementById('sortBy').value);
}

// Sort products
function sortProducts(sortBy) {
    switch(sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(b.name));
            break;
        case 'newest':
            // Assuming products have a dateAdded property
            // For now, sort by ID (higher ID = newer)
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'popularity':
            // Assuming products have a popularity property
            // For now, sort by ID (arbitrary)
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            filteredProducts.sort((a, b) => a.price - b.price);
    }
}

// Display products in grid
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="col-span-3 text-center py-10">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">No products found matching your filters.</p>
                <button id="resetFiltersBtn" class="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                    Reset Filters
                </button>
            </div>
        `;
        
        document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Generate product cards with consistent height
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300 flex flex-col h-full relative" 
             data-category="${product.category}" 
             data-brand="${product.brand}" 
             data-min-price="${product.minPrice || product.price}" 
             data-max-price="${product.maxPrice || product.price}">
            
            <div class="relative overflow-hidden flex-shrink-0">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover transition duration-500 hover:scale-105">
                ${getProductBadges(product)}
            </div>
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4 flex-grow">${product.description}</p>
                <div class="mt-auto">
                    <div class="flex justify-between items-center mb-3">
                        <div>
                            ${getPriceRangeDisplay(product)}
                        </div>
                    </div>
                    <div class="flex gap-2">
                       
                        <button class="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition text-center font-semibold whatsapp-order-btn"
                                data-product='${JSON.stringify({
                                    id: product.id,
                                    name: product.name,
                                    minPrice: product.minPrice || product.price,
                                    maxPrice: product.maxPrice || product.price,
                                    category: product.category,
                                    brand: product.brand
                                }).replace(/'/g, "\\'")}'>
                            <i class="fab fa-whatsapp mr-2"></i>Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to wishlist buttons
    setupWishlistEventListeners();
    
    // Add event listeners to WhatsApp buttons
    setupWhatsAppOrderButtons();
    
    // Generate pagination
    // generatePagination(totalPages);
}

// Helper function to display price range
function getPriceRangeDisplay(product) {
    const minPrice = product.minPrice || product.price;
    const maxPrice = product.maxPrice || product.price;
    
    // Format numbers with commas for Indian numbering
    const formatPrice = (price) => {
        return price.toLocaleString('en-IN');
    };
    
    if (minPrice === maxPrice) {
        // Single price
        return `
            <span class="text-2xl font-bold text-orange-600">₹${formatPrice(minPrice)}</span>
            ${product.originalPrice ? `<span class="text-sm text-gray-500 line-through ml-2">₹${formatPrice(product.originalPrice)}</span>` : ''}
        `;
    } else {
        // Price range
        return `
            <div class="price-range">
                <div class="text-lg font-bold text-orange-600">
                    ₹${formatPrice(minPrice)} - ₹${formatPrice(maxPrice)}
                </div>
                ${product.originalPrice ? `
                    <div class="text-sm text-gray-500 line-through">
                        Original: ₹${formatPrice(product.originalPrice)}
                    </div>
                ` : ''}
                ${product.priceRangeNote ? `
                    <div class="text-xs text-gray-600 mt-1">
                        ${product.priceRangeNote}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Setup WhatsApp order buttons
function setupWhatsAppOrderButtons() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-order-btn');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            try {
                const productData = JSON.parse(this.getAttribute('data-product'));
                sendWhatsAppOrder(productData);
            } catch (error) {
                console.error('Error parsing product data:', error);
                // Fallback
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const priceRange = productCard.querySelector('.price-range .text-orange-600').textContent;
                sendSimpleWhatsAppMessage(productName, priceRange);
            }
        });
    });
}

// Send WhatsApp order message with price range
function sendWhatsAppOrder(product) {
    const phoneNumber = '9370812640';
    
    // Format price for display
    const formatPrice = (price) => {
        return price.toLocaleString('en-IN');
    };
    
    // Simple, clean message format
    let message = `Hello! I would like to inquire about:\n\n`;
    message += `Product: ${product.name}\n`;
    
    if (product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice) {
        message += `Price Range: ₹${formatPrice(product.minPrice)} - ₹${formatPrice(product.maxPrice)}\n`;
    } else {
        message += `Price: ₹${formatPrice(product.minPrice)}\n`;
    }
    
    message += `Category: ${product.category}\n`;
    message += `Brand: ${product.brand}\n\n`;
    message += `Please let me know the exact price and availability.\n\n`;
    // message += `My details:\n`;
    // message += `Name: ________\n`;
    // message += `Phone: ________\n`;
    // message += `Address: ________\n`;
    // message += `Preferred delivery time: ________`;
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
}

// Alternative simple function
function sendSimpleWhatsAppMessage(productName, priceRange) {
    const phoneNumber = '9370812640';
    const message = `I want to inquire about: ${productName}\nPrice: ${priceRange}\n\nPlease contact me with exact price.\n\nName: __\nPhone: __\nAddress: __`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Setup wishlist event listeners
function setupWishlistEventListeners() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToWishlist(productId);
            
            // Visual feedback
            const icon = this.querySelector('i');
            icon.classList.remove('text-gray-400', 'hover:text-red-500');
            icon.classList.add('text-red-500');
            this.classList.add('bg-red-50');
            
            // Reset animation after 1 second
            setTimeout(() => {
                icon.classList.remove('text-red-500');
                icon.classList.add('text-gray-400', 'hover:text-red-500');
                this.classList.remove('bg-red-50');
            }, 1000);
        });
    });
}

// Get product badges based on product properties
function getProductBadges(product) {
    let badges = '';
    
    if (product.condition === 'Best Seller' && product.isFeatured) {
        badges += '<span class="product-badge badge-new">Best Sellers</span>';
    } else if (product.condition === 'New') {
        badges += '<span class="product-badge badge-refurbished">New</span>';
    }
    
    if (product.originalPrice && product.price < product.originalPrice) {
        const discount = Math.round((1 - product.price / product.originalPrice) * 100);
        badges += `<span class="product-badge badge-sale">Sale ${discount}%</span>`;
    }
    
    return badges;
}

// Generate pagination controls
function generatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<a href="#" class="page-link" data-page="${currentPage - 1}">&laquo; Previous</a>`;
    } else {
        paginationHTML += `<span class="page-link disabled">&laquo; Previous</span>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<span class="page-link active">${i}</span>`;
        } else {
            paginationHTML += `<a href="#" class="page-link" data-page="${i}">${i}</a>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<a href="#" class="page-link" data-page="${currentPage + 1}">Next &raquo;</a>`;
    } else {
        paginationHTML += `<span class="page-link disabled">Next &raquo;</span>`;
    }
    
    pagination.innerHTML = paginationHTML;
    
    // Add event listeners to pagination links
    pagination.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = parseInt(this.getAttribute('data-page'));
            displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Update product count display
function updateProductCount() {
    const countElement = document.getElementById('productCount');
    const startIndex = (currentPage - 1) * productsPerPage + 1;
    const endIndex = Math.min(startIndex + productsPerPage - 1, filteredProducts.length);
    
    if (filteredProducts.length === 0) {
        countElement.textContent = 'No products found';
    } else {
        countElement.textContent = `Showing ${startIndex}-${endIndex} of ${filteredProducts.length} products`;
    }
}

// Add to cart function
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Get existing cart from localStorage or create empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message
    showNotification(`${product.name} added to cart!`, 'success');
}

// Add to wishlist function
function addToWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Get existing wishlist from localStorage or create empty array
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product already in wishlist
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (!existingItem) {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            category: product.category,
            brand: product.brand
        });
        
        // Save back to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Show success message
        showNotification(`${product.name} added to wishlist successfully!`, 'success');
    } else {
        showNotification(`${product.name} is already in your wishlist!`, 'info');
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-transform transform translate-x-full ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'} text-white`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('translate-x-0');
        notification.classList.add('translate-x-full');
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}