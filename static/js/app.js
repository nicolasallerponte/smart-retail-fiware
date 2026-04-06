document.addEventListener('DOMContentLoaded', () => {
    // Highlight the active nav link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    const themeToggle = document.getElementById('theme-toggle');
    const langSelector = document.getElementById('lang-selector');

    const TRANSLATIONS = {
        en: {
            nav: { products: "Products", stores: "Stores", employees: "Employees", map: "Stores Map" },
            common: { edit: "Edit", delete: "Delete", save: "Save", cancel: "Cancel", add: "Add", buy_one: "Buy One", na: "N/A" },
            pages: {
                home: { title: "Welcome to Smart Retail FIWARE", desc: "This application is implemented with Flask and FIWARE NGSIv2 for real-time inventory management.", uml: "UML Entity Diagram" },
                products: { title: "Products", add: "Add Product" },
                stores: { title: "Stores", add: "Create New Store" },
                employees: { title: "Employees", add: "Add Employee" },
                store_detail: { title: "Store Detail", inventory: "Inventory", tweets: "Latest Tweets", notifications: "Notifications", add_shelf: "Add New Shelf" },
                product_detail: { title: "Product Detail", add_to_shelf: "Add to existing store shelf:", inventory_by_store: "Inventory by Store / Shelf" },
                stores_map: { title: "Stores Map" }
            },
            table: { image: "Image", name: "Name", price: "Price", size: "Size", color: "Color", actions: "Actions", country: "Country", temp: "Temperature", humidity: "Humidity", photo: "Photo", category: "Category", skills: "Skills", store: "Store", stock: "Stock", shelf: "Shelf", level: "Level" },
            forms: { name: "Name", price: "Price (€)", size: "Size", color: "Color", image_url: "Image URL", telephone: "Telephone", website_url: "Website URL", country_code: "Country Code", capacity: "Capacity", description: "Description", temp_readonly: "Temperature (°C) - Read Only", hum_readonly: "Relative Humidity (%) - Solo lectura", username: "Username", email: "Email", password: "Password", date_contract: "Date of Contract", store: "Store", skills: "Skills", skill_machinery: "Mach. Driving", skill_reports: "Writing Reports", skill_relations: "Cust. Relations", shelf_name: "Shelf Name", level: "Level", image_optional: "Image URL (Optional)" },
            modals: { add_product: "Add Product", edit_product: "Edit Product", add_store: "Add Store", edit_store: "Edit Store", add_employee: "Add Employee", edit_employee: "Edit Employee", add_shelf: "Add Shelf", edit_shelf: "Edit Shelf" },
            messages: {
                confirm_delete_store: "Are you sure you want to delete this store?",
                confirm_delete_product: "Are you sure you want to delete this product?",
                confirm_delete_employee: "Are you sure you want to delete this employee?",
                confirm_delete_shelf: "Are you sure you want to delete this shelf?",
                low_stock_alert: "Low stock alert: Product {prod} in Store {store} has {count} units",
                invalid_shelf_error: "Please provide a valid name and level.",
                no_notifications: "No notifications yet — buy items to trigger low stock alerts."
            },
            storeDescriptions: {
                'Main distribution hub for the Iberian Peninsula, handling bulk storage and last-mile logistics.': 'Main distribution hub for the Iberian Peninsula, handling bulk storage and last-mile logistics.',
                'High-throughput logistics centre serving Northern Europe with automated sorting systems.': 'High-throughput logistics centre serving Northern Europe with automated sorting systems.',
                'State-of-the-art distribution point for Central and Eastern European markets.': 'State-of-the-art distribution point for Central and Eastern European markets.',
                'Mediterranean logistics base with specialised cold-chain capabilities and port access.': 'Mediterranean logistics base with specialised cold-chain capabilities and port access.'
            },
            productNames: {
                'Industrial Motor': 'Industrial Motor',
                'Control Panel': 'Control Panel',
                'Safety Helmet': 'Safety Helmet',
                'Work Gloves': 'Work Gloves',
                'Hydraulic Pump': 'Hydraulic Pump',
                'Pressure Gauge': 'Pressure Gauge',
                'Steel Cable': 'Steel Cable',
                'LED Light Strip': 'LED Light Strip',
                'Battery Pack': 'Battery Pack',
                'Tool Kit': 'Tool Kit'
            },
            sizes: { 'Large': 'Large', 'Medium': 'Medium', 'Small': 'Small', 'One Size': 'One Size' }
        },
        es: {
            nav: { products: "Productos", stores: "Tiendas", employees: "Empleados", map: "Mapa de Tiendas" },
            common: { edit: "Editar", delete: "Eliminar", save: "Guardar", cancel: "Cancelar", add: "Añadir", buy_one: "Comprar uno", na: "N/A" },
            pages: {
                home: { title: "Bienvenido a Smart Retail FIWARE", desc: "Esta aplicación está implementada con Flask y FIWARE NGSIv2 para la gestión de inventario en tiempo real.", uml: "Diagrama de Entidades UML" },
                products: { title: "Productos", add: "Añadir Producto" },
                stores: { title: "Tiendas", add: "Crear Nueva Tienda" },
                employees: { title: "Empleados", add: "Añadir Empleado" },
                store_detail: { title: "Detalle de Tienda", inventory: "Inventario", tweets: "Últimos Tweets", notifications: "Notificaciones", add_shelf: "Añadir Nueva Estantería" },
                product_detail: { title: "Detalle del Producto", add_to_shelf: "Añadir a estantería de tienda existente:", inventory_by_store: "Inventario por Tienda / Estantería" },
                stores_map: { title: "Mapa de Tiendas" }
            },
            table: { image: "Imagen", name: "Nombre", price: "Precio", size: "Talla", color: "Color", actions: "Acciones", country: "País", temp: "Temperatura", humidity: "Humedad", photo: "Foto", category: "Categoría", skills: "Habilidades", store: "Tienda", stock: "Existencias", shelf: "Estantería", level: "Nivel" },
            forms: { name: "Nombre", price: "Precio (€)", size: "Talla", color: "Color", image_url: "URL de Imagen", telephone: "Teléfono", website_url: "URL del Sitio Web", country_code: "Código de País", capacity: "Capacidad", description: "Descripción", temp_readonly: "Temperatura (°C) - Solo lectura", hum_readonly: "Humedad Relativa (%) - Solo lectura", username: "Nombre de usuario", email: "Correo electrónico", password: "Contraseña", date_contract: "Fecha de contrato", store: "Tienda", skills: "Habilidades", skill_machinery: "Conducción Maquinaria", skill_reports: "Redacción de Informes", skill_relations: "Relaciones con Clientes", shelf_name: "Nombre de Estantería", level: "Nivel", image_optional: "URL de Imagen (Opcional)" },
            modals: { add_product: "Añadir Producto", edit_product: "Editar Producto", add_store: "Añadir Tienda", edit_store: "Editar Tienda", add_employee: "Añadir Empleado", edit_employee: "Editar Empleado", add_shelf: "Añadir Estantería", edit_shelf: "Editar Estantería" },
            messages: {
                confirm_delete_store: "¿Estás seguro de que quieres eliminar esta tienda?",
                confirm_delete_product: "¿Estás seguro de que quieres eliminar este producto?",
                confirm_delete_employee: "¿Estás seguro de que quieres eliminar este empleado?",
                confirm_delete_shelf: "¿Estás seguro de que quieres eliminar esta estantería?",
                low_stock_alert: "Alerta de stock bajo: El producto {prod} en la tienda {store} tiene {count} unidades",
                invalid_shelf_error: "Por favor, introduzca un nombre y un nivel válidos.",
                no_notifications: "Sin notificaciones — compra productos para activar alertas de stock bajo."
            },
            storeDescriptions: {
                'Main distribution hub for the Iberian Peninsula, handling bulk storage and last-mile logistics.': 'Principal centro de distribución para la Península Ibérica, con almacenaje masivo y logística de última milla.',
                'High-throughput logistics centre serving Northern Europe with automated sorting systems.': 'Centro logístico de alto rendimiento al servicio del norte de Europa con sistemas de clasificación automatizados.',
                'State-of-the-art distribution point for Central and Eastern European markets.': 'Punto de distribución de última generación para los mercados de Europa Central y del Este.',
                'Mediterranean logistics base with specialised cold-chain capabilities and port access.': 'Base logística mediterránea con capacidades especializadas de cadena de frío y acceso portuario.'
            },
            productNames: {
                'Industrial Motor': 'Motor Industrial',
                'Control Panel': 'Panel de Control',
                'Safety Helmet': 'Casco de Seguridad',
                'Work Gloves': 'Guantes de Trabajo',
                'Hydraulic Pump': 'Bomba Hidráulica',
                'Pressure Gauge': 'Manómetro',
                'Steel Cable': 'Cable de Acero',
                'LED Light Strip': 'Tira de LEDs',
                'Battery Pack': 'Pack de Baterías',
                'Tool Kit': 'Kit de Herramientas'
            },
            sizes: { 'Large': 'Grande', 'Medium': 'Mediano', 'Small': 'Pequeño', 'One Size': 'Talla Única' }
        }
    };

    window.t = function(key, params = {}) {
        const lang = localStorage.getItem('lang') || 'en';
        let translation = key.split('.').reduce((obj, k) => obj && obj[k], TRANSLATIONS[lang]) || key;
        for (const p in params) {
            translation = translation.replace(`{${p}}`, params[p]);
        }
        return translation;
    };

    window.tProduct = function(name) {
        const lang = localStorage.getItem('lang') || 'en';
        return (TRANSLATIONS[lang].productNames && TRANSLATIONS[lang].productNames[name]) || name;
    };

    window.tStoreDesc = function(desc) {
        const lang = localStorage.getItem('lang') || 'en';
        return (TRANSLATIONS[lang].storeDescriptions && TRANSLATIONS[lang].storeDescriptions[desc]) || desc;
    };

    window.tSize = function(size) {
        const lang = localStorage.getItem('lang') || 'en';
        return (TRANSLATIONS[lang].sizes && TRANSLATIONS[lang].sizes[size]) || size;
    };

    // Color is stored in Orion WITHOUT '#' to avoid forbidden-char rejection.
    // Always use these helpers instead of product.color.value directly.
    function colorCss(raw) { return raw ? (raw.startsWith('#') ? raw : '#' + raw) : '#888888'; }
    function colorForOrion(css) { return css.replace('#', ''); }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    function applyTranslations(lang) {
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = window.t(key);
            if (el.tagName === 'INPUT' && (['text','email','password','url','number'].includes(el.type))) {
                el.placeholder = translation;
            } else if (el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    const savedLanguage = localStorage.getItem('lang') || 'en';
    langSelector.value = savedLanguage;
    applyTranslations(savedLanguage);

    themeToggle.addEventListener('change', (e) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    });

    langSelector.addEventListener('change', (e) => {
        applyTranslations(e.target.value);
        // Refresh dynamic content if any
        location.reload(); 
    });

    // Socket.IO connection for real-time notifications
    const socket = io();

    socket.on('price_change', (data) => {
        console.log('Price change:', data);
        // Update all price displays for the product
        updateProductPrice(data.productId, data.newPrice);
    });

    socket.on('low_stock', (data) => {
        console.log('Low stock:', data);
        // Update stock count in store views
        updateInventoryStock(data.inventoryItemId, data.stockCount);
        // Show notification
        showNotification(window.t('messages.low_stock_alert', { prod: data.productId, store: data.storeId, count: data.stockCount }));
    });

    // Page-specific logic
    const pathname = window.location.pathname;
    if (pathname === '/stores') {
        loadStores();
        initStoreModal();
    } else if (pathname.startsWith('/stores/')) {
        const storeId = pathname.split('/')[2];
        loadStoreDetail(storeId);
        initShelfModal();
    } else if (pathname === '/products') {
        loadProducts();
        initProductModal();
    } else if (pathname.startsWith('/products/')) {
        const productId = pathname.split('/')[2];
        loadProductDetail(productId);
    } else if (pathname === '/employees') {
        loadEmployees();
        initEmployeeModal();
    }

    async function loadStores() {
        try {
            const response = await fetch('/api/stores');
            const stores = await response.json();
            const tbody = document.getElementById('stores-tbody');
            tbody.innerHTML = '';
            stores.forEach(store => {
                const row = document.createElement('tr');
                const storeKey = store.id.split(':')[3] || store.id;
                row.innerHTML = `
                    <td><img src="${store.image.value}" alt="${store.name.value}" width="50"></td>
                    <td><a href="/stores/${storeKey}">${store.name.value}</a></td>
                    <td><span class="fi fi-${store.countryCode.value.toLowerCase()}"></span> ${store.countryCode.value}</td>
                    <td class="temp">${store.temperature ? store.temperature.value + '°C' : window.t('common.na')}</td>
                    <td class="humidity">${store.relativeHumidity ? store.relativeHumidity.value + '%' : window.t('common.na')}</td>
                    <td>
                        <button class="btn-edit" onclick="editStore('${store.id}')"><i class="fas fa-pen"></i> ${window.t('common.edit')}</button>
                        <button class="btn-delete" onclick="deleteStore('${store.id}')"><i class="fas fa-trash"></i> ${window.t('common.delete')}</button>
                    </td>
                `;
                tbody.appendChild(row);
                // Color temp/humidity
                const tempEl = row.querySelector('.temp');
                const humEl = row.querySelector('.humidity');
                if (store.temperature) {
                    const temp = store.temperature.value;
                    if (temp < 15) tempEl.style.color = 'blue';
                    else if (temp <= 25) tempEl.style.color = 'green';
                    else tempEl.style.color = 'red';
                }
                if (store.relativeHumidity) {
                    const hum = store.relativeHumidity.value;
                    if (hum < 40) humEl.style.color = 'blue';
                    else if (hum <= 60) humEl.style.color = 'green';
                    else humEl.style.color = 'red';
                }
            });
        } catch (err) {
            console.error('Error loading stores:', err);
        }
    }

    function initStoreModal() {
        const modal      = document.getElementById('store-modal');
        const form       = document.getElementById('store-form');
        const titleEl    = document.getElementById('store-modal-title');
        const idInput    = document.getElementById('store-form-id');
        const nameInput  = document.getElementById('store-form-name');
        const telInput   = document.getElementById('store-form-telephone');
        const urlInput   = document.getElementById('store-form-url');
        const imgInput   = document.getElementById('store-form-image');
        const countrySel = document.getElementById('store-form-countryCode');
        const capInput   = document.getElementById('store-form-capacity');
        const descText   = document.getElementById('store-form-description');
        const tempInput  = document.getElementById('store-form-temperature');
        const humInput   = document.getElementById('store-form-humidity');
        const errorEl    = document.getElementById('store-form-error');
        const createBtn  = document.getElementById('create-store-btn');
        const cancelBtn  = document.getElementById('store-form-cancel');

        if (!modal || !createBtn) return;

        function openModal()  { modal.removeAttribute('hidden'); }
        function closeModal() { modal.setAttribute('hidden', ''); errorEl.textContent = ''; }

        createBtn.addEventListener('click', function () {
            titleEl.textContent  = window.t('modals.add_store');
            idInput.value        = '';
            nameInput.value      = '';
            telInput.value       = '';
            urlInput.value       = '';
            imgInput.value       = '';
            countrySel.value     = 'ES';
            capInput.value       = '0';
            descText.value       = '';
            tempInput.value      = '';
            humInput.value       = '';
            openModal();
        });

        cancelBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        window.editStore = function (storeId) {
            fetch('/api/stores/' + encodeURIComponent(storeId))
                .then(r => r.json())
                .then(store => {
                    titleEl.textContent = window.t('modals.edit_store');
                    idInput.value       = store.id;
                    nameInput.value     = store.name ? store.name.value : '';
                    telInput.value      = store.telephone ? store.telephone.value : '';
                    urlInput.value      = store.url ? store.url.value : '';
                    imgInput.value      = store.image ? store.image.value : '';
                    countrySel.value    = store.countryCode ? store.countryCode.value : 'ES';
                    capInput.value      = store.capacity ? store.capacity.value : '0';
                    descText.value      = store.description ? store.description.value : '';
                    tempInput.value     = store.temperature ? store.temperature.value : '';
                    humInput.value      = store.relativeHumidity ? store.relativeHumidity.value : '';
                    openModal();
                })
                .catch(err => { console.error('Error fetching store for edit:', err); });
        };

        window.deleteStore = function (storeId) {
            if (!confirm(window.t('messages.confirm_delete_store'))) return;
            fetch('/api/stores/' + encodeURIComponent(storeId), { method: 'DELETE' })
                .then(r => {
                    if (!r.ok) throw new Error('Delete failed');
                    loadStores();
                })
                .catch(err => { console.error('Error deleting store:', err); });
        };

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            errorEl.textContent = '';

            const name     = nameInput.value.trim();
            const tel      = telInput.value.trim();
            const urlVal   = urlInput.value.trim();
            const imgVal   = imgInput.value.trim();
            const country  = countrySel.value;
            const capacity = parseInt(capInput.value, 10);
            const desc     = descText.value.trim();

            if (!name || !tel || !urlVal || !imgVal || isNaN(capacity) || !desc) {
                errorEl.textContent = 'Please fill all required fields correctly.';
                return;
            }
            if (country.length !== 2) {
                errorEl.textContent = 'Country Code must be 2 characters.';
                return;
            }

            const storeId = idInput.value;
            const isEdit  = Boolean(storeId);

            const body = isEdit ? {
                name:        { type: 'String', value: name },
                telephone:   { type: 'String', value: tel },
                url:         { type: 'String', value: urlVal },
                image:       { type: 'String', value: imgVal },
                countryCode: { type: 'String', value: country },
                capacity:    { type: 'Number', value: capacity },
                description: { type: 'String', value: desc }
            } : {
                name, telephone: tel, url: urlVal, image: imgVal,
                countryCode: country, capacity, description: desc
            };

            const apiUrl = isEdit ? '/api/stores/' + encodeURIComponent(storeId) : '/api/stores';
            const method = isEdit ? 'PATCH' : 'POST';

            fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(r => {
                if (!r.ok) return r.text().then(t => { throw new Error(t); });
                closeModal();
                loadStores();
            })
            .catch(err => {
                errorEl.textContent = 'Error saving store: ' + err.message;
            });
        });
    }

    async function loadProducts() {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            const tbody = document.getElementById('products-tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            products.forEach(product => {
                const row = document.createElement('tr');
                const productKey = product.id.split(':')[3] || product.id;
                row.innerHTML = `
                    <td><img src="${product.image.value}" width="50" alt="${window.tProduct(product.name.value)}" /></td>
                    <td><a href="/products/${productKey}">${window.tProduct(product.name.value)}</a></td>
                    <td>€${product.price.value}</td>
                    <td>${window.tSize(product.size.value)}</td>
                    <td><span class="color-box" style="background:${colorCss(product.color.value)}; width: 16px; height: 16px; display:inline-block; border: 1px solid #000;"></span></td>
                    <td>
                        <button class="btn-edit" onclick="editProduct('${product.id}')"><i class="fas fa-pen"></i> ${window.t('common.edit')}</button>
                        <button class="btn-delete" onclick="deleteProduct('${product.id}')"><i class="fas fa-trash"></i> ${window.t('common.delete')}</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (err) {
            console.error('Error loading products:', err);
        }
    }

    function initProductModal() {
        const modal      = document.getElementById('product-modal');
        const form       = document.getElementById('product-form');
        const titleEl    = document.getElementById('modal-title');
        const idInput    = document.getElementById('product-form-id');
        const nameInput  = document.getElementById('product-form-name');
        const priceInput = document.getElementById('product-form-price');
        const sizeSelect = document.getElementById('product-form-size');
        const colorInput = document.getElementById('product-form-color');
        const imageInput = document.getElementById('product-form-image');
        const errorEl    = document.getElementById('product-form-error');
        const addBtn     = document.getElementById('add-product-btn');
        const cancelBtn  = document.getElementById('product-form-cancel');

        // Guard: elements may not exist on other pages
        if (!modal || !addBtn) return;

        function openModal()  { modal.removeAttribute('hidden'); }
        function closeModal() { modal.setAttribute('hidden', ''); errorEl.textContent = ''; }

        // Open modal in create mode
        addBtn.addEventListener('click', function () {
            titleEl.textContent  = window.t('modals.add_product');
            idInput.value        = '';
            nameInput.value      = '';
            priceInput.value     = '';
            sizeSelect.value     = 'Medium';
            colorInput.value     = '#000000';
            imageInput.value     = '';
            openModal();
        });

        cancelBtn.addEventListener('click', closeModal);

        // Close on backdrop click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        // Expose to window so dynamically generated Edit buttons can call it
        window.editProduct = function (productId) {
            fetch('/api/products/' + encodeURIComponent(productId))
                .then(function (r) { return r.json(); })
                .then(function (product) {
                    titleEl.textContent  = 'Edit Product';
                    idInput.value        = product.id;
                    nameInput.value      = product.name  ? product.name.value  : '';
                    priceInput.value     = product.price ? product.price.value : '';
                    sizeSelect.value     = product.size  ? product.size.value  : 'Medium';
                    colorInput.value     = product.color ? colorCss(product.color.value) : '#000000';
                    imageInput.value     = product.image ? product.image.value : '';
                    openModal();
                })
                .catch(function (err) { console.error('Error fetching product for edit:', err); });
        };

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            errorEl.textContent = '';

            // JS validation
            const name  = nameInput.value.trim();
            const price = parseFloat(priceInput.value);
            const color = colorInput.value;
            const image = imageInput.value.trim();

            if (!name) {
                errorEl.textContent = 'Name is required.';
                return;
            }
            if (isNaN(price) || price < 0) {
                errorEl.textContent = 'Price must be a positive number.';
                return;
            }
            if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
                errorEl.textContent = 'Color must be a valid hex code (#RRGGBB).';
                return;
            }
            if (!image) {
                errorEl.textContent = 'Image URL is required.';
                return;
            }

            const productId = idInput.value;
            const isEdit    = Boolean(productId);
            const colorOrion = colorForOrion(color); // strip '#' before sending to Orion

            // PATCH sends NGSI-formatted attrs; POST sends plain values (model class builds NGSI)
            const body = isEdit
                ? {
                    name:  { type: 'String', value: name },
                    price: { type: 'Number', value: price },
                    size:  { type: 'String', value: sizeSelect.value },
                    color: { type: 'String', value: colorOrion },
                    image: { type: 'String', value: image }
                  }
                : { name, price, size: sizeSelect.value, color: colorOrion, image };

            const url    = isEdit
                ? '/api/products/' + encodeURIComponent(productId)
                : '/api/products';
            const method = isEdit ? 'PATCH' : 'POST';

            fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
                .then(function (r) {
                    if (!r.ok) return r.text().then(function (t) { throw new Error(t); });
                    closeModal();
                    loadProducts();
                })
                .catch(function (err) {
                    errorEl.textContent = 'Error saving product: ' + err.message;
                });
        });
    }

    async function loadEmployees() {
        try {
            const employees = await fetch('/api/employees').then(r => r.json());
            const stores = await fetch('/api/stores').then(r => r.json());
            const storeMap = {};
            stores.forEach(s => { storeMap[s.id] = s.name.value; });

            const tbody = document.getElementById('employees-tbody');
            if (!tbody) return;
            tbody.innerHTML = '';

            const categoryIcon = (cat) => {
                if (!cat) return 'fas fa-user';
                if (cat.toLowerCase().includes('manager')) return 'fas fa-user-tie';
                if (cat.toLowerCase().includes('supervisor')) return 'fas fa-user-shield';
                if (cat.toLowerCase().includes('operator')) return 'fas fa-hard-hat';
                return 'fas fa-user';
            };

            const skillIcon = (skill) => {
                if (!skill) return 'fas fa-star';
                if (skill.toLowerCase().includes('machinery')) return 'fas fa-cogs';
                if (skill.toLowerCase().includes('writing')) return 'fas fa-file-alt';
                if (skill.toLowerCase().includes('customer')) return 'fas fa-handshake';
                return 'fas fa-star';
            };

            employees.forEach(emp => {
                const row = document.createElement('tr');
                const name = emp.name ? emp.name.value : 'Unknown';
                const category = emp.category ? emp.category.value : 'Unknown';
                const skills = (emp.skills && Array.isArray(emp.skills.value)) ? emp.skills.value : [];
                const photo = emp.image && emp.image.value ? emp.image.value : 'https://via.placeholder.com/50';
                const storeName = emp.refStore && emp.refStore.value ? (storeMap[emp.refStore.value] || emp.refStore.value) : 'N/A';
                const skillHtml = skills.map(s => `<i class="${skillIcon(s)}" title="${s}" style="margin-right:4px"></i>`).join('');

                row.innerHTML = `
                    <td><img class="employee-img" src="${photo}" alt="${name}" width="50" height="50"></td>
                    <td>${name}</td>
                    <td><i class="${categoryIcon(category)}"></i> ${emp.category ? emp.category.value : window.t('common.na')}</td>
                    <td>${emp.skills ? emp.skills.value.join(', ') : window.t('common.na')}</td>
                    <td>${storeName}</td>
                    <td>
                        <button class="btn-edit" onclick="editEmployee('${emp.id}')"><i class="fas fa-pen"></i> ${window.t('common.edit')}</button>
                        <button class="btn-delete" onclick="deleteEmployee('${emp.id}')"><i class="fas fa-trash"></i> ${window.t('common.delete')}</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (err) {
            console.error('Error loading employees:', err);
        }
    }

    function initEmployeeModal() {
        const modal        = document.getElementById('employee-modal');
        const form         = document.getElementById('employee-form');
        const titleEl      = document.getElementById('employee-modal-title');
        const idInput      = document.getElementById('employee-form-id');
        const nameInput    = document.getElementById('employee-form-name');
        const userInput    = document.getElementById('employee-form-username');
        const emailInput   = document.getElementById('employee-form-email');
        const passInput    = document.getElementById('employee-form-password');
        const dateInput    = document.getElementById('employee-form-dateOfContract');
        const catSelect    = document.getElementById('employee-form-category');
        const storeSelect  = document.getElementById('employee-form-refStore');
        const imgInput     = document.getElementById('employee-form-image');
        const errorEl      = document.getElementById('employee-form-error');
        const addBtn       = document.getElementById('add-employee-btn');
        const cancelBtn    = document.getElementById('employee-form-cancel');

        if (!modal || !addBtn) return;

        function openModal()  { modal.removeAttribute('hidden'); }
        function closeModal() { modal.setAttribute('hidden', ''); errorEl.textContent = ''; }

        async function populateStores(selectedId = '') {
            try {
                const stores = await fetch('/api/stores').then(r => r.json());
                storeSelect.innerHTML = `<option value="">${window.t('forms.select_store')}</option>`;
                stores.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.id;
                    opt.textContent = s.name.value;
                    if (s.id === selectedId) opt.selected = true;
                    storeSelect.appendChild(opt);
                });
            } catch (err) { console.error('Error fetching stores for modal:', err); }
        }

        addBtn.addEventListener('click', async function () {
            titleEl.textContent = window.t('modals.add_employee');
            form.reset();
            idInput.value = '';
            await populateStores();
            openModal();
        });

        cancelBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        window.editEmployee = async function (empId) {
            try {
                const emp = await fetch('/api/employees/' + encodeURIComponent(empId)).then(r => r.json());
                titleEl.textContent = window.t('modals.edit_employee');
                idInput.value       = emp.id;
                nameInput.value     = emp.name ? emp.name.value : '';
                userInput.value     = emp.username ? emp.username.value : '';
                emailInput.value    = emp.email ? emp.email.value : '';
                passInput.value     = emp.password ? emp.password.value : ''; // Note: usually shouldn't inhabit form
                dateInput.value     = emp.dateOfContract ? emp.dateOfContract.value : '';
                catSelect.value     = emp.category ? emp.category.value : 'Operator';
                imgInput.value      = emp.image ? emp.image.value : '';

                // Skills checkboxes
                const currentSkills = (emp.skills && Array.isArray(emp.skills.value)) ? emp.skills.value : [];
                document.querySelectorAll('input[name="skills"]').forEach(cb => {
                    cb.checked = currentSkills.includes(cb.value);
                });

                await populateStores(emp.refStore ? emp.refStore.value : '');
                openModal();
            } catch (err) { console.error('Error fetching employee for edit:', err); }
        };

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            errorEl.textContent = '';

            const name     = nameInput.value.trim();
            const username = userInput.value.trim();
            const email    = emailInput.value.trim();
            const pass     = passInput.value.trim();
            const date     = dateInput.value;
            const cat      = catSelect.value;
            const store    = storeSelect.value;
            const img      = imgInput.value.trim();
            
            const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value);

            // Validation
            if (!name || !username || !email || !pass || !date || !cat || !store || !img) {
                errorEl.textContent = 'Please fill all required fields.';
                return;
            }
            if (skills.length === 0) {
                errorEl.textContent = 'Please select at least one skill.';
                return;
            }

            const empId = idInput.value;
            const isEdit = Boolean(empId);

            const body = isEdit ? {
                name:           { type: 'String', value: name },
                username:       { type: 'String', value: username },
                email:          { type: 'String', value: email },
                password:       { type: 'String', value: pass },
                dateOfContract: { type: 'String', value: date },
                category:       { type: 'String', value: cat },
                refStore:       { type: 'Relationship', value: store },
                skills:         { type: 'Array', value: skills },
                image:          { type: 'String', value: img }
            } : {
                name, username, email, password: pass, dateOfContract: date,
                category: cat, refStore: store, skills, image: img
            };

            const apiUrl = isEdit ? '/api/employees/' + encodeURIComponent(empId) : '/api/employees';
            const method = isEdit ? 'PATCH' : 'POST';

            fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(r => {
                if (!r.ok) return r.text().then(t => { throw new Error(t); });
                closeModal();
                loadEmployees();
            })
            .catch(err => {
                errorEl.textContent = 'Error saving employee: ' + err.message;
            });
        });
    }

    async function deleteProduct(productId) {
        try {
            const entityId = productId.startsWith('urn:ngsi-ld:') ? productId : `urn:ngsi-ld:Product:${productId}`;
            await fetch(`/api/products/${encodeURIComponent(entityId)}`, { method: 'DELETE' });
            loadProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    }
    window.deleteProduct = deleteProduct;

    async function deleteEmployee(employeeId) {
        try {
            const entityId = employeeId.startsWith('urn:ngsi-ld:') ? employeeId : `urn:ngsi-ld:Employee:${employeeId}`;
            await fetch(`/api/employees/${encodeURIComponent(entityId)}`, { method: 'DELETE' });
            loadEmployees();
        } catch (err) {
            console.error('Error deleting employee:', err);
        }
    }
    window.deleteEmployee = deleteEmployee;

    async function loadProductDetail(productId) {
        try {
            const product = await fetch(`/api/products/${encodeURIComponent(productId)}`).then(r => r.json());
            document.getElementById('product-image').src = product.image.value;
            document.getElementById('product-name').textContent = window.tProduct(product.name.value);
            document.getElementById('product-size').textContent = `${window.t('table.size')}: ${window.tSize(product.size.value)}`;
            document.getElementById('product-price').textContent = `${window.t('table.price')}: €${product.price.value}`;
            document.getElementById('product-color').innerHTML = `<span class="color-box" style="background:${colorCss(product.color.value)}; width: 20px; height: 20px; display:inline-block; border:1px solid #000;"></span> ${colorCss(product.color.value)}`;

            const inventory = await fetch(`/api/inventoryitems?productId=${encodeURIComponent(`urn:ngsi-ld:Product:${productId}`)}`).then(r => r.json());
            const storeIds = [...new Set(inventory.map(item => item.storeId.value))];
            const storeDetails = {};
            await Promise.all(storeIds.map(async storeId => {
                try {
                    const store = await fetch(`/api/stores/${encodeURIComponent(storeId)}`).then(r => r.json());
                    storeDetails[storeId] = store;
                } catch (e) {
                    storeDetails[storeId] = {name: {value: storeId}};
                }
            }));

            const storeShelves = {};
            await Promise.all(storeIds.map(async storeId => {
                try {
                    const shelves = await fetch(`/api/shelves?storeId=${encodeURIComponent(storeId)}`).then(r => r.json());
                    storeShelves[storeId] = shelves;
                } catch (e) {
                    storeShelves[storeId] = [];
                }
            }));

            const grouped = {};
            inventory.forEach(item => {
                const storeId = item.storeId.value;
                const shelfId = item.shelfId.value;
                if (!grouped[storeId]) grouped[storeId] = {totalStock: 0, shelves: {}};
                grouped[storeId].totalStock += item.stockCount.value;
                grouped[storeId].shelves[shelfId] = {
                    shelfCount: item.shelfCount.value,
                    stockCount: item.stockCount.value,
                    item
                };
            });

            const wrapper = document.getElementById('inventory-by-store');
            wrapper.innerHTML = '';
            Object.keys(grouped).forEach(storeId => {
                const storeName = storeDetails[storeId] ? storeDetails[storeId].name.value : storeId;
                const block = document.createElement('div');
                block.className = 'store-inventory-block';
                block.innerHTML = `<h4>${storeName} (Total stock: ${grouped[storeId].totalStock})</h4>`;

                const table = document.createElement('table');
                table.className = 'inventory-group-table';
                const thead = document.createElement('thead');
                thead.innerHTML = '<tr><th>Shelf</th><th>Stock Count</th><th>Shelf Count</th></tr>';
                table.appendChild(thead);
                const tb = document.createElement('tbody');
                Object.keys(grouped[storeId].shelves).forEach(shelfId => {
                    const shelfData = grouped[storeId].shelves[shelfId];
                    const shelfInfo = storeShelves[storeId] ? storeShelves[storeId].find(s => s.id === shelfId) : null;
                    const shelfLabel = shelfInfo && shelfInfo.name && shelfInfo.name.value ? shelfInfo.name.value : (shelfId.split(':')[3] || shelfId);
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${shelfLabel}</td><td>${shelfData.stockCount}</td><td>${shelfData.shelfCount}</td>`;
                    tb.appendChild(row);
                });
                table.appendChild(tb);
                block.appendChild(table);
                wrapper.appendChild(block);
            });

            const shelfSelect = document.getElementById('shelf-select');
            const addBtn = document.getElementById('add-product-to-shelf');
            const stockInput = document.getElementById('add-stock-count');
            shelfSelect.innerHTML = '';

            const existingShelfIds = new Set(inventory.map(item => item.shelfId.value));
            let totalOptions = 0;
            for (const storeId of storeIds) {
                const shelves = await fetch(`/api/shelves?storeId=${encodeURIComponent(storeId)}`).then(r => r.json());
                shelves.forEach(shelf => {
                    if (!existingShelfIds.has(shelf.id)) {
                        const opt = document.createElement('option');
                        opt.value = shelf.id;
                        opt.textContent = `${storeDetails[storeId]?.name?.value || storeId} > ${shelf.name.value}`;
                        shelfSelect.appendChild(opt);
                        totalOptions++;
                    }
                });
            }

            if (totalOptions === 0) {
                shelfSelect.appendChild(new Option('No eligible shelves available', ''));
                shelfSelect.disabled = true;
                addBtn.disabled = true;
            } else {
                shelfSelect.disabled = false;
                addBtn.disabled = false;
            }

            addBtn.onclick = async () => {
                const selectedShelf = shelfSelect.value;
                if (!selectedShelf) return;
                const shelf = await fetch(`/api/shelves/${encodeURIComponent(selectedShelf)}`).then(r => r.json());
                const stockCount = Number(stockInput.value) || 0;
                await fetch('/api/inventoryitems', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        productId: `urn:ngsi-ld:Product:${productId}`,
                        shelfId: selectedShelf,
                        storeId: shelf.storeId.value,
                        stockCount: stockCount,
                        shelfCount: stockCount
                    })
                });
                loadProductDetail(productId);
            };

        } catch (err) {
            console.error('Error loading product detail:', err);
        }
    }

    // Placeholder functions for edit/delete
    function editStore(id) { alert('Edit not implemented'); }
    function deleteStore(id) { alert('Delete not implemented'); }

    async function loadStoreDetail(storeId) {
        try {
            const entityId = `urn:ngsi-ld:Store:${storeId}`;
            const storeRes = await fetch(`/api/stores/${encodeURIComponent(entityId)}`);
            const store = await storeRes.json();
            document.getElementById('store-image').src = store.image.value;
            const countryCode = store.countryCode ? store.countryCode.value.toLowerCase() : '';
            document.getElementById('store-name').innerHTML = `${store.name.value} <span class="fi fi-${countryCode}"></span>`;
            document.getElementById('store-description').textContent = window.tStoreDesc(store.description.value);
            if (store.temperature) {
                document.getElementById('temperature').innerHTML = `<i class="fas fa-thermometer-half"></i> ${store.temperature.value}°C`;
                document.getElementById('temperature').style.color = store.temperature.value < 15 ? 'blue' : store.temperature.value <= 25 ? 'green' : 'red';
            }
            if (store.relativeHumidity) {
                document.getElementById('humidity').innerHTML = `<i class="fas fa-tint"></i> ${store.relativeHumidity.value}%`;
                document.getElementById('humidity').style.color = store.relativeHumidity.value < 40 ? 'blue' : store.relativeHumidity.value <= 60 ? 'green' : 'red';
            }
            if (store.tweets) {
                document.getElementById('tweets-content').innerHTML = store.tweets.value.map(tweet => `<p>${tweet}</p>`).join('');
            }
            initMap(store.address ? store.address.value : '', store.countryCode ? store.countryCode.value.toUpperCase() : '');
            try { init3D(storeId); } catch(e) { console.warn('3D init failed', e); }
            loadInventory(storeId);
            // Add shelf button
            document.getElementById('add-shelf-btn').onclick = () => {
                document.getElementById('shelf-modal-title').textContent = window.t('modals.add_shelf');
                document.getElementById('shelf-form-id').value = '';
                document.getElementById('shelf-form-storeId').value = `urn:ngsi-ld:Store:${storeId}`;
                document.getElementById('shelf-form-name').value = '';
                document.getElementById('shelf-form-level').value = '0';
                document.getElementById('shelf-form-image').value = '';
                document.getElementById('shelf-modal').removeAttribute('hidden');
            };
        } catch (err) {
            console.error('Error loading store detail:', err);
        }
    }

    const COUNTRY_FALLBACK = {
        ES: [40.4168, -3.7038],
        FR: [48.8566,  2.3522],
        DE: [52.5200, 13.4050],
        IT: [45.4642,  9.1900],
        GB: [51.5074, -0.1278],
        PT: [38.7169, -9.1395],
        NL: [52.3676,  4.9041],
        BE: [50.8503,  4.3517],
    };

    async function initMap(address, countryCode) {
        let lat = null, lng = null;
        if (address) {
            try {
                const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
                    { headers: { 'Accept-Language': 'en', 'User-Agent': 'SmartRetailFIWARE/1.0' } }
                );
                const geo = await geoRes.json();
                if (geo.length > 0) {
                    lat = parseFloat(geo[0].lat);
                    lng = parseFloat(geo[0].lon);
                }
            } catch (err) {
                console.warn('Geocoding error:', err);
            }
        }
        if (lat === null) {
            const fallback = (countryCode && COUNTRY_FALLBACK[countryCode]) || [40.4168, -3.7038];
            [lat, lng] = fallback;
            console.warn(`Geocoding failed for "${address}", using country fallback for ${countryCode}`);
        }
        const map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup(address).openPopup();
    }

    function init3D(storeId) {
        const container = document.getElementById('3d-tour');
        if (!container) return;
        container.innerHTML = '';

        const W = container.clientWidth || 560;
        const H = 380;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d1117);
        scene.fog = new THREE.FogExp2(0x0d1117, 0.045);

        const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Lighting
        scene.add(new THREE.AmbientLight(0x8899aa, 0.7));
        const sun = new THREE.DirectionalLight(0xffffff, 0.9);
        sun.position.set(8, 12, 6);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;
        scene.add(sun);
        const fill = new THREE.PointLight(0x2d7d46, 1.2, 30);
        fill.position.set(-6, 6, 0);
        scene.add(fill);
        const accent = new THREE.PointLight(0xd97706, 0.8, 25);
        accent.position.set(6, 4, 6);
        scene.add(accent);

        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(40, 40),
            new THREE.MeshLambertMaterial({ color: 0x111a0e })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        const grid = new THREE.GridHelper(40, 40, 0x1a3a1a, 0x152015);
        grid.material.transparent = true;
        grid.material.opacity = 0.6;
        scene.add(grid);

        const interactables = [];

        // Materials
        const metalMat  = new THREE.MeshPhongMaterial({ color: 0x607060, shininess: 60, specular: 0x223322 });
        const shelfMat  = new THREE.MeshPhongMaterial({ color: 0x3a4a3a, shininess: 30 });
        const postGeo   = new THREE.BoxGeometry(0.06, 3.6, 0.06);
        const boardGeo  = new THREE.BoxGeometry(1.6, 0.05, 0.7);

        function buildShelfUnit(x, z, shelfId, shelfName) {
            const group = new THREE.Group();
            group.position.set(x, 0, z);

            // Four vertical posts
            [[-0.75, -0.32], [-0.75, 0.32], [0.75, -0.32], [0.75, 0.32]].forEach(([px, pz]) => {
                const post = new THREE.Mesh(postGeo, metalMat);
                post.position.set(px, 1.8, pz);
                post.castShadow = true;
                group.add(post);
            });

            // Three shelf boards
            [0.3, 1.3, 2.3].forEach(y => {
                const board = new THREE.Mesh(boardGeo, shelfMat);
                board.position.set(0, y, 0);
                board.receiveShadow = true;
                board.castShadow = true;
                board.userData = { type: 'shelf', id: shelfId };
                group.add(board);
                interactables.push(board);
            });

            // Label backing strip
            const labelGeo = new THREE.BoxGeometry(1.6, 0.25, 0.04);
            const labelMat = new THREE.MeshPhongMaterial({ color: 0x2d7d46 });
            const label = new THREE.Mesh(labelGeo, labelMat);
            label.position.set(0, 3.2, -0.33);
            group.add(label);

            scene.add(group);
            return group;
        }

        fetch(`/api/shelves?storeId=urn:ngsi-ld:Store:${storeId}`)
            .then(r => r.json())
            .then(async shelves => {
                const cols = Math.min(shelves.length, 4);
                const SPACEX = 4.5, SPACEZ = 3.5;
                const offX = -((cols - 1) * SPACEX) / 2;

                for (let i = 0; i < shelves.length; i++) {
                    const shelf = shelves[i];
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    const sx = offX + col * SPACEX;
                    const sz = row * SPACEZ - 2;

                    buildShelfUnit(sx, sz, shelf.id, shelf.name ? shelf.name.value : shelf.id);

                    try {
                        const items = await fetch(`/api/inventoryitems?shelfId=${encodeURIComponent(shelf.id)}`).then(r => r.json());
                        const N_COLS = 3;
                        for (let j = 0; j < Math.min(items.length, 9); j++) {
                            const item = items[j];
                            const boardIdx = Math.floor(j / N_COLS);
                            const colIdx   = j % N_COLS;
                            const boardY = [0.3, 1.3, 2.3][boardIdx % 3];
                            const bx = sx + (colIdx * 0.5 - 0.5);

                            try {
                                const product = await fetch(`/api/products/${encodeURIComponent(item.productId.value)}`).then(r => r.json());
                                const hexColor = parseInt(colorForOrion(product.color ? product.color.value : '888888'), 16);
                                const stockH = 0.18 + Math.min(item.stockCount.value / 200, 1) * 0.22;
                                const boxMat = new THREE.MeshPhongMaterial({ color: hexColor, shininess: 80, specular: 0x333333 });
                                const box = new THREE.Mesh(new THREE.BoxGeometry(0.35, stockH, 0.35), boxMat);
                                box.position.set(bx, boardY + stockH / 2 + 0.03, sz);
                                box.castShadow = true;
                                box.userData = {
                                    type: 'product',
                                    name: window.tProduct ? window.tProduct(product.name.value) : product.name.value,
                                    stock: item.stockCount.value,
                                    shelfId: shelf.id
                                };
                                scene.add(box);
                                interactables.push(box);
                            } catch (e) {}
                        }
                    } catch (e) {}
                }
            });

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.style.cssText = 'position:fixed;background:rgba(13,17,23,.92);color:#e2f5e8;padding:7px 12px;border-radius:6px;font-size:12px;line-height:1.5;pointer-events:none;display:none;z-index:10000;border:1px solid #2d7d46;';
        document.body.appendChild(tooltip);

        // Orbit controls (manual)
        let theta = 0.4, phi = 0.45, radius = 18;
        let isDragging = false, autoRotate = true;
        let prevX = 0, prevY = 0;
        const target = new THREE.Vector3(0, 1.5, 0);

        renderer.domElement.addEventListener('mousedown', e => { isDragging = true; autoRotate = false; prevX = e.clientX; prevY = e.clientY; });
        window.addEventListener('mouseup', () => { isDragging = false; });
        renderer.domElement.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
        renderer.domElement.addEventListener('wheel', e => {
            radius = Math.max(6, Math.min(30, radius + e.deltaY * 0.03));
            e.preventDefault();
        }, { passive: false });

        const raycaster = new THREE.Raycaster();
        renderer.domElement.addEventListener('mousemove', e => {
            if (isDragging) {
                theta -= (e.clientX - prevX) * 0.006;
                phi = Math.max(0.1, Math.min(1.4, phi - (e.clientY - prevY) * 0.006));
                prevX = e.clientX; prevY = e.clientY;
            } else {
                const rect = renderer.domElement.getBoundingClientRect();
                const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
                const hits = raycaster.intersectObjects(interactables);
                if (hits.length > 0 && hits[0].object.userData.type === 'product') {
                    const ud = hits[0].object.userData;
                    tooltip.innerHTML = `<strong>${ud.name}</strong><br>Stock: ${ud.stock} units`;
                    tooltip.style.left = (e.clientX + 14) + 'px';
                    tooltip.style.top  = (e.clientY - 10) + 'px';
                    tooltip.style.display = 'block';
                    renderer.domElement.style.cursor = 'pointer';
                } else {
                    tooltip.style.display = 'none';
                    renderer.domElement.style.cursor = 'grab';
                }
            }
        });

        renderer.domElement.addEventListener('click', e => {
            const rect = renderer.domElement.getBoundingClientRect();
            const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(new THREE.Vector2(mx, my), camera);
            const hits = raycaster.intersectObjects(interactables);
            if (hits.length > 0) {
                const ud = hits[0].object.userData;
                if (ud.shelfId) {
                    const el = document.getElementById('shelf-section-' + ud.shelfId);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        renderer.domElement.style.cursor = 'grab';
        renderer.domElement.style.borderRadius = '8px';

        function animate() {
            requestAnimationFrame(animate);
            if (autoRotate) theta += 0.004;
            camera.position.set(
                target.x + radius * Math.sin(theta) * Math.cos(phi),
                target.y + radius * Math.sin(phi),
                target.z + radius * Math.cos(theta) * Math.cos(phi)
            );
            camera.lookAt(target);
            renderer.render(scene, camera);
        }
        animate();
    }

    async function loadInventory(storeId) {
        try {
            const invRes = await fetch(`/api/inventoryitems?storeId=urn:ngsi-ld:Store:${storeId}`);
            const items = await invRes.json();
            const byShelf = {};
            items.forEach(item => {
                const shelfId = item.shelfId.value;
                if (!byShelf[shelfId]) byShelf[shelfId] = [];
                byShelf[shelfId].push(item);
            });
            const content = document.getElementById('inventory-content');
            content.innerHTML = '';
            for (const shelfId in byShelf) {
                const shelfItems = byShelf[shelfId];
                const shelfRes = await fetch(`/api/shelves/${encodeURIComponent(shelfId)}`);
                const shelf = await shelfRes.json();
                const totalShelfCount = shelfItems.reduce((sum, item) => sum + item.shelfCount.value, 0);
                const maxCapacity = 100;
                const fillPercent = Math.min((totalShelfCount / maxCapacity) * 100, 100);
                const color = fillPercent < 25 ? 'red' : fillPercent <= 75 ? 'yellow' : 'green';
                const div = document.createElement('div');
                div.id = `shelf-section-${shelfId}`;
                const shelfHeader = document.createElement('div');
                shelfHeader.className = 'shelf-header';
                shelfHeader.innerHTML = `
                    <h4><i class="fas fa-layer-group" style="color:var(--accent);font-size:.8rem;"></i> ${shelf.name.value}</h4>
                    <div class="shelf-actions">
                        <button class="btn-edit" onclick="editShelf('${shelfId}')"><i class="fas fa-pen"></i> Edit</button>
                        <button class="btn-primary" style="padding:.28rem .65rem;font-size:.78rem;" onclick="addProductToShelf('${shelfId}')"><i class="fas fa-plus"></i> Add Product</button>
                    </div>`;
                div.appendChild(shelfHeader);

                const progressWrapper = document.createElement('div');
                progressWrapper.className = 'progress-bar';
                const progressFill = document.createElement('div');
                progressFill.style.width = `${fillPercent}%`;
                progressFill.style.background = color;
                progressFill.style.height = '20px';
                progressWrapper.appendChild(progressFill);
                div.appendChild(progressWrapper);

                const table = document.createElement('table');
                const thead = document.createElement('thead');
                thead.innerHTML = '<tr><th>Image</th><th>Name</th><th>Price</th><th>Size</th><th>Color</th><th>Stock</th><th>Shelf</th><th>Action</th></tr>';
                table.appendChild(thead);
                const tbody = document.createElement('tbody');

                for (const item of shelfItems) {
                    const prodRes = await fetch(`/api/products/${encodeURIComponent(item.productId.value)}`);
                    const product = await prodRes.json();
                    const dataProductId = item.productId.value;
                    const dataInventoryId = item.id;

                    const row = document.createElement('tr');
                    const imageCell = document.createElement('td');
                    const img = document.createElement('img');
                    img.src = product.image.value;
                    img.width = 30;
                    imageCell.appendChild(img);
                    row.appendChild(imageCell);

                    const nameCell = document.createElement('td');
                    nameCell.textContent = window.tProduct(product.name.value);
                    row.appendChild(nameCell);

                    const priceCell = document.createElement('td');
                    priceCell.className = 'price';
                    priceCell.dataset.productId = dataProductId;
                    priceCell.textContent = `€${product.price.value}`;
                    row.appendChild(priceCell);

                    const sizeCell = document.createElement('td');
                    sizeCell.textContent = window.tSize(product.size.value);
                    row.appendChild(sizeCell);

                    const colorCell = document.createElement('td');
                    const colorBox = document.createElement('span');
                    colorBox.className = 'color-box';
                    colorBox.style.background = colorCss(product.color.value);
                    colorBox.style.display = 'inline-block';
                    colorBox.style.width = '16px';
                    colorBox.style.height = '16px';
                    colorBox.style.border = '1px solid #000';
                    colorCell.appendChild(colorBox);
                    row.appendChild(colorCell);

                    const stockCell = document.createElement('td');
                    stockCell.className = 'stock-count';
                    stockCell.dataset.inventoryId = dataInventoryId;
                    stockCell.textContent = item.stockCount.value;
                    row.appendChild(stockCell);

                    const shelfCountCell = document.createElement('td');
                    shelfCountCell.textContent = item.shelfCount.value;
                    row.appendChild(shelfCountCell);

                    const actionCell = document.createElement('td');
                    const buyButton = document.createElement('button');
                    buyButton.className = 'btn-buy';
                    buyButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Buy';
                    buyButton.onclick = () => buyOne(item.id);
                    actionCell.appendChild(buyButton);
                    row.appendChild(actionCell);

                    tbody.appendChild(row);
                }

                table.appendChild(tbody);
                div.appendChild(table);
                content.appendChild(div);

            }
        } catch (err) {
            console.error('Error loading inventory:', err);
        }
    }

    function initShelfModal() {
        const modal = document.getElementById('shelf-modal');
        const form = document.getElementById('shelf-form');
        const cancelBtn = document.getElementById('shelf-form-cancel');
        const errorEl = document.getElementById('shelf-form-error');

        if (!modal || !form) return;

        function closeModal() {
            modal.setAttribute('hidden', '');
            errorEl.textContent = '';
        }

        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            errorEl.textContent = '';

            const id = document.getElementById('shelf-form-id').value;
            const storeId = document.getElementById('shelf-form-storeId').value;
            const name = document.getElementById('shelf-form-name').value.trim();
            const level = parseInt(document.getElementById('shelf-form-level').value, 10);
            const image = document.getElementById('shelf-form-image').value.trim();

            if (!name || isNaN(level) || level < 0) {
                errorEl.textContent = window.t('forms.invalid_shelf_error') || 'Invalid name or level';
                return;
            }

            const isEdit = Boolean(id);
            const body = isEdit ? {
                name: { type: 'String', value: name },
                level: { type: 'Number', value: level },
                image: { type: 'String', value: image }
            } : {
                storeId,
                name,
                level,
                image
            };

            const apiUrl = isEdit ? `/api/shelves/${encodeURIComponent(id)}` : '/api/shelves';
            const method = isEdit ? 'PATCH' : 'POST';

            fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            .then(r => {
                if (!r.ok) return r.text().then(t => { throw new Error(t); });
                closeModal();
                location.reload();
            })
            .catch(err => {
                errorEl.textContent = 'Error saving shelf: ' + err.message;
            });
        });
    }

    window.editShelf = async function(shelfId) {
        try {
            const shelf = await fetch(`/api/shelves/${encodeURIComponent(shelfId)}`).then(r => r.json());
            const modal = document.getElementById('shelf-modal');
            if (!modal) return;
            document.getElementById('shelf-modal-title').textContent = window.t('modals.edit_shelf');
            document.getElementById('shelf-form-id').value = shelf.id;
            document.getElementById('shelf-form-storeId').value = shelf.storeId ? shelf.storeId.value : '';
            document.getElementById('shelf-form-name').value = shelf.name ? shelf.name.value : '';
            document.getElementById('shelf-form-level').value = shelf.level ? shelf.level.value : '0';
            document.getElementById('shelf-form-image').value = shelf.image ? shelf.image.value : '';
            modal.removeAttribute('hidden');
        } catch (err) {
            console.error('Error fetching shelf for edit:', err);
        }
    };

    function addProductToShelf(shelfId) {
        fetch('/api/products').then(r => r.json()).then(products => {
            fetch(`/api/inventoryitems?shelfId=${shelfId}`).then(r => r.json()).then(items => {
                const currentProductIds = items.map(item => item.productId.value);
                const eligible = products.filter(p => !currentProductIds.includes(p.id));
                const select = document.createElement('select');
                eligible.forEach(p => {
                    const option = document.createElement('option');
                    option.value = p.id;
                    option.text = p.name.value;
                    select.appendChild(option);
                });
                const btn = document.createElement('button');
                btn.textContent = 'Add';
                btn.onclick = () => {
                    const productId = select.value;
                    fetch('/api/inventoryitems', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            productId: productId,
                            shelfId: shelfId,
                            stockCount: 10,
                            shelfCount: 5
                        })
                    }).then(() => location.reload());
                };
                document.body.appendChild(document.createTextNode('Select product: '));
                document.body.appendChild(select);
                document.body.appendChild(btn);
            });
        });
    }

    function buyOne(id) {
        const invKey = id.split(':')[3] || id.split(':')[2] || id;
        fetch(`/api/inventoryitems/${encodeURIComponent(invKey)}/buy`, {method: 'PATCH'}).then(() => location.reload());
    }

    function updateProductPrice(productId, newPrice) {
        const priceElements = document.querySelectorAll(`[data-product-id="${productId}"]`);
        priceElements.forEach(el => {
            el.textContent = `€${newPrice}`;
        });
    }

    function updateInventoryStock(inventoryItemId, stockCount) {
        // Update stock count in inventory tables
        const stockElements = document.querySelectorAll(`[data-inventory-id="${inventoryItemId}"]`);
        stockElements.forEach(el => {
            el.textContent = stockCount;
            // Add low stock class if < 5
            if (stockCount < 5) {
                el.classList.add('low-stock');
            } else {
                el.classList.remove('low-stock');
            }
        });
    }

    function showNotification(message) {
        const panel = document.getElementById('notifications-list');
        if (panel) {
            const placeholder = document.getElementById('notifications-placeholder');
            if (placeholder) placeholder.remove();
            const li = document.createElement('li');
            li.textContent = new Date().toLocaleTimeString() + ': ' + message;
            li.style.cssText = 'padding:6px 0;border-bottom:1px solid var(--border);color:var(--accent-amber,#d97706);';
            panel.prepend(li);
            while (panel.children.length > 10) panel.removeChild(panel.lastChild);
        }
    }

    // If in list pages, show API status
    const statusElement = document.getElementById('status');
    if (statusElement) {
        let endpoint;
        if (window.location.pathname === '/products') endpoint = '/api/products';
        if (window.location.pathname === '/stores') endpoint = '/api/stores';
        if (window.location.pathname === '/employees') endpoint = '/api/employees';

        if (endpoint) {
            fetch(endpoint)
                .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
                .then((data) => {
                    statusElement.innerText = `Loaded ${data.length || 0} records`;
                })
                .catch((err) => {
                    statusElement.innerText = `Error connecting to API: ${err}`;
                });
        }
    }
});