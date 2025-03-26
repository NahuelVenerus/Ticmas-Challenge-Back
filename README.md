# **Planify - Task Management App**

## **Backend**

### **Descripción**

El **Backend** de *Planify* se encarga de manejar toda la lógica de negocio y persistencia de datos. Está desarrollado con **Nest.js** (un framework para Node.js), utilizando **TypeORM** para interactuar con la base de datos **PostgreSQL**.

### **Características principales**

- **Autenticación**: Implementación de autenticación y autorización usando **JWT** (JSON Web Tokens).
- **Interacción con la base de datos**: Uso de **TypeORM** para manejar las consultas a la base de datos PostgreSQL.
- **Estructura modular**: La arquitectura del backend está organizada en módulos, lo que facilita la escalabilidad y el mantenimiento.
- **API RESTful**: El backend expone endpoints RESTful que pueden ser consumidos por el frontend.

### **Tecnologías utilizadas**

- **Nest.js**: Framework para crear aplicaciones backend escalables y de alto rendimiento basado en Node.js.
- **TypeORM**: ORM para interactuar con la base de datos PostgreSQL.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional.
- **JWT (JSON Web Tokens)**: Para la autenticación y autorización de los usuarios.
- **Bcrypt**: Para encriptar las contraseñas de los usuarios.
- **Swagger**: Para la documentación automática de la API.

### **Instrucciones de instalación y ejecución**

1. **Clonar el repositorio**:

   git clone https://github.com/usuario/planify-backend.git

   cd back

2. **Instalar dependencias**:

    con **npm**

    npm install

    o con **yarn**:

    yarn install

3. **Configurar variables de entorno**:

- `DB_TYPE`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `JWT_SECRET`
- `FRONT_BASE_ROUTE`
- `DATABASE_URL`


4. **Ejecutar en desarrollo**:    

    con **npm**:
    
    npm start

    o con **yarn**:

    yarn start

5. **Ejecutar en producción**:

    con **npm**:

    npm run start:prod

    O con **yarn**:

    yarn build

    yarn start:prod

5. **Comandos relacionados con la base de datos**:

    con **npm**:
    
    npm run db:reset

    o con **yarn**:

    yarn db:reset