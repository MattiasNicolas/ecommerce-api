#  E-Commerce API - Proyecto Final Programación 2

Este proyecto corresponde al trabajo final de la materia **Programación 2**. Se trata del desarrollo de una API RESTful para la gestión de un sistema de e-commerce, implementada con Node.js, Express y MongoDB.

##  Tecnologías utilizadas

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt (hash de contraseñas)
- Jest + Supertest (Testing)
- Dotenv, CORS, Nodemon

##  Estructura del proyecto

```
ecommerce-api/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── index.js
├── tests/
├── .env
├── package.json
└── README.md
```

##  Autenticación y Seguridad

- Registro e inicio de sesión de usuarios.
- Hash de contraseñas con `bcrypt`.
- Autenticación mediante JWT.
- Middleware de protección de rutas y control de acceso por rol (admin/cliente).

##  Funcionalidades principales

### Usuarios

- Registro y login.
- Roles: `cliente` (por defecto) y `admin`.

### Productos

- CRUD completo (solo `admin`).
- Validaciones de campos requeridos (nombre, precio, etc).

### Pedidos

- Creación de pedidos (cliente autenticado).
- Asociación de productos y usuarios al pedido.
- Estado inicial: `pendiente`.

##  Testing

Se implementaron **tests de integración y unitarios** para validar el correcto funcionamiento del sistema:

- Registro y login de usuario.
- Protección de rutas según rol.
- Creación de productos.
- Creación de pedidos.
- Funciones auxiliares como el hasheo de contraseñas.

##  Cómo iniciar el proyecto

1. Clonar el repositorio.
2. Instalar dependencias:

```bash
npm install
```

3. Crear un archivo `.env` con las siguientes variables:

```
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=claveultrasecreta
PORT=3000
```

4. Ejecutar en modo desarrollo:

```bash
npm run dev
```

5. Ejecutar tests:

```bash
npm test
```

---

Desarrollado por *MattiasNicolas*.
