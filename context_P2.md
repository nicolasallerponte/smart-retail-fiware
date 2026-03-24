# Practice 2 – Improved FIWARE Application

## Objective
Improve the Practice 1 application to include NGSIv2 registrations and subscriptions,
server-to-interface notifications, using GitHub Flow workflow.

## Deliverables
ZIP file obtained with `git archive`, including:
- Agent conversations (added at the end only, so the agent doesn't use them as context)
- `README.md` with instructions to run the app and the GitHub repo URL
- `requirements.txt` obtained by running `pip freeze > requirements.txt`

`.gitignore` must exclude `.venv` and `__pycache__` folders.

## GitHub Flow Workflow
Every implementation must follow GitHub Flow:
1. Use **Plan mode** to build the implementation plan for the issue
2. Ask the agent to create the **GitHub issue** with the plan
3. Ask the agent to create a **git branch** for the issue
4. Ask the agent to **commit** and **push** the branch
5. Ask the agent to **merge** to main and **push** to origin/main
   (if not repo owner, create a Pull Request instead)

Always update `PRD.md`, `architecture.md` and `data_model.md` after closing an issue.

## Getting Started
- Create a new folder and copy `docker-compose.yml`, `.env`, `services`
  and `import-data` from the FIWARE NGSIv2 Subscriptions tutorial
- Use Plan mode to build `PRD.md`, `architecture.md` and `data_model.md`
  from this document — the more detailed, the better the first app version
- Ask the agent to create a remote GitHub repo and open the first issue
  with the implementation plan for the base app

## Extended Data Model

### Employee (updated)
Add: `email`, `dateOfContract`, `skills` (MachineryDriving / WritingReports /
CustomerRelationships), `username`, `password`

### Store (updated)
Add: `url`, `telephone`, `countryCode` (2 chars), `capacity` (cubic metres),
`description` (long text), `temperature`, `relativeHumidity`

### Product (updated)
Add: `color` (Text, RGB hex value)

### UML diagram
Create a UML entity diagram using Mermaid and render it on the Home page.

### Initial data script
- 4 stores, 4 shelves per store
- 10 products
- Enough InventoryItems for at least 4 products per shelf
- 4 employees
- Use `import-data` script as a base
- Use freely available images or images generated with an image model

## External Context Providers
- `temperature` and `relativeHumidity` of a Store are provided by the external
  context provider running in the `tutorial` container (Context Providers tutorial)
- `tweets` of a Store are also provided by that same container
- Both providers must be registered in Orion on app startup

## Orion Subscriptions and Server-to-Client Notifications
Subscribe to Orion for:
- **Product price change**
- **Low stock of a Product in a Store**

Since the app listens on localhost but Orion runs in Docker, use
`host.docker.internal` instead of `localhost` when registering subscriptions.

Use **Flask-SocketIO** on the server and **Socket.IO** in the browser to forward
notifications and update the UI in real time.

## UI — HTML + CSS + JS

### General principles
- Prefer CSS over JS whenever possible
- Avoid generating HTML from JS — update existing element attributes instead

### Forms
- Use as many different HTML `<input>` types as possible
- Include appropriate HTML and JS validation rules

## Interface Structure

### List views — Products, Stores, Employees
- Show entities as a table with image, name, delete and edit buttons
- Additional columns per entity:
  - Product: `color`, `size`
  - Store: `countryCode`, `temperature`, `relativeHumidity`
  - Employee: `category`, `skills`
- Add a button at the top to create a new entity

### Product detail view
- Show InventoryItems table grouped by Store:
  - One header row per Store showing `stockCount`
  - Sub-rows for each Shelf showing `shelfCount`
- Each Store group header has an "add" button to add an InventoryItem
  to a Shelf not yet containing this product
  (dynamic `select` loading only eligible Shelves)

### Store detail view
- **Leaflet JS map** showing the store location
- **Three.js 3D virtual tour** showing shelves with their products,
  units per shelf and total stock
- **InventoryItems table grouped by Shelf**:
  - Header row per Shelf with name and fill level progress bar
  - Sub-rows with: image, name, price, size, color, stockCount, shelfCount
- Button to **add a Shelf** to the store
- Per Shelf header: button to **edit** that Shelf
- Per Shelf header: button to **add a Product** not yet on that Shelf
  (dynamic `select` loading only eligible Products)
- Per InventoryItem: **buy one unit** button sending this request to Orion:
```
  PATCH /v2/entities/<inventoryitem_id>/attrs
  {
    "shelfCount": {"type": "Integer", "value": {"$inc": -1}},
    "stockCount":  {"type": "Integer", "value": {"$inc": -1}}
  }
```
- **Temperature and humidity** shown with icons and colors based on values,
  numeric value displayed next to each icon
- **Tweets** section after the inventory table, with an X/Twitter icon
- **Notifications panel** showing incoming real-time notifications
  (e.g. low stock alerts)

### Price change notifications
When a price change notification is received, update the price in
**every view** where it appears.

## Visual Requirements
1. **Employee photo**: CSS zoom transition on hover
2. **Store warehouse photo**: CSS transition that zooms and rotates 360°
   simultaneously
3. **Shelf progress bar**: different colors based on fill level
4. Use **Font Awesome icons** to represent:
   - `color` → colored square
   - `countryCode` → country flag icon
   - `category` → different icon per category
   - `skills` → icons per skill value
5. **Sticky navbar** highlighting the active section (Home / Products /
   Stores / Employees)
6. **Stores Map tab** in the navbar:
   - Store images shown on a Leaflet map
   - Hover shows a card with image and main attributes
   - Click navigates to the Store detail page

## Multilanguage and Dark/Light Mode
- Support English and Spanish
- Include a Dark / Light mode toggle