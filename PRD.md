# Product Requirements Document (PRD)

## 0. Implementation Status

- [x] Base app architecture and requirements documented
- [x] Feature branch `feature/app-base` created
- [x] Flask app structure implemented with entity blueprints
- [x] Initial data script created and ready to run
- [x] Real-time notifications implemented with Socket.IO
- [x] Context providers registered on startup
- [x] Orion subscriptions for price changes and low stock alerts
- [x] Store list and detail views implemented with maps and 3D tours
- [x] Product list view with color squares and delete buttons
- [x] Employee list view with icons and delete buttons
- [x] Product detail view with inventory grouped by store/shelf and add-to-shelf functionality

## 1. Overview

**Application Name:** FIWARE Inventory Management System (Practice 2)

**Description:** An improved web-based inventory management application built on FIWARE NGSIv2 that enables real-time stock tracking, store operations, and employee management. The system integrates with Orion Context Broker to subscribe to price changes and low stock alerts, providing server-to-client notifications via Socket.IO.

**Target Users:** Store managers, warehouse operators, inventory supervisors

**Key Value Propositions:**
- Real-time stock level monitoring with instant notifications
- Multi-store inventory tracking from a single dashboard
- Live updates without page refresh (Socket.IO)
- Visual 3D warehouse tours and map-based store locations
- Automatic alerts on price changes and low stock conditions

---

## 2. Features

### 2.1 Product Management

**Description:** View, create, and manage products in the inventory system.

**Entities & Attributes:**
- ID, Name, Price, Size, Color (RGB hex), Image URL

**List View:**
- Display products as a table with columns: Image, Name, Price, Size, Color (colored square icon), Delete, Edit
- Add button at top to create new product
- Edit and delete functionality

**Detail View:**
- Display product details with inventory grouped by store then shelf
- Show stock counts for each shelf
- Add-to-shelf form with dynamic select showing only eligible shelves
- Shelf names resolved from IDs

**Acceptance Criteria:**
- [x] Products display correctly in a sortable/filterable table
- [x] Color is displayed as a Font Awesome colored square icon
- [x] Product detail page shows inventory grouped by store/shelf
- [x] Add-to-shelf functionality with dynamic shelf selection
- [x] Shelf names displayed instead of IDs
- [ ] New products can be created with validation
- [ ] Product details can be edited (except ID)
- [ ] Products can be deleted with confirmation

---

### 2.2 Store Management

**Description:** Manage multiple stores with their shelves and inventory.

**Entities & Attributes:**
- ID, Name, URL, Telephone, Country Code (2 chars), Capacity (cubic metres), Description, Image
- External attributes: Temperature, Relative Humidity, Tweets (from context providers)
- Location/Address for mapping

**List View:**
- Display stores as a table with columns: Image, Name, Country Code (flag icon), Temperature, Relative Humidity, Delete, Edit
- Add button at top to create new store
- Temperature and humidity shown with Font Awesome icons and color coding
- Edit and delete functionality

**Detail View:**
- Leaflet JS map showing store location
- Three.js 3D virtual tour of warehouse showing shelves with products and unit counts
- InventoryItems table grouped by Shelf:
  - Header row per Shelf: Name, Fill level progress bar (color-coded), Edit button, Add Product button
  - Sub-rows: Product image, name, price, size, color, stock count, shelf count, Buy One button
- "Add a Shelf" button to create new shelf for this store
- Temperature and humidity displayed with icons and numeric values
- Tweets section with X/Twitter icon and latest tweets from context provider
- Real-time notifications panel showing incoming alerts

**Acceptance Criteria:**
- [x] Store list displays all stores with correct attributes
- [x] Store detail page loads with map and 3D tour
- [x] Inventory items are correctly grouped by shelf
- [x] Fill level progress bar color changes based on capacity (e.g., red <25%, yellow 25-75%, green >75%)
- [x] External context providers (temperature, humidity, tweets) display correctly
- [x] Add Shelf button creates new shelf in database
- [x] Add Product button shows only products not yet on that shelf
- [x] Buy One button correctly decrements stock via Orion PATCH request
- [x] Real-time notifications appear when price changes or stock drops

---

### 2.3 Employee Management

**Description:** Manage employee records with skills tracking.

