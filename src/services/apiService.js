import StorageService from './storageService';

// ============================================
// PERSISTENCIA REMOTA - API REST
// Conexión con backend Express/Node.js
// Usa fetch con async/await (asincronía)
// ============================================

const BASE_URL = 'http://10.0.2.2:9090/api';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Miel de Abeja Orgánica',
    description: 'Miel 100% pura extraída artesanalmente de los valles andinos.',
    price: 35.00,
    image: 'https://cdn-icons-png.flaticon.com/512/3014/3014464.png',
    category: 'miel',
    stock: 20,
    rating: 4.8,
    benefits: ['Endulzante natural', 'Propiedades antisépticas']
  },
  {
    id: '2',
    name: 'Aceite de Coco Extra Virgen',
    description: 'Aceite prensado en frío ideal para cocina saludable y cuidado personal.',
    price: 45.00,
    image: 'https://cdn-icons-png.flaticon.com/512/3554/3554625.png',
    category: 'aceites',
    stock: 15,
    rating: 4.9,
    benefits: ['Grasas saludables', 'Hidratante natural']
  },
  {
    id: '3',
    name: 'Harina de Maca Negra',
    description: 'Superalimento energizante natural de los Andes peruanos.',
    price: 28.50,
    image: 'https://cdn-icons-png.flaticon.com/512/5431/5431102.png',
    category: 'superfoods',
    stock: 30,
    rating: 4.7,
    benefits: ['Aumenta energía', 'Mejora concentración']
  },
  {
    id: '4',
    name: 'Cápsulas de Moringa',
    description: 'Suplemento rico en vitaminas y antioxidantes.',
    price: 52.00,
    image: 'https://cdn-icons-png.flaticon.com/512/5431/5431102.png',
    category: 'capsulas',
    stock: 10,
    rating: 4.6,
    benefits: ['Refuerza defensas', 'Desinflamante']
  }
];

// Helper para peticiones HTTP con manejo de errores
async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 segundos de timeout

  try {
    const token = await StorageService.getToken();
    const response = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token && {
            Authorization: `Bearer ${token}`
          }),
          ...options.headers,
        },
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`API [${endpoint}] falló: ${error.message}. Usando MOCKS.`);

    if (endpoint.startsWith('/products')) {
      if (endpoint.includes('category=')) {
        const cat = endpoint.split('category=')[1];
        return MOCK_PRODUCTS.filter(p => p.category === cat);
      }
      return MOCK_PRODUCTS;
    }
    return [];
  }
}

const ApiService = {
  async getProducts(category = null) {
    const query = category ? `?category=${category}` : '';
    return await request(`/products${query}`);
  },

  async getProductById(id) {
    return await request(`/products/${id}`);
  },

  async searchProducts(query) {
    return await request(`/products/search?q=${encodeURIComponent(query)}`);
  },

  async createOrder(orderData) {
    return await request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getOrders() {
    return await request('/orders');
  },

  async getOrderById(id) {
    return await request(`/orders/${id}`);
  },

  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      await StorageService.saveToken(data.token);
      await StorageService.saveUserProfile(data.user.name, data.user.email);
    }
    return data;
  },

  async getCategories() {
    return await request('/categories');
  },
};

export default ApiService;
