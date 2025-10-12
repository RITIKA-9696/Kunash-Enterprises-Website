document.addEventListener('DOMContentLoaded', function() {
    // Initialize product details page
    initProductDetailPage();
});

// Global variables
let currentProduct = null;
let relatedProducts = [];
let currentImageIndex = 0;
let productImages = [];

// Initialize product details page
function initProductDetailPage() {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showError('Product not found');
        return;
    }
    
    loadProductDetails(productId);
    setupEventListeners();
}

// Load product details
async function loadProductDetails(productId) {
    try {
        // Show loading state
        document.getElementById('productDetails').innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center py-10">
                    <i class="fas fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
                    <p class="text-gray-600">Loading product details...</p>
                </div>
            </div>
        `;

        // Fetch product details
        const product = await fetchProductById(productId);
        
        if (!product) {
            showError('Product not found');
            return;
        }
        
        currentProduct = product;
        
        // Update breadcrumb
        document.getElementById('breadcrumbProductName').textContent = product.name;
        
        // Display product details
        displayProductDetails();
        
        // Load related products
        loadRelatedProducts(product);
        
        // Show other sections
        document.getElementById('productSpecifications').classList.remove('hidden');
        document.getElementById('faqSection').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading product details:', error);
        showError('Error loading product details. Please try again later.');
    }
}

// Fetch product by ID (simulate API call)
async function fetchProductById(productId) {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Gaming Laptop Pro",
            description: "High performance gaming laptop with RTX graphics, perfect for gamers and content creators.",
            fullDescription: "The Gaming Laptop Pro is designed for ultimate performance. Featuring the latest RTX graphics card, high-refresh-rate display, and advanced cooling system, this laptop delivers exceptional gaming and creative experiences.",
            price: 80000,
            originalPrice: 90000,
            images: [
                "./images/P1.png",
                "images/p11.png",
                "images/p12.png",
                "images/p13.png"
            ],
            category: "New Laptops",
            brand: "Dell",
            condition: "New",
            ram: "16GB DDR4",
            cpu: "Intel Core i7-11800H",
            storage: "1TB NVMe SSD",
            graphics: "NVIDIA RTX 3060 6GB",
            display: "15.6\" FHD 144Hz",
            os: "Windows 11 Home",
            weight: "2.3 kg",
            warranty: "2 years",
            accessories: [],
            inStock: true,
            stockQuantity: 15,
            isFeatured: true,
            tags: ["gaming", "high-performance", "rtx"],
            specifications: {
                "Processor": "Intel Core i7-11800H (8 cores, 16 threads)",
                "Memory": "16GB DDR4 3200MHz",
                "Storage": "1TB NVMe PCIe SSD",
                "Graphics": "NVIDIA GeForce RTX 3060 6GB GDDR6",
                "Display": "15.6\" FHD (1920x1080) 144Hz IPS",
                "Operating System": "Windows 11 Home",
                "Battery": "4-cell 86Whr",
                "Weight": "2.3 kg",
                "Ports": "USB 3.2, HDMI, Thunderbolt 4, Ethernet",
                "Wireless": "Wi-Fi 6, Bluetooth 5.2"
            },
            features: [
                "RGB Backlit Keyboard",
                "Advanced Cooling System",
                "High Refresh Rate Display",
                "Thunderbolt 4 Support",
                "Premium Build Quality"
            ],
            reviews: [
                {
                    user: "Rahul Sharma",
                    rating: 5,
                    date: "2024-01-15",
                    comment: "Excellent gaming performance! The RTX 3060 handles all my games smoothly."
                },
                {
                    user: "Priya Patel",
                    rating: 4,
                    date: "2024-01-10",
                    comment: "Great laptop for both work and gaming. Battery life could be better though."
                }
            ],
            averageRating: 4.5,
            reviewCount: 47
        },
        {
            id: 2,
            name: "Business Ultrabook",
            description: "Sleek and powerful for professionals",
            fullDescription: "The Business Ultrabook combines premium design with powerful performance for today's professionals. With its lightweight design and long battery life, you can work efficiently anywhere.",
            price: 96000,
            originalPrice: 110000,
            images: [
                "images/p2.png",
                "images/p21.png"
            ],
            category: "New Laptops",
            brand: "HP",
            condition: "New",
            ram: "8GB LPDDR4",
            cpu: "Intel Core i5-1135G7",
            storage: "512GB SSD",
            graphics: "Intel Iris Xe",
            display: "14\" FHD IPS",
            os: "Windows 11 Pro",
            weight: "1.4 kg",
            warranty: "3 years",
            inStock: true,
            stockQuantity: 8,
            isFeatured: false,
            tags: ["business", "ultrabook", "lightweight"]
        }
    ];
    
    return products.find(p => p.id === parseInt(productId));
}

// Display product details
function displayProductDetails() {
    const container = document.getElementById('productDetails');
    
    // Set product images
    productImages = currentProduct.images || [currentProduct.image];
    
    container.innerHTML = `
        <div class="container mx-auto px-4">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    <!-- Product Images -->
                    <div class="product-gallery">
                        <div class="image-zoom bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                            <img src="${productImages[0]}" alt="${currentProduct.name}" class="main-image" id="mainImage">
                        </div>
                        <div class="thumbnail-container">
                            ${productImages.map((image, index) => `
                                <img src="${image}" alt="${currentProduct.name} - View ${index + 1}" 
                                     class="thumbnail ${index === 0 ? 'active' : ''}" 
                                     data-index="${index}"
                                     onerror="this.src='images/products/placeholder.jpg'">
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Product Info -->
                    <div class="product-info">
                        ${getProductBadges()}
                        <h1 class="text-3xl font-bold mb-4">${currentProduct.name}</h1>
                        <div class="flex items-center mb-4">
                            <div class="star-rating mr-2">
                                ${generateStarRating(currentProduct.averageRating || 4)}
                            </div>
                            <span class="text-gray-600">(${currentProduct.reviewCount || 12} reviews)</span>
                        </div>
                        
                        <p class="text-gray-700 mb-6">${currentProduct.fullDescription || currentProduct.description}</p>
                        
                        <div class="price-section mb-6">
                            <div class="flex items-center">
                                <span class="text-3xl font-bold text-orange-600">₹${currentProduct.price.toLocaleString()}</span>
                                ${currentProduct.originalPrice ? `
                                    <span class="text-xl text-gray-500 line-through ml-3">₹${currentProduct.originalPrice.toLocaleString()}</span>
                                    <span class="bg-red-100 text-red-800 text-sm font-medium ml-3 px-2 py-1 rounded">
                                        ${Math.round((1 - currentProduct.price / currentProduct.originalPrice) * 100)}% OFF
                                    </span>
                                ` : ''}
                            </div>
                            <p class="text-green-600 mt-2">
                                <i class="fas fa-check-circle mr-1"></i>
                                ${currentProduct.inStock ? `In Stock (${currentProduct.stockQuantity} available)` : 'Out of Stock'}
                            </p>
                        </div>
                        
                        ${currentProduct.features ? `
                            <div class="features mb-6">
                                <h3 class="font-semibold mb-2">Key Features:</h3>
                                <ul class="list-disc list-inside space-y-1">
                                    ${currentProduct.features.map(feature => `<li class="text-gray-600">${feature}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        <div class="action-buttons mb-6">
                            <div class="flex flex-col gap-4">
                                <div class="quantity-selector mb-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
                                    <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                        <button class="quantity-btn bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 transition-colors duration-200" id="decreaseQty">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="number" id="quantity" class="quantity-input w-20 text-center border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" value="1" min="1" max="${currentProduct.stockQuantity || 10}">
                                        <button class="quantity-btn bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 transition-colors duration-200" id="increaseQty">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="flex flex-col sm:flex-row gap-3">
                                    <button class="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition flex items-center justify-center font-semibold" id="buyNowBtn">
                                        <i class="fas fa-bolt mr-2"></i>
                                        Buy Now
                                    </button>
                                    <button class="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition flex items-center justify-center" id="addToCartBtn">
                                        <i class="fas fa-shopping-cart mr-2"></i>
                                        Add to Cart
                                    </button>
                                </div>
                                
                                <button class="w-full border border-orange-500 text-orange-500 py-3 px-6 rounded-lg hover:bg-orange-50 transition flex items-center justify-center" id="addToWishlistBtn">
                                    <i class="fas fa-heart mr-2"></i>
                                    Add to Wishlist
                                </button>
                            </div>
                        </div>
                        
                        <div class="additional-actions flex flex-wrap gap-4">
                            <div class="social-share">
                                <span class="text-gray-600 mr-2">Share:</span>
                                <a href="#" class="social-btn facebook" title="Share on Facebook">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" class="social-btn twitter" title="Share on Twitter">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" class="social-btn linkedin" title="Share on LinkedIn">
                                    <i class="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" class="social-btn whatsapp" title="Share on WhatsApp">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Product Tabs -->
                <div class="border-t">
                    <div class="tabs">
                        <button class="tab active" data-tab="specifications">Specifications</button>
                        <button class="tab" data-tab="description">Description</button>
                        <button class="tab" data-tab="reviews">Reviews (${currentProduct.reviewCount || 12})</button>
                        <button class="tab" data-tab="shipping">Shipping & Returns</button>
                    </div>
                    
                    <div class="tab-content active p-6" id="specificationsTab">
                        <h3 class="text-xl font-semibold mb-4">Technical Specifications</h3>
                        <div class="overflow-x-auto">
                            <table class="specs-table">
                                <tbody>
                                    ${currentProduct.specifications ? 
                                        Object.entries(currentProduct.specifications).map(([key, value]) => `
                                            <tr>
                                                <td>${key}</td>
                                                <td>${value}</td>
                                            </tr>
                                        `).join('') : `
                                        <tr>
                                            <td>Category</td>
                                            <td>${currentProduct.category}</td>
                                        </tr>
                                        <tr>
                                            <td>Brand</td>
                                            <td>${currentProduct.brand}</td>
                                        </tr>
                                        <tr>
                                            <td>Condition</td>
                                            <td>${currentProduct.condition}</td>
                                        </tr>
                                        ${currentProduct.ram ? `<tr><td>RAM</td><td>${currentProduct.ram}</td></tr>` : ''}
                                        ${currentProduct.cpu ? `<tr><td>Processor</td><td>${currentProduct.cpu}</td></tr>` : ''}
                                        ${currentProduct.storage ? `<tr><td>Storage</td><td>${currentProduct.storage}</td></tr>` : ''}
                                        ${currentProduct.display ? `<tr><td>Display</td><td>${currentProduct.display}</td></tr>` : ''}
                                        ${currentProduct.os ? `<tr><td>Operating System</td><td>${currentProduct.os}</td></tr>` : ''}
                                        ${currentProduct.warranty ? `<tr><td>Warranty</td><td>${currentProduct.warranty}</td></tr>` : ''}
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="tab-content p-6" id="descriptionTab">
                        <h3 class="text-xl font-semibold mb-4">Product Description</h3>
                        <p class="text-gray-700 leading-relaxed">${currentProduct.fullDescription || currentProduct.description}</p>
                        
                        ${currentProduct.features ? `
                            <div class="mt-6">
                                <h4 class="font-semibold mb-3">Key Features:</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    ${currentProduct.features.map(feature => `
                                        <div class="flex items-center">
                                            <i class="fas fa-check text-green-500 mr-2"></i>
                                            <span>${feature}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="tab-content p-6" id="reviewsTab">
                        <h3 class="text-xl font-semibold mb-4">Customer Reviews</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div class="text-center">
                                <div class="text-5xl font-bold text-orange-600 mb-2">${currentProduct.averageRating || 4.5}</div>
                                <div class="star-rating justify-center mb-2">
                                    ${generateStarRating(currentProduct.averageRating || 4.5)}
                                </div>
                                <div class="text-gray-600">Based on ${currentProduct.reviewCount || 12} reviews</div>
                            </div>
                            
                            <div class="md:col-span-2">
                                <button class="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
                                    Write a Review
                                </button>
                            </div>
                        </div>
                        
                        <div class="space-y-6">
                            ${(currentProduct.reviews || []).map(review => `
                                <div class="border-b pb-6">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="font-semibold">${review.user}</span>
                                        <span class="text-gray-500 text-sm">${review.date}</span>
                                    </div>
                                    <div class="star-rating mb-3">
                                        ${generateStarRating(review.rating)}
                                    </div>
                                    <p class="text-gray-700">${review.comment}</p>
                                </div>
                            `).join('')}
                            
                            ${(!currentProduct.reviews || currentProduct.reviews.length === 0) ? `
                                <div class="text-center py-8">
                                    <i class="fas fa-comment-alt text-4xl text-gray-300 mb-4"></i>
                                    <p class="text-gray-600">No reviews yet. Be the first to review this product!</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="tab-content p-6" id="shippingTab">
                        <h3 class="text-xl font-semibold mb-4">Shipping & Returns</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 class="font-semibold mb-3">Shipping Information</h4>
                                <ul class="space-y-2 text-gray-700">
                                    <li><i class="fas fa-shipping-fast text-orange-500 mr-2"></i> Free shipping on orders over ₹10,000</li>
                                    <li><i class="fas fa-clock text-orange-500 mr-2"></i> Delivery within 3-5 business days</li>
                                    <li><i class="fas fa-box text-orange-500 mr-2"></i> Track your order online</li>
                                    <li><i class="fas fa-store text-orange-500 mr-2"></i> Available for in-store pickup</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 class="font-semibold mb-3">Return Policy</h4>
                                <ul class="space-y-2 text-gray-700">
                                    <li><i class="fas fa-undo text-orange-500 mr-2"></i> 30-day money-back guarantee</li>
                                    <li><i class="fas fa-tools text-orange-500 mr-2"></i> Free returns within 15 days</li>
                                    <li><i class="fas fa-shield-alt text-orange-500 mr-2"></i> 2-year warranty included</li>
                                    <li><i class="fas fa-headset text-orange-500 mr-2"></i> Dedicated customer support</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup tab functionality
    setupTabs();
    
    // Setup image gallery
    setupImageGallery();
    
    // Setup quantity selector
    setupQuantitySelector();
    
    // Setup action buttons
    setupActionButtons();
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star filled"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt filled"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Get product badges HTML
function getProductBadges() {
    let badges = '';
    
    if (currentProduct.condition === 'New' && currentProduct.isFeatured) {
        badges += '<span class="product-badge badge-new">New</span>';
    } else if (currentProduct.condition === 'Refurbished') {
        badges += '<span class="product-badge badge-refurbished">Refurbished</span>';
    }
    
    if (currentProduct.originalPrice && currentProduct.price < currentProduct.originalPrice) {
        badges += '<span class="product-badge badge-sale">Sale</span>';
    }
    
    if (currentProduct.isFeatured) {
        badges += '<span class="product-badge badge-featured">Featured</span>';
    }
    
    return badges ? `<div class="mb-4">${badges}</div>` : '';
}

// Setup tab functionality
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup image gallery
function setupImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            
            // Update main image
            const imageIndex = thumbnail.getAttribute('data-index');
            mainImage.src = productImages[imageIndex];
            currentImageIndex = parseInt(imageIndex);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
            currentImageIndex--;
            updateGalleryImage();
        } else if (e.key === 'ArrowRight' && currentImageIndex < productImages.length - 1) {
            currentImageIndex++;
            updateGalleryImage();
        }
    });
}

// Update gallery image
function updateGalleryImage() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    mainImage.src = productImages[currentImageIndex];
    
    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnails[currentImageIndex].classList.add('active');
}

// Setup quantity selector
function setupQuantitySelector() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    
    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        const max = parseInt(quantityInput.max);
        if (value < max) {
            quantityInput.value = value + 1;
        }
    });
    
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        const max = parseInt(quantityInput.max);
        const min = parseInt(quantityInput.min);
        
        if (isNaN(value) || value < min) {
            quantityInput.value = min;
        } else if (value > max) {
            quantityInput.value = max;
        }
    });
}

// Setup action buttons
function setupActionButtons() {
    // Buy Now button
    document.getElementById('buyNowBtn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        buyNow(currentProduct.id, quantity);
    });
    
    // Add to Cart button
    document.getElementById('addToCartBtn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart(currentProduct.id, quantity);
    });
    
    // Add to Wishlist button
    document.getElementById('addToWishlistBtn').addEventListener('click', () => {
        addToWishlist(currentProduct.id);
    });
}

// Buy Now function
function buyNow(productId, quantity = 1) {
    // Add product to cart first
    addToCart(productId, quantity);
    
    // Then redirect to checkout page
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
}

// Add to cart function
function addToCart(productId, quantity = 1) {
    // In a real implementation, this would use cartAPI
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images ? currentProduct.images[0] : currentProduct.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${currentProduct.name} added to cart!`, 'success');
}

// Add to wishlist function
function addToWishlist(productId) {
    // In a real implementation, this would use wishlistAPI
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (!existingItem) {
        wishlist.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images ? currentProduct.images[0] : currentProduct.image
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification(`${currentProduct.name} added to wishlist!`, 'success');
    } else {
        showNotification(`${currentProduct.name} is already in your wishlist!`, 'info');
    }
}

// Load related products
async function loadRelatedProducts(currentProduct) {
    try {
        // In a real implementation, this would be an API call
        const related = await fetchRelatedProducts(currentProduct);
        relatedProducts = related;
        
        displayRelatedProducts();
        document.getElementById('relatedProducts').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading related products:', error);
        // Hide related products section if there's an error
        document.getElementById('relatedProducts').classList.add('hidden');
    }
}

// Fetch related products (simulate API call)
async function fetchRelatedProducts(currentProduct) {
    // Sample related products data
    const allProducts = [
        {
            id: 7,
            name: "Refurbished Laptop Elite",
            price: 35000,
            originalPrice: 60000,
            image: "images/products/laptop3.jpg",
            category: "Old Laptops"
        },
        {
            id: 8,
            name: "Gaming Mouse",
            price: 2500,
            image: "images/p2.png",
            category: "Accessories"
        },
        {
            id: 9,
            name: "Professional Laptop",
            price: 75000,
            image: "images/p9.jpg",
            category: "New Laptops"
        },
        {
            id: 10,
            name: "Laptop Cooling Pad",
            price: 1500,
            image: "images/products/cooling-pad.jpg",
            category: "Accessories"
        }
    ];
    
    // Filter products that are related (same category or brand)
    return allProducts.filter(product => 
        product.id !== currentProduct.id && 
        (product.category === currentProduct.category || 
         product.brand === currentProduct.brand)
    ).slice(0, 4); // Return max 4 related products
}

// Display related products
function displayRelatedProducts() {
    const container = document.getElementById('relatedProductsGrid');
    
    if (relatedProducts.length === 0) {
        container.innerHTML = `
            <div class="col-span-4 text-center py-8">
                <p class="text-gray-600">No related products found.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = relatedProducts.map(product => `
        <div class="product-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300">
            <div class="relative overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover transition duration-500 hover:scale-105">
                ${product.originalPrice ? '<span class="absolute top-4 left-4 bg-orange-500 text-white text-sm px-2 py-1 rounded">Sale</span>' : ''}
            </div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xl font-bold text-orange-600">₹${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="text-sm text-gray-500 line-through">₹${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <a href="product-detail.html?id=${product.id}" class="block w-full bg-orange-600 text-white text-center py-2 rounded-lg hover:bg-orange-700 transition">
                    View Details
                </a>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // FAQ accordion
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('faq-question')) {
            const faqItem = e.target.closest('.faq-item');
            faqItem.classList.toggle('active');
        }
    });
    
    // Social share buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.social-btn')) {
            e.preventDefault();
            // In a real implementation, this would open share dialogs
            showNotification('Share functionality would open here', 'info');
        }
    });
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Show error message
function showError(message) {
    const container = document.getElementById('productDetails');
    container.innerHTML = `
        <div class="container mx-auto px-4">
            <div class="text-center py-10">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                <p class="text-gray-600 mb-6">${message}</p>
                <a href="products.html" class="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition">
                    Back to Products
                </a>
            </div>
        </div>
    `;
}

// Setup FAQ content
function setupFAQ() {
    const faqContent = document.getElementById('faqContent');
    
    const faqs = [
        {
            question: "What is the warranty period for this product?",
            answer: "This product comes with a standard 2-year manufacturer warranty. Additional extended warranty options are available for purchase."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we only ship within India. International shipping may be available for bulk orders - please contact our sales team for more information."
        },
        {
            question: "Can I return the product if I'm not satisfied?",
            answer: "Yes, we offer a 30-day return policy for all products in original condition with all accessories and packaging."
        },
        {
            question: "Do I provide installation support?",
            answer: "For most products, basic setup guidance is provided. For complex installations, we offer professional installation services at an additional cost."
        }
    ];
    
    faqContent.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item ${index === 0 ? 'active' : ''}">
            <button class="faq-question">
                ${faq.question}
                <i class="fas fa-chevron-down faq-toggle"></i>
            </button>
            <div class="faq-answer">
                ${faq.answer}
            </div>
        </div>
    `).join('');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupFAQ();
});