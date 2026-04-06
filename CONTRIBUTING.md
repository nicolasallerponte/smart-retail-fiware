# Contributing to Smart Retail FIWARE

Thank you for your interest in contributing! This project is a university practice built with Flask and FIWARE NGSIv2.

## Getting Started

### Prerequisites

- Python 3.10+
- Docker Desktop
- Git

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/nicolasallerponte/smart-retail-fiware.git
   cd smart-retail-fiware
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FIWARE stack:
   ```bash
   docker compose up -d
   ```

4. Load initial data:
   ```bash
   python -m import-data.load_initial_data
   ```

5. Run the application:
   ```bash
   python app.py
   ```

   The app will be available at `http://localhost:5000`.

## Development Workflow

We follow **GitHub Flow**:

1. Create an issue describing the feature or bug.
2. Create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "feat: describe your change"
   ```
4. Push and open a Pull Request against `main`.
5. After review and approval, merge the PR.

## Project Structure

```
smart-retail-fiware/
├── api/              # Flask blueprints (REST endpoints)
├── import-data/      # Initial data loader
├── static/           # CSS, JS assets
├── templates/        # Jinja2 HTML templates
├── app.py            # Application factory
├── models.py         # NGSI entity models
├── orion_client.py   # FIWARE Orion NGSIv2 client
└── docker-compose.yml
```

## Code Style

- Python: follow PEP 8.
- JavaScript: ES6+, no framework dependencies beyond those already loaded via CDN.
- HTML: Jinja2 templates extending `base.html`.

## Reporting Issues

Please open a GitHub Issue with a clear description of the bug or feature request, including steps to reproduce if applicable.

## Authors

- Jacobo Cousillas Taboada
- Nicolás Aller Ponte

*Gestión de Datos en Escenarios Inteligentes — Universidade da Coruña*
