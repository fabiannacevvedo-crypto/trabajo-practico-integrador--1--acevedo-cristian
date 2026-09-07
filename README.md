# Sistema de Gestión de Blog Personal con Autenticación

Desarrollo integral de una API RESTful para un sistema de blog personal con autenticación de usuarios, gestión de perfiles, artículos y etiquetas, implementando autenticación JWT en cookies seguras httpOnly, relaciones bidireccionales de Sequelize (1:1, 1:N, N:M), eliminación lógica (paranoid) y eliminación en cascada.

## Tecnologías Utilizadas
- **Node.js** (ESModules - import/export)
- **Express.js** (Servidor HTTP, middlewares, enrutamiento)
- **Sequelize** (ORM para modelado y relaciones con MySQL)
- **MySQL2** (Driver de conexión a base de datos MySQL)
- **JSONWebToken (JWT)** (Generación y verificación de tokens en cookies)
- **Bcrypt / Bcryptjs** (Hasheo seguro de contraseñas)
- **Cookie-Parser** (Gestión y lectura de cookies httpOnly)
- **Express-Validator** (Validaciones de esquemas, campos y validaciones personalizadas)
- **CORS** (Permite solicitudes entre orígenes)
- **Dotenv** (Gestión de variables de entorno)

---

## Estructura del Proyecto

```
trabajo-practico-integrador--1--acevedo-cristian/
├── src/
│   ├── config/
│   │   └── database.js            # Configuración de Sequelize y conexión a MySQL
│   ├── controllers/
│   │   ├── auth.controller.js     # Controladores de autenticación y perfil
│   │   ├── user.controller.js     # CRUD de usuarios (administrador)
│   │   ├── article.controller.js  # CRUD de artículos
│   │   ├── tag.controller.js      # CRUD de etiquetas
│   │   └── articleTag.controller.js # Asociación de artículos con etiquetas
│   ├── helpers/
│   │   ├── jwt.helper.js          # Utilidades para firmar y verificar JWT
│   │   └── bcrypt.helper.js       # Utilidades para hashear y comparar contraseñas
│   ├── middlewares/
│   │   ├── auth.middleware.js     # Validación de JWT desde cookie
│   │   ├── admin.middleware.js    # Autorización por rol 'admin'
│   │   ├── owner.middleware.js    # Verificación de autoría del recurso
│   │   └── validators.middleware.js # Validaciones completas con express-validator
│   ├── models/
│   │   ├── user.model.js          # Modelo User (paranoid: true)
│   │   ├── profile.model.js       # Modelo Profile (1:1 con User)
│   │   ├── article.model.js       # Modelo Article (1:N y N:M, paranoid: true)
│   │   ├── tag.model.js           # Modelo Tag (N:M con Article)
│   │   ├── articleTag.model.js    # Modelo intermedio ArticleTag
│   │   └── index.js               # Definición de relaciones y alias
│   └── routes/
│       ├── auth.routes.js         # Rutas de autenticación
│       ├── user.routes.js         # Rutas de administración de usuarios
│       ├── article.routes.js      # Rutas de artículos
│       ├── tag.routes.js          # Rutas de etiquetas
│       ├── articleTag.routes.js   # Rutas de asociación artículo-etiqueta
│       └── index.js               # Enrutador principal montado en /api
├── .env.example
├── app.js                         # Servidor Express principal
└── package.json
```

---

## Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
# Configuración del servidor
PORT=3000

# Configuración de MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=blog_db

# Clave secreta para JWT
JWT_SECRET=super_secret_jwt_key_blog_2026
```

---

## Instalación y Ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/fabiannacevvedo-crypto/trabajo-practico-integrador--1--acevedo-cristian.git
   cd trabajo-practico-integrador--1--acevedo-cristian
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   O ejecutar directamente con:
   ```bash
   node app.js
   ```

---

## Endpoints de la API (`/api`)

### Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registro de usuario con creación automática de perfil (201 Created) |
| POST | `/api/auth/login` | Público | Login con JWT enviado en cookie segura httpOnly (200 OK) |
| GET | `/api/auth/profile` | Autenticado | Obtener perfil del usuario en sesión (200 OK) |
| PUT | `/api/auth/profile` | Autenticado | Actualizar perfil del usuario en sesión (200 OK) |
| POST | `/api/auth/logout` | Autenticado | Cerrar sesión limpiando la cookie (200 OK) |

### Usuarios (`/api/users`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/users` | Solo Admin | Listar todos los usuarios con sus perfiles |
| GET | `/api/users/:id` | Solo Admin | Obtener usuario con perfil y artículos asociados |
| POST | `/api/users` | Solo Admin | Crear usuario y su perfil (201 Created) |
| PUT | `/api/users/:id` | Solo Admin | Actualizar usuario |
| DELETE | `/api/users/:id` | Solo Admin | Eliminación lógica de usuario (paranoid) |

### Etiquetas (`/api/tags`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/tags` | Solo Admin | Crear etiqueta (201 Created) |
| GET | `/api/tags` | Autenticado | Listar todas las etiquetas |
| GET | `/api/tags/:id` | Solo Admin | Obtener etiqueta con artículos asociados |
| PUT | `/api/tags/:id` | Solo Admin | Actualizar etiqueta |
| DELETE | `/api/tags/:id` | Solo Admin | Eliminar etiqueta |

### Artículos (`/api/articles`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/articles` | Autenticado | Crear artículo (201 Created) |
| GET | `/api/articles` | Autenticado | Listar artículos publicados |
| GET | `/api/articles/user` | Autenticado | Listar artículos publicados del usuario logueado |
| GET | `/api/articles/user/:id` | Autenticado | Obtener artículo del usuario logueado por su ID |
| GET | `/api/articles/:id` | Autenticado | Obtener artículo específico por ID |
| PUT | `/api/articles/:id` | Autor o Admin | Actualizar artículo |
| DELETE | `/api/articles/:id` | Autor o Admin | Eliminación lógica (paranoid) y cascada de etiquetas |

### Asociación de Etiquetas a Artículos (`/api/articles-tags`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/articles-tags` | Solo Autor | Asociar etiqueta a artículo (201 Created) |
| DELETE | `/api/articles-tags/:articleTagId` | Solo Autor | Remover etiqueta del artículo |

---

## Flujo de Trabajo con Git y Ramas

El proyecto siguió estrictamente el modelo de control de versiones solicitado:
1. `main`: Rama principal de producción con el README inicial.
2. `develop`: Rama creada a partir de `main` para consolidación de avances.
3. `proyecto-integrador`: Rama de desarrollo creada desde `develop`, en la cual se realizaron más de 10 commits descriptivos en español cubriendo cada requerimiento.
4. Finalización mediante merges limpios:
   - `proyecto-integrador` -> `develop`
   - `develop` -> `main`
