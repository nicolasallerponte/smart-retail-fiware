# System Architecture Document

## 1. System Overview

The FIWARE Inventory Management System consists of multiple interconnected components:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Browser                              │
│    ┌──────────────────────────────────────────────────────┐    │
│    │ HTML/CSS/JS Frontend                                 │    │
│    │ - Product List/Detail                                │    │
│    │ - Store List/Detail (Leaflet Map, Three.js 3D)      │    │
│    │ - Employee List                                      │    │
│    │ - Notifications Panel                                │    │
│    │ Socket.IO Client Listener                            │    │
│    └──────────────────────────────────────────────────────┘    │
└─────────────────┬──────────────────────────────────────────────┘
                  │ HTTP Requests
                  │ Socket.IO Connection
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Python Flask Backend                         │
│    ┌──────────────────────────────────────────────────────┐    │
│    │ Flask-SocketIO Server                                │    │
│    │ - Handles HTTP endpoints (CRUD)                      │    │
│    │ - Handles Socket.IO connections                      │    │
│    │ - Forwards Orion notifications to clients            │    │
│    │ - Manages subscription callbacks                     │    │
│    └──────────────────────────────────────────────────────┘    │
└─────────────────┬──────────────────────────────────────────────┘
                  │ NGSIv2 HTTP API
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│            FIWARE Orion Context Broker (Docker)                 │
│    ┌──────────────────────────────────────────────────────┐    │
│    │ - Product entities                                   │    │
│    │ - Store entities                                     │    │
│    │ - Employee entities                                  │    │
│    │ - Shelf entities                                     │    │
│    │ - InventoryItem entities                             │    │
│    │ - Subscriptions (Price changes, Low stock alerts)    │    │
│    │ - Context Provider Registrations                     │    │
│    └──────────────────────────────────────────────────────┘    │
└────┬────────────────────────────────────────────────────────────┘
     │ Links to external providers
     ▼
┌─────────────────────────────────────────────────────────────────┐
│    External Context Providers (tutorial container)              │
│    - Temperature & Humidity Provider                            │
│    - Tweets Provider                                            │
└─────────────────────────────────────────────────────────────────┘

Database: MongoDB (managed by Orion)
```

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, JavaScript | UI rendering |
| **Frontend Maps** | Leaflet.js | Interactive store location mapping |
| **Frontend 3D** | Three.js | 3D warehouse visualization |
| **Frontend Icons** | Font Awesome | Visual representation of categories, skills, status |
| **Frontend Real-time** | Socket.IO Client | Receive real-time notifications |
| **Frontend UML** | Mermaid.js | Render entity diagram on home page |
| **Backend** | Python 3, Flask | REST API and core logic |
| **Backend Real-time** | Flask-SocketIO | WebSocket server for real-time updates |
| **Backend DB** | MongoDB | Persistent local data (optional, Orion is primary) |
| **Context Broker** | FIWARE Orion | NGSIv2 entity management and subscriptions |
| **Containerization** | Docker Compose | Multi-container orchestration |

---

## 3. Backend Architecture

### 3.1 Startup Sequence

On application startup:

1. **Initialize Flask & Socket.IO**
   - Create Flask app instance
   - Initialize Flask-SocketIO

2. **Connect to Orion**
   - Health check: GET `/v2/version` to verify Orion is running
   - Retrieve existing entities (optional)

3. **Register External Context Providers**
   - Register Temperature & Humidity Provider with Orion at `host.docker.internal:<provider_port>`
   - Register Tweets Provider with Orion at `host.docker.internal:<provider_port>`
   - Store registration IDs for future reference

4. **Register Subscriptions with Orion**
   - **Price Change Subscription:** Subscribe to all Product entity attribute changes
   - **Low Stock Subscription:** Subscribe to InventoryItem stockCount changes (with condition: stockCount < threshold)
   - Notification URL: `http://host.docker.internal:5000/orion/notifications` (backend Flask endpoint)

5. **Start Server**
   - Start Flask server on port 5000
   - Ready to accept client connections

---

### 3.2 REST API Endpoints

#### Product Endpoints
- `GET /api/products` — Retrieve all products from Orion
- `POST /api/products` — Create new product in Orion
- `GET /api/products/<id>` — Retrieve specific product
- `PATCH /api/products/<id>` — Update product attributes
- `DELETE /api/products/<id>` — Delete product

