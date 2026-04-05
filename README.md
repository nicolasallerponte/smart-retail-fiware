# Smart Retail FIWARE 🛍️

**Authors**: Jacobo Cousillas Taboada and Nicolás Aller Ponte  
**Subject**: Gestión de Datos en Entornos Inteligentes — Práctica 2  
**Repository**: [github.com/nicolasallerponte/smart-retail-fiware](https://github.com/nicolasallerponte/smart-retail-fiware)

---

## 📖 Project Description

Smart Retail FIWARE is a modern management application for retail logistics and inventory, leveraging the FIWARE ecosystem. It provides real-time monitoring and control of products, stores, and employees using standard NGSIv2 protocols.

### Main Technologies
- **Backend**: Python 3.10+, Flask
- **Real-time**: FIWARE Orion Context Broker (NGSIv2), Flask-SocketIO (WebSocket)
- **Data Persistence**: MongoDB (as Orion's peristence layer)
- **Visualization**: Leaflet.js (2D Maps), Three.js (3D Store Tour), Mermaid.js (UML)
- **Localization**: Pure JavaScript client-side i18n (English/Spanish)
- **Containerization**: Docker & Docker Compose

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Python 3.10+](https://www.python.org/downloads/)
- `pip` (Python package manager)

---

## 🚀 Getting Started

Follow these steps to set up and run the application locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nicolasallerponte/smart-retail-fiware.git
   cd smart-retail-fiware
   ```

2. **Start Docker containers**:
   Start Orion Context Broker, MongoDB, and Cygnus:
   ```bash
   docker-compose up -d
   ```

3. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Load initial data**:
   This script clears any existing Orion entities and populates the system with high-quality seed data and images:
   ```bash
   # On Windows (ensuring local imports work)
   $env:PYTHONPATH="."
   python import-data/load_initial_data.py
   ```

6. **Run the application**:
   ```bash
   python app.py
   ```

7. **Open in browser**:
   Navigate to [http://localhost:5000](http://localhost:5000) to access the dashboard.

---

## 🖥️ Main Views

- **🏠 Home**: Welcome page with a Mermaid-rendered UML Entity Diagram of the system.
- **📦 Products**: CRUD management for items including status, pricing, and inventory.
- **🏪 Stores**: Management of warehouse/retail locations with real-time temperature/humidity telemetry.
- **👥 Employees**: Staff management with specific skills and role assignments.
- **🗺️ Stores Map**: Interactive Leaflet map showing all physical store locations.
- **🔍 Store Detail**: Advanced view featuring an interactive **Three.js 3D tour** of shelves and real-time inventory levels.

---

## 🔔 Real-time Features

- **Subscriptions**: The application registers NGSIv2 subscriptions in Orion to watch for attribute changes (e.g., `stockCount`, `price`).
- **Socket.IO Notifications**: When Orion detects a change, it notifies the Flask backend, which pushes a real-time update to the browser via WebSocket.
- **Dynamics**: Inventory bars and status messages update instantly without page reloads.

---

© 2026 Smart Retail FIWARE Project
