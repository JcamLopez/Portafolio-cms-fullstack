# 🎨 Frontend Architecture & Guidelines - Headless CMS Portfolio

## 🏗️ Stack Tecnológico Base
* **Librería UI:** React.js (v18+)
* **Lenguaje:** TypeScript (Tipado Estricto)
* **Empaquetador (Bundler):** Vite
* **Estilos:** Tailwind CSS v4 (Utility-first)
* **Enrutamiento:** React Router v6 (Patrón de Layouts)
* **Cliente HTTP:** Axios (Con interceptores para JWT)

---

## 📂 Arquitectura de Carpetas (Patrón Modular Basado en Capas)
El proyecto sigue una estricta separación de responsabilidades (Separation of Concerns). Toda la lógica reside en `src/`:

* `api/` -> Configuración centralizada de Axios y llamadas HTTP. Cero fetch/axios sueltos en los componentes.
* `components/` -> Componentes visuales "tontos" y reutilizables (Botones, Inputs, Tarjetas, Modales).
* `context/` -> Manejo del estado global de React (Ej. `AuthContext` para saber si el usuario está logueado).
* `layouts/` -> Plantillas de enrutamiento estructural (Ej. `AdminLayout` con Sidebar protector, `PublicLayout` con Navbar público).
* `pages/` -> Vistas completas que actúan como "contenedores inteligentes" (Llaman a la API y pasan datos a los componentes).
* `types/` -> Interfaces y Tipos de TypeScript (Reflejo exacto de las interfaces del Backend / Prisma).
* `utils/` -> Funciones puras de ayuda (Formateo de fechas, validación de strings, manejo del LocalStorage).

---

## 📜 Convenciones y Reglas de Desarrollo

### 1. Regla de Tipado (TypeScript)
* Queda **estrictamente prohibido** el uso del tipo `any`.
* Todas las respuestas de la API (`api/`) y las props de los componentes (`components/`) deben tener su `interface` definida.

### 2. Regla de Peticiones HTTP
* Ningún componente dentro de `components/` o `pages/` debe importar `axios` directamente.
* Todas las llamadas a la API deben extraerse a servicios dentro de la carpeta `api/` (Ej. `api/projects.ts`).
* El Token JWT se inyectará automáticamente en las cabeceras de las peticiones protegidas utilizando un **Axios Interceptor**.

### 3. Regla de Estilos (Tailwind v4)
* No se crearán archivos `.css` tradicionales (salvo el `index.css` de inicialización).
* El diseño debe ser 100% responsivo usando los prefijos de Tailwind (`sm:`, `md:`, `lg:`).
* Para clases muy repetitivas o dinámicas, se permite el uso de librerías de utilidad como `clsx` o `tailwind-merge` si el proyecto lo requiere.

### 4. Regla de los Dos Mundos (Seguridad)
* **Mundo Público:** Rutas de solo lectura (`/`, `/projects`). Cualquier usuario puede acceder.
* **Mundo Privado (CMS):** Rutas de escritura (`/admin/*`). Protegidas por un Layout Guardián.
* Si el `AuthContext` no detecta un JWT válido en `localStorage`/`sessionStorage`, el usuario debe ser redirigido automáticamente a `/login` sin renderizar el panel.

---

## 🛡️ Flujo de Autenticación
1. El usuario ingresa credenciales en `/login`.
2. Se hace un `POST` al endpoint de auth del backend.
3. Se recibe el Token JWT y los datos del usuario.
4. Se guarda el JWT en el entorno del cliente (recomendado: `localStorage` para persistencia o `sessionStorage` para mayor control).
5. Se actualiza el `AuthContext` para notificar a toda la app que el administrador está activo.
6. React Router desbloquea el acceso a las rutas `/admin`.