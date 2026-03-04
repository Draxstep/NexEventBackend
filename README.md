# NexEvent Backend 🚀

Bienvenido al repositorio oficial del Backend de **NexEvent**, una API RESTful diseñada para centralizar la gestión de eventos, ubicaciones (ciudades/departamentos) e intereses de usuarios.

## 🛠️ Tecnologías y Herramientas

- **Entorno de Ejecución:** Node.js (ES Modules).
- **Framework Web:** Express.js (v5).
- **Base de Datos:** PostgreSQL.
- **ORM:** Sequelize.
- **Autenticación y Gestión de Usuarios:** [Clerk](https://clerk.com/) e integraciones de Webhooks mediante [Svix](https://www.svix.com/).
- **Manejo de Archivos:** [Multer](https://github.com/expressjs/multer) para la carga y gestión de imágenes de eventos.

## 📁 Arquitectura del Proyecto

El proyecto está modularizado dividiendo las responsabilidades para hacerlo escalable y fácil de mantener:

- **`/config`**: Configuraciones centrales (ej: conexión con la base DB mediante Sequelize).
- **`/controllers`**: Lógica de los endpoints y procesamiento de requests (Manejo de Eventos, Categorías, Webhooks).
- **`/middlewares`**: Validadores de datos, manejo centralizado de errores y middlewares de seguridad (`requireAuth.js`).
- **`/models`**: Modelos y esquemas de la base de datos (Usuario, Evento, Ciudad, etc.) y definición de `Asociaciones.js`.
- **`/routes`**: Definición de las rutas del servidor Express y enrutamiento hacia sus controladores respectivos.
- **`/services`**: Capa con la lógica central de negocio e integraciones externas (como `ImgDbService.js`).
- **`/utils`**: Funciones útiles globales, como el `asyncHandler` para capturar excepciones sin repetir bloques Try-Catch.

## 📋 Requisitos Previos

Antes de proceder, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (Se recomienda versión v18+).
- [PostgreSQL](https://www.postgresql.org/) o una instancia en la nube.
- Cuenta configurada en **Clerk** para la gestión de acceso.

## ⚙️ Instalación y Ejecución Local

Sigue los siguientes pasos para poner en marcha el proyecto:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Draxstep/NexEventBackend.git
   cd NexEventBackend
   ```

2. **Instalar dependencias necesarias:**

   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Crea un archivo llamado `.env` en la raíz del proyecto. Deberás incluir las siguientes variables correspondientes a tu entorno (Base de datos remota/local y credenciales de Clerk/Svix):

   ```env
   # API Config
   PORT=3000

   # Database Settings (PostgreSQL)
   DB_HOST=tu_host_de_bd
   DB_PORT=5432
   DB_NAME=nombre_de_tu_bd
   DB_USER=usuario_de_tu_bd
   DB_PASS=password_de_tu_bd

   # Clerk Auth & Webhooks
   CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   WEBHOOK_SECRET=whsec_...
   ```

4. **Ejecutar el servidor:**
   Para poner a correr tu aplicación, ejecuta el siguiente comando:
   ```bash
   npm start
   ```
   Verás en la consola de tu terminal el mensaje indicando en qué puerto se está ejecutando la aplicación y que la conexión a la base de datos fue exitosa.

## 📖 Documentación de la API

Para revisar todos los endpoints integrados en el sistema (gestión de eventos, departamentos, eventos de interés), revisa el archivo de documentación oficial:
👉 **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

---

**Desarrollado para NexEvent**
