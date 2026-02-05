// Products Page Functionality
document.addEventListener('DOMContentLoaded', function () {
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
    // Using the image paths that exist in your project
    return [
        {
            id: 1,
            name: "Hp 840 G7",
            description: "High performance business laptop with latest processor",
            minPrice: 45000,
            maxPrice: 55000,
            image: "images/featured/hp3.jpeg",  // Using your existing image
            category: "Refurbished Laptops",
            brand: "HP",
            condition: "Best Seller",
            ram: "16GB DDR4",
            cpu: "i5 / i7th  processor 8th generation ",
            storage: "8/16 gb ram ddr4 ",
            display: "14'6 screen",
            graphics: "Intel UHD Graphics",
            accessories: ["Charger", "Laptop Bag"],
            inStock: true,
            isFeatured: true,
            tags: ["business", "elitebook", "lightweight"]
        },
        {
            id: 2,
            name: "Dell 5320",
            description: "Enterprise-grade laptop with military-grade durability",
            minPrice: 42000,
            maxPrice: 52000,
            image: "images/dell.jpeg",  // Using your existing image
            category: "Refurbished Laptops",
            brand: "Dell",
            condition: "Best Seller",
            ram: "32 gb ram ddr4 ",
            cpu: "i7 processor 11th gen",
            storage: "512 /1 TB SSD ",
            display: "14'6 screen ",
            graphics: "Intel Iris Xe",
            accessories: ["Charger"],
            inStock: true,
            isFeatured: true,
            tags: ["enterprise", "durable", "business"]
        },
        {
            id: 3,
            name: "Dell latitude 5420 ",
            description: "Another variant of the popular Dell Latitude",
            minPrice: 35000,
            maxPrice: 45000,
            image: "images/dell2.jpeg",  // Using your existing image
            category: "Refurbished Laptops",
            brand: "Dell",
            condition: "Excellent",
            ram: "8 / 16 gb ram ddr4",
            cpu: "i5 processor 10th Gen",
            storage: "256 / 512 gb SSD ",
            display: "14'6 screen",
            graphics: "Intel UHD 620",
            accessories: ["Charger"],
            inStock: true,
            isFeatured: false,
            tags: ["business", "laptop"]
        },
        {
            id: 4,
            name: "Wired/Wireless Keyboard & Mouse Combo",
            description: "Powerful keyboard and mouse combo for professionals and gamers",
            minPrice: 999,
            maxPrice: 1499,
            image: "images/keyboard.jpeg",  // Using your existing image
            category: "Desktops",
            brand: "Custom Built",
            condition: "Best Seller",
            Connectivity: "Bluetooth, Usb",
            Durability: "Long-Lasting 500 mAh Rechargeable Battery",
            Keyboard: "320 × 125 × 20 mm",
            Mouse: "110 × 60 × 40 mm",

            accessories: ["Keyboard", "Mouse"],
            inStock: true,
            isFeatured: true,
            tags: ["gaming", "desktop", "workstation"]
        },
        {
            id: 5,
            name: "Dell 5400",
            description: "Laptop suitable for all kinds of work and entertainment",
            minPrice: 25000,
            maxPrice: 35000,
            image: "images/dell.jpeg",  // Using your existing image
            category: "Accessories",
            brand: "ASUS",
            condition: "New",
            ram: "8/16 gb ram ddr4",
            cpu: "i5 / i7 8th generation ",
            storage: "256 / 512 gb SSD ",
            display: "14'6 screen",
            graphics: null,
            accessories: ["Monitor", "Stand", "Cables"],
            inStock: true,
            isFeatured: true,
            tags: ["monitor", "gaming", "144hz"]
        },
        {
            id: "6",
            name: "Wired/wireless Mouse",
            description: "Wireless ergonomic mouse with ultra-fast scrolling, 8K DPI sensor, and multi-device connectivity",
            minPrice: 999,
            maxPrice: 1499,
            image: "images/mouse.jpg",  // Using your existing image
            category: "Accessories",
            brand: "Logitech",
            condition: "New",
            ram: null,
            cpu: null,
            storage: null,
            display: null,
            graphics: null,
            accessories: ["USB Receiver", "USB-C Cable", "Documentation"],
            inStock: true,
            isFeatured: false,
            tags: ["mouse", "wireless", "ergonomic", "logitech", "accessory"]
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
        <label class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
            <input type="checkbox" class="form-checkbox text-orange-600 category-filter" value="${category}">
            <span class="ml-2 text-gray-700">${category}</span>
        </label>
    `).join('');
}

function populateBrandFilter() {
    const brands = [...new Set(allProducts.map(p => p.brand))];
    const container = document.getElementById('brandFilter');

    container.innerHTML = brands.map(brand => `
        <label class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
            <input type="checkbox" class="form-checkbox text-orange-600 brand-filter" value="${brand}">
            <span class="ml-2 text-gray-700">${brand}</span>
        </label>
    `).join('');
}

function populateConditionFilter() {
    const conditions = [...new Set(allProducts.map(p => p.condition))];
    const container = document.getElementById('conditionFilter');

    container.innerHTML = conditions.map(condition => `
        <label class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
            <input type="checkbox" class="form-checkbox text-orange-600 condition-filter" value="${condition}">
            <span class="ml-2 text-gray-700">${condition}</span>
        </label>
    `).join('');
}

function populateRamFilter() {
    const ramOptions = [...new Set(allProducts.filter(p => p.ram).map(p => p.ram))];
    const container = document.getElementById('ramFilter');

    container.innerHTML = ramOptions.map(ram => `
        <label class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
            <input type="checkbox" class="form-checkbox text-orange-600 ram-filter" value="${ram}">
            <span class="ml-2 text-gray-700">${ram}</span>
        </label>
    `).join('');
}

function populateCpuFilter() {
    const cpuOptions = [...new Set(allProducts.filter(p => p.cpu).map(p => p.cpu))];
    const container = document.getElementById('cpuFilter');

    container.innerHTML = cpuOptions.map(cpu => `
        <label class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
            <input type="checkbox" class="form-checkbox text-orange-600 cpu-filter" value="${cpu}">
            <span class="ml-2 text-gray-700">${cpu}</span>
        </label>
    `).join('');
}

function populateAccessoriesFilter() {
    const allAccessories = allProducts.flatMap(p => p.accessories);
    const uniqueAccessories = [...new Set(allAccessories)];
    const container = document.getElementById('accessoriesFilter');

    container.innerHTML = uniqueAccessories.map(accessory => `
        <label class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
            <input type="checkbox" class="form-checkbox text-orange-600 accessory-filter" value="${accessory}">
            <span class="ml-2 text-gray-700">${accessory.charAt(0).toUpperCase() + accessory.slice(1)}</span>
        </label>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Filter application
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);

    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', function () {
        sortProducts(this.value);
        displayProducts();
    });

    // Price range update
    document.getElementById('priceRange').addEventListener('input', function () {
        document.getElementById('maxPriceLabel').textContent = '₹' + parseInt(this.value).toLocaleString('en-IN');
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
    document.getElementById('maxPriceLabel').textContent = '₹100,000';

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
        const productPrice = product.maxPrice || product.minPrice || 0;
        if (productPrice > currentFilters.maxPrice) {
            return false;
        }

        return true;
    });

    // Apply current sort
    sortProducts(document.getElementById('sortBy').value);
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => (b.maxPrice || 0) - (a.maxPrice || 0));
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'popularity':
            filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
            break;
        default:
            filteredProducts.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    }
}

