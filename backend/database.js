const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'naturapp_backend.db');
const db = new sqlite3.Database(dbPath);

const initializeDB = () => {
  db.serialize(() => {
    // Create Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        price REAL,
        image TEXT,
        category TEXT,
        stock INTEGER,
        rating REAL,
        benefits TEXT
      )
    `);

    // Create Orders Table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL,
        address TEXT,
        status TEXT,
        date TEXT,
        items TEXT
      )
    `);

    // Check if products exist, if not insert default data with real images
    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
      if (row && row.count === 0) {
        const insertStmt = db.prepare(`
          INSERT INTO products (id, name, description, price, image, category, stock, rating, benefits)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const initialProducts = [
          {
            id: '1',
            name: 'Miel de Abeja Orgánica',
            description: 'Miel 100% pura extraída artesanalmente de los valles andinos.',
            price: 35.00,
            image: 'http://10.0.2.2:9090/images/miel_real.jpg',
            category: 'miel',
            stock: 20,
            rating: 4.8,
            benefits: JSON.stringify(['Endulzante natural', 'Propiedades antisépticas'])
          },
          {
            id: '2',
            name: 'Aceite de Coco Extra Virgen',
            description: 'Aceite prensado en frío ideal para cocina saludable y cuidado personal.',
            price: 45.00,
            image: 'http://10.0.2.2:9090/images/aceite_real.jpg',
            category: 'aceites',
            stock: 15,
            rating: 4.9,
            benefits: JSON.stringify(['Grasas saludables', 'Hidratante natural'])
          },
          {
            id: '3',
            name: 'Cápsulas de Uña de Gato',
            description: 'Poderoso desinflamante y protector del sistema inmune.',
            price: 45.00,
            image: 'http://10.0.2.2:9090/images/una_gato_real.jpg',
            category: 'capsulas',
            stock: 25,
            rating: 4.8,
            benefits: JSON.stringify(['Desinflamante', 'Refuerza defensas'])
          },
          {
            id: '4',
            name: 'Harina de Tocosh',
            description: 'Penicilina natural de los Andes para el sistema digestivo.',
            price: 25.00,
            image: 'http://10.0.2.2:9090/images/tocosh_real.jpg',
            category: 'superfoods',
            stock: 15,
            rating: 4.5,
            benefits: JSON.stringify(['Protector gástrico', 'Antibiótico natural'])
          },
          {
            id: '5',
            name: 'Harina de Maca Negra',
            description: 'Superalimento energizante natural de los Andes peruanos.',
            price: 28.50,
            image: 'http://10.0.2.2:9090/images/maca_real.jpg',
            category: 'superfoods',
            stock: 30,
            rating: 4.7,
            benefits: JSON.stringify(['Aumenta energía', 'Mejora concentración'])
          },
          {
            id: '6',
            name: 'Cápsulas de Moringa',
            description: 'Suplemento rico en vitaminas y antioxidantes.',
            price: 52.00,
            image: 'http://10.0.2.2:9090/images/moringa_real.jpg',
            category: 'capsulas',
            stock: 10,
            rating: 4.6,
            benefits: JSON.stringify(['Refuerza defensas', 'Desinflamante'])
          }
        ];

        initialProducts.forEach(p => {
          insertStmt.run(p.id, p.name, p.description, p.price, p.image, p.category, p.stock, p.rating, p.benefits);
        });
        insertStmt.finalize();
        console.log('Database initialized with default products (Real images).');
      }
    });
  });
};

module.exports = { db, initializeDB };