#### Store Endpoints
- `GET /api/stores` — Retrieve all stores from Orion
- `POST /api/stores` — Create new store in Orion
- `GET /api/stores/<id>` — Retrieve specific store
- `PATCH /api/stores/<id>` — Update store attributes
- `DELETE /api/stores/<id>` — Delete store

#### Employee Endpoints
- `GET /api/employees` — Retrieve all employees
- `POST /api/employees` — Create new employee
- `GET /api/employees/<id>` — Retrieve specific employee
- `PATCH /api/employees/<id>` — Update employee
- `DELETE /api/employees/<id>` — Delete employee

#### Shelf Endpoints
- `POST /api/shelves` — Create new shelf in store
- `GET /api/shelves/<store_id>` — Get all shelves in store
- `PATCH /api/shelves/<id>` — Update shelf attributes
- `DELETE /api/shelves/<id>` — Delete shelf

#### InventoryItem Endpoints
- `GET /api/inventoryitems/<store_id>` — Get all inventory items for store
- `POST /api/inventoryitems` — Add product to shelf
- `PATCH /api/inventoryitems/<id>` — Update stock counts
- `DELETE /api/inventoryitems/<id>` — Remove product from shelf

#### Buy One Unit Endpoint
- `PATCH /api/inventoryitems/<id>/buy` — Decrement shelfCount and stockCount via Orion

#### Orion Notification Callback
- `POST /orion/notifications` — Receive subscription notifications from Orion (price changes, low stock)

---

### 3.3 Subscription Notification Handler

When Orion sends a notification to `/orion/notifications`:

1. **Parse NGSIv2 notification payload**
2. **Determine notification type:**
   - If Product entity: **Price change**
   - If InventoryItem entity with low stock condition: **Low stock alert**
3. **Emit Socket.IO event to all connected clients:**
   - Event: `notification` with payload containing entity ID, type, and new values
4. **Frontend receives and updates UI accordingly**

---

### 3.4 Socket.IO Event Flow

**Server emits to clients:**
- `notification` — New price change or low stock alert with entity data
- `entity_updated` — General entity update notification

**Clients emit to server:**
- `connect` — Client connects (optional tracking)
- `disconnect` — Client disconnects (optional cleanup)

---

## 4. Frontend Architecture

### 4.1 Page Structure

**Single Page Application (SPA) with multiple views:**

```
index.html
├── navbar.html (sticky)
│   ├── Home
│   ├── Products
│   ├── Stores
│   ├── Employees
│   ├── Stores Map
│   ├── Language selector (EN/ES)
│   └── Dark/Light toggle
├── home.html (UML diagram, quick stats)
├── products/
│   ├── list.html (product table)
│   └── detail.html (product detail)
├── stores/
│   ├── list.html (store table)
│   └── detail.html (store detail with map, 3D, inventory)
├── employees/
│   └── list.html (employee table)
├── stores-map.html (Leaflet map overview)
└── notifications-panel.html (overlay with real-time alerts)
```

### 4.2 Frontend State Management

- **Current view:** Tracked by URL hash or state variable
- **Notifications:** Array of recent notifications, updated via Socket.IO
- **Dark mode:** Boolean, stored in localStorage
- **Language:** Stored in localStorage
- **Cached entities:** Optional client-side caching to reduce API calls

### 4.3 Real-time Update Mechanism

**Socket.IO Client Setup:**
```javascript
// Connect to Socket.IO server
const socket = io();

// Listen for notifications
socket.on('notification', handleNotification);

function handleNotification(data) {
  if (data.type === 'price_change') {
    updateProductPriceInAllViews(data.productId, data.newPrice);
    showNotificationAlert('Price changed: [Product] → €X.XX');
  } else if (data.type === 'low_stock') {
    updateInventoryItem(data.inventoryItemId, data.stockCount);
    showNotificationAlert('Low stock: [Product] @ [Store]');
  }
}
```

### 4.4 Key UI Components

**Product List View:**
- Fetch and render product table from `/api/products`
- Subscribe to price change notifications via Socket.IO
- Update price dynamically when notification arrives

**Store Detail View:**
- Leaflet map initialization with store coordinates
- Three.js 3D warehouse scene with shelves and products
- Inventory table fetched from `/api/inventoryitems/<store_id>`
- Real-time notifications panel showing alerts
- Temperature/humidity icons updated via subscription

**Notifications Panel:**
- Sticky overlay showing last 10 notifications
- Each notification: timestamp, type, entity name, old/new values
- Auto-dismiss after 30 seconds (optional)

---

## 5. Data Flow Diagrams

### 5.1 Price Change Notification Flow

