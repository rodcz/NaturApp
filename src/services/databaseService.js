import * as SQLite from 'expo-sqlite';

let db = null;
let initPromise = null;

const DatabaseService = {
  // --- INICIALIZAR base de datos (Garantiza una sola instancia) ---
  async init() {
    if (db) return db;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        console.log('--- Iniciando Conexión SQLite ---');
        const database = await SQLite.openDatabaseAsync('naturapp.db');

        // Tablas por separado para estabilidad
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT,
            quantity INTEGER DEFAULT 1
          );
        `);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT,
            added_date TEXT DEFAULT (datetime('now'))
          );
        `);

        db = database;
        console.log('--- DB Lista y Conectada ---');
        return db;
      } catch (error) {
        initPromise = null;
        console.error('Error Crítico DB:', error);
        throw error;
      }
    })();

    return initPromise;
  },

  async getDb() {
    if (!db) return await this.init();
    return db;
  },

  // === OPERACIONES CRUD ===

  async addToCart(product) {
    const database = await this.getDb();
    const result = await database.runAsync(
      `INSERT OR REPLACE INTO cart
       (product_id, name, price, image, quantity)
       VALUES (?, ?, ?, ?,
         COALESCE(
           (SELECT quantity + 1 FROM cart
            WHERE product_id = ?), 1))`,
      [String(product.id), product.name,
       product.price, product.image || '', String(product.id)]
    );
    return result.lastInsertRowId;
  },

  async getCartItems() {
    const database = await this.getDb();
    return await database.getAllAsync(
      'SELECT * FROM cart ORDER BY id DESC'
    );
  },

  async updateCartQuantity(productId, quantity) {
    const database = await this.getDb();
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }
    await database.runAsync(
      'UPDATE cart SET quantity = ? WHERE product_id = ?',
      [quantity, String(productId)]
    );
  },

  async removeFromCart(productId) {
    const database = await this.getDb();
    await database.runAsync(
      'DELETE FROM cart WHERE product_id = ?',
      [String(productId)]
    );
  },

  async getCartTotal() {
    const database = await this.getDb();
    const result = await database.getFirstAsync(
      'SELECT SUM(price * quantity) as total FROM cart'
    );
    return result?.total || 0;
  },

  async clearCart() {
    const database = await this.getDb();
    await database.runAsync('DELETE FROM cart');
  },

  async getCartCount() {
    const database = await this.getDb();
    const result = await database.getFirstAsync(
      'SELECT SUM(quantity) as count FROM cart'
    );
    return result?.count || 0;
  },

  async addFavorite(product) {
    const database = await this.getDb();
    await database.runAsync(
      `INSERT OR IGNORE INTO favorites
       (product_id, name, price, image)
       VALUES (?, ?, ?, ?)`,
      [String(product.id), product.name,
       product.price, product.image || '']
    );
  },

  async removeFavorite(productId) {
    const database = await this.getDb();
    await database.runAsync(
      'DELETE FROM favorites WHERE product_id = ?',
      [String(productId)]
    );
  },

  async isFavorite(productId) {
    const database = await this.getDb();
    const row = await database.getFirstAsync(
      'SELECT id FROM favorites WHERE product_id = ?',
      [String(productId)]
    );
    return !!row;
  },

  async getFavorites() {
    const database = await this.getDb();
    return await database.getAllAsync(
      'SELECT * FROM favorites ORDER BY added_date DESC'
    );
  },
};

export default DatabaseService;
