# NaturApp 🌿

Aplicación Móvil de Comercio Electrónico de Productos Naturales inspirada en Santa Natura.
Desarrollada con **React Native** (Expo) implementando la arquitectura **MVVM (Model-View-ViewModel)**.

## 🚀 Tecnologías y Arquitectura

- **Frontend:** React Native, Expo Router.
- **Arquitectura:** MVVM (Model-View-ViewModel) implementado mediante *Custom Hooks* (`useProducts`, `useOrders`, `useCart`).
- **Persistencia de Datos:**
  - **Local (AsyncStorage):** Para gestionar el carrito de compras y la persistencia de la sesión del usuario.
  - **Base de Datos Local (SQLite):** (Opcional/Integrada en diseño)
  - **Remota (API REST):** Backend en Node.js con Express y SQLite para gestionar el catálogo de productos y órdenes.

## 🛠️ Lo que hemos implementado en esta sesión

1. **Backend Local (API REST):**
   - Se configuró un servidor Node.js + Express en la carpeta `backend/`.
   - Se implementó una base de datos SQLite remota (`naturapp_backend.db`).
   - Se generaron e integraron 6 **fotografías reales** de productos (Miel, Aceite de Coco, Maca, Uña de Gato, Tocosh y Moringa) almacenadas físicamente en `backend/public/images/` y servidas vía API.
   - Se añadieron `logs` interactivos para observar las peticiones en tiempo real desde el emulador.

2. **Frontend (App Móvil):**
   - Se solucionó el problema del scroll en la lista de productos (`FlatList` con `flex: 1`).
   - Se actualizó el ViewModel `useOrders.js` implementando `useFocusEffect` para que la vista de "Mis Pedidos" consulte automáticamente a la API al abrir la pestaña.
   - Se conectó la aplicación para que consuma imágenes y datos dinámicamente desde la URL del backend (`http://10.0.2.2:9090/api`).

## ⚙️ Cómo ejecutar el proyecto

1. **Iniciar el Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   El backend se ejecutará en `http://localhost:9090` (accesible como `10.0.2.2:9090` desde el emulador Android).

2. **Iniciar la App Móvil:**
   Abre otra terminal en la raíz del proyecto y ejecuta:
   ```bash
   npm install
   npx expo start
   ```
   Presiona `a` para abrir en el emulador de Android.

---
*Desarrollado para la sesión 10 - Diseño de Software Móvil II*