**Entities & Attributes:**
- ID, Name, Email, Date of Contract, Skills (MachineryDriving, WritingReports, CustomerRelationships), Username, Password, Category (inferred or set)

**List View:**
- Display employees as a table with columns: Photo, Name, Email, Category (icon), Skills (icons), Delete, Edit
- Employee photo has CSS zoom transition on hover
- Add button at top to create new employee
- Edit and delete functionality

**Acceptance Criteria:**
- [x] Employees display correctly in a table
- [x] Category displays with appropriate Font Awesome icon
- [x] Skills display with icons per skill type
- [x] Employee photos zoom on hover with CSS transition
- [ ] New employees can be created with validation
- [ ] Employee details can be edited
- [ ] Employees can be deleted with confirmation

---

### 2.4 Shelf and Inventory Management

**Description:** Nested data structure managing product placement on shelves within stores.

**Entities & Attributes:**
- Shelf: ID, Store ID, Name, Level, Image
- InventoryItem: ID, Product ID, Shelf ID, Stock Count, Shelf Count

**Functionality:**
- Add shelves to stores (from store detail page)
- Add products to shelves (dynamic select shows only eligible products)
- Track both shelf count and store count for each product per shelf
- Buy one unit: decrement both shelfCount and stockCount via Orion PATCH

**Acceptance Criteria:**
- [ ] Shelves can be added to stores
- [ ] Products can be added to shelves (only products not yet on that shelf)
- [ ] Stock counts are properly tracked and displayed
- [ ] Buy One button correctly updates Orion and reflects in UI

---

## 3. Real-time Notifications

**Description:** Subscribe to Orion events and notify users in real-time.

### 3.1 Price Change Notifications

**Trigger:** Product price is updated in Orion

**Behavior:**
- Notification is received by backend from Orion subscription
- Forwarded to all connected clients via Socket.IO
- Price updates in all views where it appears (product list, store inventory tables)
- Notification panel shows "Price changed: [Product] is now €X.XX" with timestamp

**Acceptance Criteria:**
- [x] Price changes in Orion trigger subscription
- [x] Backend receives notification from Orion
- [x] Notification is forwarded via Socket.IO to all clients
- [x] Price updates in product list view
- [x] Price updates in all store inventory detail views
- [x] Notification appears in notifications panel with timestamp

---

### 3.2 Low Stock Alerts

**Trigger:** Stock count of any product in any store falls below a threshold (e.g., 5 units)

**Behavior:**
- Notification is received by backend from Orion subscription
- Forwarded to all connected clients via Socket.IO
- Stock count updates in affected store's inventory table
- Notification panel shows "Low stock alert: [Product] @ [Store] ([Count] units)" with timestamp

**Acceptance Criteria:**
- [x] Low stock condition triggers Orion subscription
- [x] Backend receives notification from Orion
- [x] Notification is forwarded via Socket.IO to all clients
- [x] Stock count updates in affected store's inventory table
- [x] Notification appears in notifications panel with timestamp

---

## 4. External Integrations

**Description:** Integration with FIWARE Context Providers for dynamic data.

### 4.1 Temperature & Humidity Provider

**Source:** External context provider in `tutorial` container

**Data Provided:**
- Current temperature at each store
- Current relative humidity at each store

**Integration:**
- Registered with Orion on app startup using NGSIv2 registration
- Periodically fetched or subscribed via Orion
- Displayed in store list and detail views with Font Awesome icons
- Color coding: Blue (cold), Green (optimal), Red (hot)

**Acceptance Criteria:**
- [x] Context provider is registered with Orion on app startup
- [ ] Temperature and humidity are fetched from Orion for all stores
- [ ] Values display with appropriate color coding
- [ ] Icons use Font Awesome (e.g., thermometer, droplet)

---

### 4.2 Tweets Provider

**Source:** External context provider in `tutorial` container

**Data Provided:**
- Latest tweets related to each store

**Integration:**
- Registered with Orion on app startup
- Fetched via Orion and displayed on store detail page
- Displayed after inventory table with X/Twitter icon

**Acceptance Criteria:**
- [x] Tweets context provider is registered with Orion on app startup
- [ ] Tweets are fetched and displayed in store detail page
- [ ] X/Twitter icon is displayed with tweets

---

## 5. UI & Navigation

### 5.1 General Principles

