// API integration for backend connectivity
const API_BASE_URL = 'https://your-api-domain.com/api'; // Replace with your API URL

// Product API functions
const productAPI = {
    // Get all products
    async getProducts(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    
    // Get product by ID
    async getProductById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },
    
    // Get filter options
    async getFilterOptions() {
        try {
            const response = await fetch(`${API_BASE_URL}/filters`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching filter options:', error);
            throw error;
        }
    },
    
    // Search products
    async searchProducts(query, filters = {}) {
        try {
            const searchParams = new URLSearchParams({
                q: query,
                ...filters
            }).toString();
            
            const response = await fetch(`${API_BASE_URL}/products/search?${searchParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }
};

// Cart API functions
const cartAPI = {
    // Add item to cart
    async addToCart(productId, quantity = 1) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    quantity
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },
    
    // Get cart items
    async getCart() {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    },
    
    // Update cart item quantity
    async updateCartItem(productId, quantity) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    },
    
    // Remove item from cart
    async removeFromCart(productId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }
};

// Wishlist API functions
const wishlistAPI = {
    // Add item to wishlist
    async addToWishlist(productId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },
    
    // Get wishlist items
    async getWishlist() {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;
        }
    },
    
    // Remove item from wishlist
    async removeFromWishlist(productId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    }
};

// Export API functions
window.productAPI = productAPI;
window.cartAPI = cartAPI;
window.wishlistAPI = wishlistAPI;