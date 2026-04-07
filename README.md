# ParkingPlus IA4 - Sistema de Gestión de Parqueadero 🚗🅿️

Este proyecto es un sistema integral avanzado para la gestión de estacionamientos, diseñado con una arquitectura robusta y moderna. Permite el control de entrada/salida, rastreo de vehículos, gestión de novedades de seguridad y un potente centro de reportes con exportación de datos.

## 🚀 Requisitos
- **Node.js** (v14 o superior)
- **MySQL Server** ejecutándose en `localhost`
- **NPM** (gestor de paquetes)

## 📁 Estructura del Proyecto
- `backend/`: API REST construida con Node.js y Express. Lógica de negocio (MVC).
- `frontend/`: Interfaz de usuario diseñada con HTML5, CSS3 y JavaScript nativo.
- `database/`: Scripts de creación y esquema de la base de datos MySQL.

## 🛠️ Instalación y Configuración

1. **Base de Datos**:
   - Asegúrate de tener MySQL ejecutándose.
   - Crea una base de datos llamada `parkingplus`.
   - Importa el archivo `database/schema.sql` para crear las tablas necesarias (Usuarios, Clientes, Vehículos, Celdas, Registros, Novedades, etc.).

2. **Servidor Backend**:
   - Navega a la carpeta `backend/`.
   - Ejecuta `npm install` para instalar todas las dependencias.
   - Configura tus credenciales de acceso en el archivo `.env`:
     ```env
     PORT=3003
     DB_HOST=localhost
     DB_USER=tu_usuario
     DB_PASSWORD=tu_contraseña
     DB_NAME=parkingplus
     ```

3. **Ejecución**:
   - Dentro de la carpeta `backend/`, ejecuta `npm run dev` para el modo desarrollo (usando nodemon) o `npm start`.
   - Abre tu navegador en: `http://localhost:3003`.

## ✨ Características Principales

### 📋 Centro de Reportes Avanzado
Permite la consulta detallada de:
- **Vehículos en Patio vs Fuera**: Estado actual del parqueadero.
- **Historial Completo (Logs)**: Trazabilidad de todos los movimientos.
- **Gestión de Usuarios y Roles**: Administración de accesos (Admin, Operador, Empleado).
- **Parque Automotor y Celdas**: Control del inventario y distribución física.
- **Exportación**: Todos los reportes pueden descargarse en formato **Excel (.xlsx)** y **PDF**.

### 🔍 Rastreo y Seguridad
- **Rastreo Público**: Los clientes pueden verificar el estado de su vehículo por placa desde el index.
- **Gestión de Novedades**: Registro fotográfico (opcional) y descriptivo de daños o incidentes al ingresar el vehículo.
- **Pico y Placa**: Validación automática diaria para restringir el ingreso según el último dígito de la placa.

### 💼 Administración
- Gestión completa de clientes frecuentes.
- Asignación dinámica de celdas según el tipo de vehículo (Carro/Moto).
- Cálculo automático de tiempos y estados de permanencia.

## 🧰 Stack Tecnológico
- **Frontend**: HTML5, CSS3 (Custom Variables & Glassmorphism), Vanilla JavaScript.
- **Backend**: Node.js, Express.js.
- **Base de Datos**: MySQL (Consultas RAW para máxima velocidad).
- **Bibliotecas**: `jsonwebtoken` (Auth), `bcryptjs` (Seguridad), `xlsx` (Excel), `html2pdf.js` (PDF).