- **Prefer CSS over JavaScript** whenever possible
- **Avoid generating HTML from JS** — update existing element attributes instead
- Use **Font Awesome icons** for all categorical data
- Implement **dark/light mode toggle** in navbar
- Implement **multilanguage support** (English / Spanish)

---

### 5.2 Navigation Structure

**Sticky Navbar (always visible):**
- Home icon → Home page
- Products icon → Products list
- Stores icon → Stores list
- Employees icon → Employees list
- Map icon → Stores Map tab
- Language selector (EN / ES)
- Dark/Light mode toggle
- Active section highlighting

**Home Page:**
- Welcome message with multilingual support
- Mermaid UML entity diagram showing data model
- Quick stats: Total stores, total products, total employees, total inventory items
- Recent notifications feed

---

### 5.3 Data Entry & Validation

**General Requirements:**
- Use as many different HTML `<input>` types as possible (text, email, password, number, date, tel, url, color, etc.)
- Include appropriate HTML5 validation attributes (required, pattern, min, max, etc.)
- Include client-side JavaScript validation
- Provide clear error messages

**Entity-Specific Inputs:**
- **Product:** Name (text), Price (number), Size (text), Color (color picker), Image URL (url)
- **Store:** Name (text), URL (url), Telephone (tel), Country Code (text, pattern), Capacity (number), Description (textarea), Image (url)
- **Employee:** Name (text), Email (email), Date of Contract (date), Skills (checkboxes), Username (text), Password (password), Category (select)
- **Shelf:** Name (text), Level (number), Image (url)

**Acceptance Criteria:**
- [ ] All required fields are validated on form submission
- [ ] Email fields accept valid email format only
- [ ] Phone fields accept valid phone format
- [ ] Color picker is used for color selection
- [ ] Date fields use date picker
- [ ] Number fields have min/max constraints
- [ ] Clear error messages display for invalid inputs
- [ ] Country Codes accept only 2 characters

---

## 6. Visual Design Requirements

### 6.1 Animations & Transitions

1. **Employee Photo Hover:** CSS zoom transition (scale 1.0 → 1.1) on mouse hover
2. **Store Warehouse Photo:** CSS transition combining simultaneous zoom and 360° rotation on hover

### 6.2 Icons & Visual Representations

- **Color:** Colored square icon (Font Awesome or custom)
- **Country Code:** Country flag icon (Font Awesome flag collection)
- **Employee Category:** Different icon per category value
- **Skills:** Icons per skill (e.g., 🏭 for MachineryDriving, 📝 for WritingReports, 👥 for CustomerRelationships)

### 6.3 Progress Bars & Status Indicators

- **Shelf Fill Level:** Progress bar with color coding:
  - Red: < 25% capacity
  - Yellow: 25% - 75% capacity
  - Green: > 75% capacity

---

## 7. Multilanguage & Dark/Light Mode

**Multilanguage Support:**
- English (default)
- Spanish
- Select via dropdown in navbar
- All UI text, labels, error messages, and notifications translated

**Dark/Light Mode:**
- Toggle button in navbar
- Preference persisted in localStorage
- Apply to all pages and elements
- Ensure sufficient contrast in both modes

**Acceptance Criteria:**
- [ ] Language toggle changes all visible text
- [ ] Dark mode toggle changes background colors and text contrast
- [ ] Language and theme preferences persist across page reloads
- [ ] All views support both languages and themes

---

## 8. GitHub Flow Integration

This project follows GitHub Flow for all implementation:

1. **Issue Creation:** Each feature or bug is created as a GitHub issue with implementation plan
2. **Branch Creation:** A dedicated branch is created per issue (format: `feature/issue-name`)
3. **Implementation:** Code is committed regularly to the branch with clear commit messages
4. **Pull Request:** Branch is merged to main via pull request (or direct merge if repo owner)
5. **Documentation Update:** PRD.md, architecture.md, and data_model.md are updated after closing each issue

---

## 9. Technical Constraints

- **Docker Networking:** Use `host.docker.internal` instead of `localhost` when registering context providers and subscriptions in Orion
- **Real-time Communication:** Flask-SocketIO on backend, Socket.IO on frontend
- **NGSIv2:** All entity operations via Orion Context Broker
- **External Context Providers:** Registered on app startup via Orion registration API
- **Conversation Logs:** Added only at the end of project, excluded from context files