```
User updates Product price in Orion
        ↓
Orion triggers "Price Change" subscription
        ↓
Orion sends POST to /orion/notifications (backend)
        ↓
Backend parses notification
        ↓
Backend identifies: Price change for Product[X]
        ↓
Backend emits Socket.IO event: {type: 'price_change', productId: X, newPrice: 99.99}
        ↓
All connected clients receive emission
        ↓
Frontend JavaScript:
  - Updates product list price
  - Updates store detail inventory table price
  - Shows notification in panel
  - Notification persists for 30 seconds
```

### 5.2 Low Stock Alert Flow

```
User clicks "Buy One" button for InventoryItem[Y]
        ↓
Frontend sends PATCH /api/inventoryitems/Y/buy
        ↓
Backend: PATCH Orion to decrement stockCount and shelfCount
        ↓
Orion updates InventoryItem[Y]
        ↓
If stockCount < threshold:
  Orion triggers "Low Stock" subscription
        ↓
Orion sends POST to /orion/notifications (backend)
        ↓
Backend parses notification
        ↓
Backend identifies: Low stock for InventoryItem[Y]
        ↓
Backend emits Socket.IO: {type: 'low_stock', inventoryItemId: Y, stockCount: 3}
        ↓
All connected clients receive
        ↓
Frontend JavaScript:
  - Updates stock count in affected store detail view
  - Shows alert in notification panel
  - User sees: "Low stock: [Product] @ [Store] (3 units)"
```

### 5.3 External Context Provider Integration

```
App startup
        ↓
Backend registers Temperature Provider with Orion:
  POST /v2/registrations → {
    dataProviderURL: "http://host.docker.internal:8000/temperature",
    entities: [{type: "Store", isPattern: true}],
    attributes: ["temperature", "relativeHumidity"]
  }
        ↓
        ↓
Frontend requests Store detail
        ↓
Backend: GET /api/stores/<store_id> from Orion
        ↓
Orion queries external provider for temperature/humidity
        ↓
Backend returns Store entity with temperature/relativeHumidity
        ↓
Frontend displays with icons and color coding
```

---

## 6. External Context Providers

### 6.1 Registration at Startup

On app startup, register both providers with Orion:

```
POST /v2/registrations

{
  "description": "Temperature and Humidity Provider",
  "dataProviderURL": "http://host.docker.internal:8000",
  "entities": [{
    "type": "Store",
    "isPattern": true
  }],
  "attrs": ["temperature", "relativeHumidity", "tweets"]
}
```

**Key Point:** Use `host.docker.internal` instead of `localhost` since Orion runs in Docker.

### 6.2 Data Retrieval

When frontend requests a Store entity via backend:
1. Backend: `GET /v2/entities/store:Store1`
2. Orion checks if temperature/humidity/tweets attributes are managed by context provider
3. Orion queries external provider at `http://host.docker.internal:8000`
4. Provider returns current values
5. Orion merges with local entity data
6. Backend returns to frontend

### 6.3 Display & Refresh

- Temperature and humidity values updated when store detail page loads
- Optional: Periodic polling via AJAX every 60 seconds
- Optional: Subscribe to temperature changes for real-time updates

---

## 7. Notifications Pipeline

### 7.1 Price Change Pipeline

```
Orion receives PATCH /v2/entities/product:Product1/attrs {price: 99.99}
        ↓
Updates entity
        ↓
Triggers "Price Change Subscription"
        ↓
HTTP POST to http://host.docker.internal:5000/orion/notifications
        ↓
Backend handler processes and emits Socket.IO event
        ↓
All clients update UI and show alert
```

### 7.2 Low Stock Pipeline

```
InventoryItem stockCount < 5
        ↓
Triggers "Low Stock Subscription"
        ↓
HTTP POST to http://host.docker.internal:5000/orion/notifications
        ↓
Backend handler processes and emits Socket.IO event
        ↓
Affected client (Store detail view) updates stockCount
        ↓
All clients show notification alert
```

---

## 8. GitHub Flow Workflow

This project strictly follows GitHub Flow for all implementation.

### 8.1 Standard Workflow Per Feature

**Step 1: Plan Mode**
- Create detailed implementation plan with acceptance criteria
- Outline affected files, API endpoints, UI changes
- No code changes yet

**Step 2: GitHub Issue Creation**
- Agent creates GitHub issue with plan content
- Title format: `[Feature] Brief description`
- Description: Full implementation plan with acceptance criteria

