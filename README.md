# Smart Retail FIWARE 🛍️

**Autores**: Jacobo Cousillas Taboada y Nicolás Aller Ponte  
**Asignatura**: Gestión de Datos en Espacios Inteligentes — Práctica 2  
**Repositorio**: [github.com/nicolasallerponte/smart-retail-fiware](https://github.com/nicolasallerponte/smart-retail-fiware)

---

## 📖 Descripción del Proyecto

Smart Retail FIWARE es una aplicación moderna de gestión logística e inventario para el sector retail, utilizando el ecosistema FIWARE. Permite la monitorización y control en tiempo real de productos, tiendas y empleados mediante protocolos estándar NGSIv2.

### Tecnologías Principales
- **Backend**: Python 3.10+, Flask
- **Tiempo Real**: FIWARE Orion Context Broker (NGSIv2), Flask-SocketIO (WebSocket)
- **Persistencia de Datos**: MongoDB (como capa de persistencia de Orion)
- **Visualización**: Leaflet.js (Mapas 2D), Three.js (Tour 3D por la tienda), Mermaid.js (UML)
- **Localización**: i18n pura en JavaScript (Inglés/Español)
- **Contenedores**: Docker y Docker Compose

---

## 🛠️ Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Python 3.10+](https://www.python.org/downloads/)
- `pip` (gestor de paquetes de Python)

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para configurar y ejecutar la aplicación localmente:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/nicolasallerponte/smart-retail-fiware.git
   cd smart-retail-fiware
   ```

2. **Iniciar contenedores Docker**:
   Levanta Orion Context Broker, MongoDB y Cygnus:
   ```bash
   docker-compose up -d
   ```

3. **Crear y activar un entorno virtual**:
   ```bash
   python -m venv venv
   # En Windows:
   .\venv\Scripts\activate
   # En Linux/macOS:
   source venv/bin/activate
   ```

4. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Cargar datos iniciales**:
   Este script elimina las entidades existentes en Orion y puebla el sistema con datos semilla, imágenes reales y banderas:
   ```bash
   # En Windows (asegurando las importaciones locales)
   $env:PYTHONPATH="."
   python import-data/load_initial_data.py
   ```

6. **Ejecutar la aplicación**:
   ```bash
   python app.py
   ```

7. **Abrir en el navegador**:
   Navega a [http://localhost:5000](http://localhost:5000) para acceder al panel de control.

---

## 🖥️ Vistas Principales

- **🏠 Inicio**: Página de bienvenida con un diagrama de entidades UML renderizado con Mermaid.
- **📦 Productos**: Gestión CRUD de artículos incluyendo estado, precios e inventario.
- **🏪 Tiendas**: Gestión de almacenes y tiendas con telemetría de temperatura y humedad en tiempo real.
- **👥 Empleados**: Gestión del personal con habilidades específicas y asignación a tiendas.
- **🗺️ Mapa de Tiendas**: Mapa interactivo de Leaflet que muestra las ubicaciones físicas de todas las tiendas.
- **🔍 Detalle de Tienda**: Vista avanzada con un **tour interactivo en 3D (Three.js)** de las estanterías y niveles de inventario en tiempo real.

---

## 🔔 Funcionalidades en Tiempo Real

- **Suscripciones**: La aplicación registra suscripciones NGSIv2 en Orion para vigilar cambios en atributos (ej. `stockCount`, `price`).
- **Notificaciones Socket.IO**: Cuando Orion detecta un cambio, notifica al backend de Flask, que envía una actualización en tiempo real al navegador mediante WebSockets.
- **Dinámica**: Las barras de inventario y mensajes de estado se actualizan instantáneamente sin recargar la página.

---

© 2026 Proyecto Smart Retail FIWARE