// Display products in grid
function displayProducts() {
    const grid = document.getElementById('productsGrid');

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="col-span-3 text-center py-10">
                <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 mb-4">No products found matching your filters.</p>
                <button id="resetFiltersBtn" class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
                    Reset Filters
                </button>
            </div>
        `;

        document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    // Generate product cards
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full relative border border-gray-100">
            
            <!-- Product Image with fallback -->
            <div class="relative overflow-hidden" style="height: 200px;">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/500x400/FFA500/ffffff?text=Product+Image'; this.classList.add('object-contain', 'p-4');">
                ${getProductBadges(product)}
            </div>
            
            <!-- Configuration Details -->
            <div class="px-4 pt-3 pb-2 bg-gray-50 border-t">
                <div class="grid grid-cols-2 gap-1 text-xs">
                    ${getConfigurationDisplay(product)}
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-lg font-bold mb-2 text-gray-800">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-4 flex-grow">${product.description}</p>
                
                <div class="mt-auto">
                    <!-- Price Range -->
                    <div class="mb-4">
                        ${getPriceRangeDisplay(product)}
                    </div>
                    
                    <!-- Button -->
                    <button class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 text-center font-semibold shadow-md hover:shadow-lg whatsapp-order-btn"
                            data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>
                        <i class="fab fa-whatsapp mr-2"></i>Order Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to WhatsApp buttons
    setupWhatsAppOrderButtons();

    // Generate pagination
    generatePagination(totalPages);
}

// Helper function to display configuration details
function getConfigurationDisplay(product) {
    let configHTML = '';

    if (product.ram) {
        configHTML += `
            <div class="flex items-center">
                <i class="fas fa-memory text-orange-500 mr-1 text-xs"></i>
                <span class="font-medium truncate">${product.ram}</span>
            </div>
        `;
    }

    if (product.cpu) {
        configHTML += `
            <div class="flex items-center">
                <i class="fas fa-microchip text-orange-500 mr-1 text-xs"></i>
                <span class="font-medium truncate">${product.cpu.split(' ').slice(0, 3).join(' ')}</span>
            </div>
        `;
    }

    if (product.storage) {
        configHTML += `
            <div class="flex items-center">
                <i class="fas fa-hdd text-orange-500 mr-1 text-xs"></i>
                <span class="font-medium truncate">${product.storage}</span>
            </div>
        `;
    }

    if (product.display && product.display !== 'Not Included') {
        configHTML += `
            <div class="flex items-center">
                <i class="fas fa-desktop text-orange-500 mr-1 text-xs"></i>
                <span class="font-medium truncate">${product.display}</span>
            </div>
        `;
    }

    return configHTML || `<div class="col-span-2 text-center text-gray-500 text-xs py-1">Specifications available</div>`;
}

// Helper function to display price range
function getPriceRangeDisplay(product) {
    const minPrice = product.minPrice || product.price || 0;
    const maxPrice = product.maxPrice || product.price || minPrice;

    // Format numbers with commas for Indian numbering
    const formatPrice = (price) => {
        return price.toLocaleString('en-IN');
    };

    if (minPrice === maxPrice) {
        // Single price
        return `
            <div class="flex flex-col">
                <span class="text-xl font-bold text-orange-600">₹${formatPrice(minPrice)}</span>
                <span class="text-xs text-gray-500">Inclusive of all taxes</span>
            </div>
        `;
    } else {
        // Price range
        return `
            <div class="price-range">
                <div class="text-lg font-bold text-orange-600">
                    ₹${formatPrice(minPrice)} - ₹${formatPrice(maxPrice)}
                </div>
                <div class="text-xs text-gray-600 mt-1">
                    Price varies based on configuration
                </div>
            </div>
        `;
    }
}

// Setup WhatsApp order buttons
function setupWhatsAppOrderButtons() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-order-btn');

    whatsappButtons.forEach(button => {
        button.addEventListener('click', function () {
            try {
                const productData = JSON.parse(this.getAttribute('data-product').replace(/&#39;/g, "'"));
                sendWhatsAppOrder(productData);
            } catch (error) {
                console.error('Error parsing product data:', error);
                // Fallback
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                sendSimpleWhatsAppMessage(productName);
            }
        });
    });
}

// Send WhatsApp order message with price range
function sendWhatsAppOrder(product) {
    const phoneNumber = '9370812640';

    // Format price for display
    const formatPrice = (price) => {
        return price ? price.toLocaleString('en-IN') : '0';
    };

    // Detailed message with specifications
    let message = `Hello! I would like to inquire about the following product:\n\n`;
    message += `*Product:* ${product.name}\n`;
    message += `*Brand:* ${product.brand}\n`;
    message += `*Category:* ${product.category}\n\n`;

    if (product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice) {
        message += `*Price Range:* ₹${formatPrice(product.minPrice)} - ₹${formatPrice(product.maxPrice)}\n`;
    } else if (product.minPrice) {
        message += `*Price:* ₹${formatPrice(product.minPrice)}\n`;
    }

    // Add specifications
    if (product.ram) message += `*RAM:* ${product.ram}\n`;
    if (product.cpu) message += `*Processor:* ${product.cpu}\n`;
    if (product.storage) message += `*Storage:* ${product.storage}\n`;
    if (product.display && product.display !== 'Not Included') message += `*Display:* ${product.display}\n`;

    message += `\nI would like to know:\n`;
    message += `1. Exact price for this configuration\n`;
    message += `2. Availability and stock status\n`;
    message += `3. Warranty details\n`;
    message += `4. Delivery timeline\n\n`;
    message += `Please share the best offer.\n\n`;
    message += `Thank you!`;

    // Encode for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
}

// Alternative simple function
function sendSimpleWhatsAppMessage(productName) {
    const phoneNumber = '9370812640';
    const message = `Hello! I'm interested in ${productName}. Please provide details about price, availability, and delivery.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Get product badges based on product properties
function getProductBadges(product) {
    let badges = '';

    if (product.condition === 'Best Seller') {
        badges += '<span class="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">BEST SELLER</span>';
    } else if (product.condition === 'New') {
        badges += '<span class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">NEW</span>';
    } else if (product.condition === 'Refurbished') {
        badges += '<span class="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded font-bold">REFURBISHED</span>';
    }

    if (product.isFeatured) {
        badges += '<span class="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded font-bold">FEATURED</span>';
    }

    // Stock status badge
    if (!product.inStock) {
        badges += '<span class="absolute top-10 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">OUT OF STOCK</span>';
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
        paginationHTML += `
            <button class="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition pagination-btn" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left mr-1"></i> Prev
            </button>
        `;
    } else {
        paginationHTML += `<span class="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg">Prev</span>`;
    }

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `<span class="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold">${i}</span>`;
        } else {
            paginationHTML += `
                <button class="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-orange-50 transition pagination-btn" data-page="${i}">
                    ${i}
                </button>
            `;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition pagination-btn" data-page="${currentPage + 1}">
                Next <i class="fas fa-chevron-right ml-1"></i>
            </button>
        `;
    } else {
        paginationHTML += `<span class="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg">Next</span>`;
    }

    pagination.innerHTML = paginationHTML;

    // Add event listeners to pagination buttons
    pagination.querySelectorAll('.pagination-btn').forEach(button => {
        button.addEventListener('click', function (e) {
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
    } else if (filteredProducts.length === allProducts.length) {
        countElement.textContent = `Showing ${filteredProducts.length} products`;
    } else {
        countElement.textContent = `Showing ${startIndex}-${endIndex} of ${filteredProducts.length} products`;
    }
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
            price: product.minPrice || product.price,
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

// Global image error handler
window.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('error', function (e) {
        if (e.target.tagName.toLowerCase() === 'img') {
            console.log('Image failed to load:', e.target.src);
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = 'https://via.placeholder.com/500x400/FFA500/ffffff?text=Product+Image';
            e.target.classList.add('object-contain', 'p-4');
            e.target.classList.remove('object-cover');
        }
    }, true);
});