**Step 3: Branch Creation**
- Agent creates branch from `main`
- Branch naming: `feature/issue-name` (lowercase, hyphens)
- Example: `feature/product-management`

**Step 4: Implementation**
- Code changes committed to branch
- Commit messages follow convention: `[Issue #N] Brief description`
- Regular commits as features are completed (not one monolithic commit)
- Push to origin: `git push origin feature/issue-name`

**Step 5: Merge to Main**
- Once complete, merge feature branch to main
- If repo owner: Direct merge with `git merge --no-ff`
- If not repo owner: Create Pull Request for review
- Pull request title must reference issue: `Closes #N`

**Step 6: Push to Origin**
- `git push origin main` to update remote main branch

**Step 7: Close Issue & Update Documentation**
- Close GitHub issue
- **Update PRD.md** if requirements changed
- **Update architecture.md** if design changed
- **Update data_model.md** if data structures changed
- Commit these updates to main with message: `docs: update documentation after [Feature Name]`

### 8.2 Issues & Milestones

```
Initial Project Setup (Milestone 1)
├── Issue #1: Create base Flask app with Orion connection
├── Issue #2: Set up NGSIv2 data model
├── Issue #3: Implement external context provider registration
└── Issue #4: Set up Socket.IO for real-time updates

Feature Development (Milestone 2)
├── Issue #5: Product management (CRUD)
├── Issue #6: Store management (CRUD)
├── Issue #7: Employee management (CRUD)
├── Issue #8: Shelf and InventoryItem management
└── Issue #9: Real-time price change notifications

Feature Development (Milestone 3)
├── Issue #10: Real-time low stock notifications
├── Issue #11: Store detail view (Leaflet + 3D)
├── Issue #12: Notifications panel
├── Issue #13: Dark/Light mode + Multilanguage
└── Issue #14: Final testing & deployment

Post-Implementation
├── Update PRD.md with final implementation notes
├── Update architecture.md with deployment guide
├── Creation of README.md with setup instructions
```

### 8.3 Branch Strategy

```
origin/main (protected, only receives merges)
    ↑
    ├─ feature/base-app (merged after completion)
    ├─ feature/product-management (merged)
    ├─ feature/store-management (merged)
    ├─ feature/notifications (merged)
    └─ ... (each feature gets its own branch)

Local branches deleted after merge to main.
```

---

## 9. Error Handling & Edge Cases

### 9.1 Docker Networking

**Issue:** Backend tries to connect to Orion at `localhost:1026` but Orion runs in Docker

**Solution:** Use `host.docker.internal:1026` for all Orion API calls from backend running on host machine

**Configuration:** Environment variable or config file:
```
ORION_HOST=host.docker.internal
ORION_PORT=1026
ORION_URL=http://host.docker.internal:1026
```

### 9.2 Socket.IO Connection Failures

**Issue:** Client fails to connect to Socket.IO server (network issues, server down)

**Solution:** 
- Implement automatic reconnection with exponential backoff
- Show "Disconnected" indicator in UI
- Queue notifications on client when disconnected
- Sync on reconnection

### 9.3 Orion Subscription Callback Timeout

**Issue:** Backend takes too long to process notification, Orion times out

**Solution:**
- Handle notifications asynchronously (queue + worker thread)
- Send immediate ACK to Orion
- Process notification in background

### 9.4 Race Conditions in Stock Updates

**Issue:** Multiple users buy simultaneously, stock count becomes inconsistent

**Solution:**
- Use Orion's atomic operations (`$inc` operator in PATCH request)
- Backend sends: `{"stockCount": {"type": "Integer", "value": {"$inc": -1}}}`
- Orion handles atomicity

### 9.5 Missing External Provider Data

**Issue:** Temperature/humidity provider is down, Orion can't fetch data

**Solution:**
- Display "N/A" or last known value
- Show error indicator
- Implement provider health checks

---

## 10. Deployment Architecture

### Development Environment
```
Docker Compose:
├── Orion (port 1026)
├── MongoDB (port 27017, internal)
├── Context Providers (port 8000)
└── Backend Flask running locally (port 5000)
```

### Production Considerations (Future)
- Containerize Flask app
- Implement load balancing for Socket.IO (need sticky sessions or Redis adapter)
- Set up proper SSL/TLS for production domains
- Configure environment variables via `.env` file

---

## 11. Conversation Logs

**Note:** Agent conversation logs are added at the very end of the project workings, so they do NOT become context for the agent during implementation. This is intentional to avoid inflating context and to maintain focus on code.

