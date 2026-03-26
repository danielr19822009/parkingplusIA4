# ParkingPlus IA4 - Sistema de Gestión de Parqueadero

Este proyecto es un sistema integral para la gestión de un parqueadero, con funcionalidades de rastreo de vehículos, control de entrada/salida, gestión de novedades y validación de Pico y Placa.

## Requisitos
- Node.js (v14 o superior)
- MySQL Server en `localhost`

## Estructura
- `backend/`: Código del servidor, API y lógica de negocio.
- `frontend/`: Interfaz de usuario (HTML, CSS, JS).
- `database/`: Scripts de creación de la base de datos.

## Instalación y Configuración

1. **Base de Datos**:
   - Asegúrate de tener MySQL ejecutándose.
   - Crea una base de datos llamada `parkingplus`.
   - Importa el archivo `database/schema.sql` para crear las tablas.

2. **Backend**:
   - Navega a la carpeta `backend/`.
   - Ejecuta `npm install` para instalar las dependencias (`express`, `mysql2`, `bcryptjs`, etc.).
   - Revisa el archivo `.env` y ajusta tus credenciales de MySQL (usuario, contraseña, etc.).

3. **Ejecución**:
   - En la carpeta `backend/`, ejecuta `npm start`.
   - Abre tu navegador en `http://localhost:3000`.

## Características Clave
- **Rastreo Público**: Permite a los usuarios buscar su vehículo por placa desde la página principal.
- **Validación de Pico y Placa**: El sistema bloquea automáticamente el ingreso si la placa tiene restricción el día actual.
- **Gestión de Novedades**: Permite registrar observaciones sobre el estado de los vehículos al ingresar.
- **Panel Administrativo**: Control total sobre usuarios, clientes y reglas de restricción.
