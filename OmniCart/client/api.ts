// API configuration and utility functions
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD
    ? 'https://omnicart-backend.onrender.com/api'
    : 'http://localhost:5000/api');

interface RequestOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { token, ...fetchOptions } = options;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...fetchOptions,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.dispatchEvent(new Event('unauthorized'));
            }
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Product APIs
    async getProducts(params?: {
        category?: string;
        subCategory?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: string;
    }) {
        const queryString = params
            ? '?' + new URLSearchParams(params as any).toString()
            : '';
        return this.request(`/products${queryString}`);
    }

    async getProduct(id: string) {
        return this.request(`/products/${id}`);
    }

    async createProduct(data: any, token: string) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        });
    }

    async updateProduct(id: string, data: any, token: string) {
        return this.request(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
        });
    }

    async deleteProduct(id: string, token: string) {
        return this.request(`/products/${id}`, {
            method: 'DELETE',
            token,
        });
    }

    async getCategories() {
        return this.request('/products/meta/categories');
    }

    // User APIs
    async register(data: { name: string; email: string; password: string }) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async login(data: { email: string; password: string }) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async forgotPassword(data: { email: string }) {
        return this.request('/users/forgot-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async resetPassword(token: string, data: { password: string }) {
        return this.request(`/users/reset-password/${token}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUser(id: string, token: string) {
        return this.request(`/users/${id}`, { token });
    }

    async updateUser(id: string, data: any, token: string) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
        });
    }

    async getProfile(token: string) {
        return this.request('/users/profile', { token });
    }

    async updateProfilePic(formData: FormData, token: string) {
        const response = await fetch(`${this.baseUrl}/users/update-profile-pic`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                window.dispatchEvent(new Event('unauthorized'));
            }
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async addAddress(address: any, token: string) {
        return this.request('/users/address', {
            method: 'POST',
            body: JSON.stringify(address),
            token
        });
    }

    async updateAddress(id: string, address: any, token: string) {
        return this.request(`/users/address/${id}`, {
            method: 'PUT',
            body: JSON.stringify(address),
            token
        });
    }

    async deleteAddress(id: string, token: string) {
        return this.request(`/users/address/${id}`, {
            method: 'DELETE',
            token
        });
    }

    async addCard(card: any, token: string) {
        return this.request('/users/card', {
            method: 'POST',
            body: JSON.stringify(card),
            token
        });
    }

    async deleteCard(id: string, token: string) {
        return this.request(`/users/card/${id}`, {
            method: 'DELETE',
            token
        });
    }

    async addToWishlist(userId: string, productId: string, token: string) {
        return this.request(`/users/${userId}/wishlist/${productId}`, {
            method: 'POST',
            token,
        });
    }

    async removeFromWishlist(userId: string, productId: string, token: string) {
        return this.request(`/users/${userId}/wishlist/${productId}`, {
            method: 'DELETE',
            token,
        });
    }

    // Order APIs
    async createOrder(data: any, token: string) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        });
    }

    async getUserOrders(userId: string, token: string) {
        return this.request(`/orders/user/${userId}`, { token });
    }

    async getOrder(id: string, token: string) {
        return this.request(`/orders/${id}`, { token });
    }

    async updateOrderStatus(
        id: string,
        data: { orderStatus?: string; paymentStatus?: string },
        token: string
    ) {
        return this.request(`/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            token,
        });
    }

    async cancelOrder(id: string, token: string) {
        return this.request(`/orders/${id}`, {
            method: 'DELETE',
            token,
        });
    }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
