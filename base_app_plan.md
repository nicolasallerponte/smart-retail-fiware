# Implementation Plan: Base FIWARE Inventory Management Application

## Issue Title: `[Feature] Base App Setup - Flask, Orion Connection, and Data Model`

## Overview
Implement the foundational components of the FIWARE Inventory Management System including Flask backend, Orion Context Broker integration, basic data model, external context provider registration, and initial UI structure.

## Acceptance Criteria
- [ ] Flask application runs on port 5000
- [ ] Successfully connects to Orion Context Broker at `host.docker.internal:1026`
- [ ] All entity types (Employee, Store, Product, Shelf, InventoryItem) can be created in Orion
- [ ] External context providers (temperature/humidity, tweets) are registered on app startup
- [ ] Basic HTML/CSS/JS frontend serves on root path
- [ ] Initial data loading script populates sample data
- [ ] Basic CRUD operations work for all entities
- [ ] Application follows the architecture documented in `architecture.md`

## Implementation Tasks

### Phase 1: Project Setup & Dependencies
- [ ] Create `requirements.txt` with necessary packages:
  - Flask==2.3.3
  - Flask-SocketIO==5.3.6
  - requests==2.31.0
  - python-socketio==5.8.0
- [ ] Create basic Flask application structure:
  - `app.py` - main application file
  - `static/` - CSS, JS, images
  - `templates/` - HTML templates
  - `import-data/` - data loading scripts
- [ ] Set up basic logging and error handling

### Phase 2: Orion Context Broker Integration
- [ ] Create Orion client module (`orion_client.py`)
- [ ] Implement connection health check (`GET /v2/version`)
- [ ] Create entity CRUD operations:
  - `create_entity(type, id, attributes)`
  - `get_entity(entity_id)`
  - `update_entity(entity_id, attributes)`
  - `delete_entity(entity_id)`
  - `list_entities(type, limit=100)`
- [ ] Implement subscription management:
  - `create_subscription(description, subject, notification)`
  - `delete_subscription(subscription_id)`

### Phase 3: Data Model Implementation
- [ ] Create entity model classes with validation:
  - `Employee` - with refStore relationship
  - `Store` - with external attributes
  - `Product` - with color validation
  - `Shelf` - with store relationship
  - `InventoryItem` - with stock management
- [ ] Implement NGSIv2 attribute mapping for all entities
- [ ] Add data validation using the constraints from `data_model.md`
- [ ] Create entity relationship validation (foreign keys)

### Phase 4: External Context Provider Registration
- [ ] Implement context provider registration on app startup:
  - Temperature & Humidity provider registration
  - Tweets provider registration
- [ ] Use `host.docker.internal` for Docker networking
- [ ] Store registration IDs for cleanup on shutdown
- [ ] Add registration verification (check provider responses)

### Phase 5: REST API Endpoints
- [ ] Product endpoints:
  - `GET /api/products` - list all products
  - `POST /api/products` - create product
  - `GET /api/products/<id>` - get product details
  - `PATCH /api/products/<id>` - update product
  - `DELETE /api/products/<id>` - delete product
- [ ] Store endpoints:
  - `GET /api/stores` - list all stores
  - `POST /api/stores` - create store
  - `GET /api/stores/<id>` - get store details
  - `PATCH /api/stores/<id>` - update store
  - `DELETE /api/stores/<id>` - delete store
- [ ] Employee endpoints:
  - `GET /api/employees` - list all employees
  - `POST /api/employees` - create employee
  - `GET /api/employees/<id>` - get employee details
  - `PATCH /api/employees/<id>` - update employee
  - `DELETE /api/employees/<id>` - delete employee
- [ ] Shelf and InventoryItem endpoints (basic CRUD)

### Phase 6: Basic Frontend Structure
- [ ] Create base HTML template (`templates/base.html`)
- [ ] Implement basic navigation (sticky navbar)
- [ ] Create placeholder pages:
  - Home page with UML diagram
  - Products list page
  - Stores list page
  - Employees list page
- [ ] Add basic CSS styling (prefer CSS over JS)
- [ ] Include Font Awesome for icons
- [ ] Set up basic JavaScript for dynamic content

### Phase 7: Initial Data Loading
- [ ] Create `import-data/load_initial_data.py` script
- [ ] Implement data loading in correct order:
  1. Products (10 items)
  2. Employees (4 items with store assignments)
  3. Stores (4 items)
  4. Shelves (16 items, 4 per store)
  5. InventoryItems (256+ items distributed across shelves)
- [ ] Add data validation during import
- [ ] Include error handling and rollback on failure
- [ ] Add command-line interface for data loading

### Phase 8: Testing & Validation
- [ ] Test Orion connection and basic CRUD operations
- [ ] Verify external context provider registrations
- [ ] Test data loading script with sample data
- [ ] Validate entity relationships and constraints
- [ ] Test basic frontend navigation
- [ ] Ensure application starts without errors

## Technical Considerations
- **Docker Networking**: Use `host.docker.internal` instead of `localhost` for Orion connections
- **Error Handling**: Implement proper error responses and logging
- **Data Validation**: Enforce constraints from `data_model.md`
- **Performance**: Implement basic caching for frequently accessed data
- **Security**: Basic input validation (no authentication yet)

## Dependencies
- Docker Compose with Orion, MongoDB, and Context Providers (from FIWARE tutorial)
- Python 3.8+
- All packages listed in `requirements.txt`

## Files to Create/Modify
- `app.py` - Main Flask application
- `orion_client.py` - Orion integration module
- `models.py` - Entity model classes
- `requirements.txt` - Python dependencies
- `static/css/style.css` - Base styling
- `static/js/app.js` - Frontend JavaScript
- `templates/base.html` - Base template
- `templates/index.html` - Home page
- `import-data/load_initial_data.py` - Data loading script
- `.gitignore` - Exclude venv and cache files

## Testing Strategy
- Unit tests for Orion client operations
- Integration tests for API endpoints
- Manual testing of data loading
- Browser testing of basic UI functionality

## Risk Assessment
- **Orion Connection Issues**: May require Docker network configuration
- **Context Provider Registration**: Depends on tutorial container setup
- **Data Model Complexity**: Many entity relationships to maintain
- **Frontend Complexity**: Multiple views with different layouts

## Success Metrics
- Application starts without errors
- All entities can be created and retrieved from Orion
- External context providers are registered and accessible
- Basic UI loads and navigation works
- Initial data loads successfully
- No critical errors in application logs

## Next Steps After Completion
This base implementation will enable:
- Product, Store, and Employee management
- Basic inventory tracking
- External data integration
- Foundation for real-time notifications (Phase 2)
- UI enhancements (Phase 3)

---

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Code committed to feature branch
- [ ] Basic manual testing completed
- [ ] No critical errors or security issues
- [ ] Documentation updated if needed
- [ ] Ready for merge to main branch