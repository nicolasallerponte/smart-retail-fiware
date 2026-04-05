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

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    function setLanguage(lang) {
        localStorage.setItem('lang', lang);
        if (lang === 'es') {
            document.documentElement.lang = 'es';
        } else {
            document.documentElement.lang = 'en';
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    const savedLanguage = localStorage.getItem('lang') || 'en';
    langSelector.value = savedLanguage;
    setLanguage(savedLanguage);

    themeToggle.addEventListener('change', (e) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    });

    langSelector.addEventListener('change', (e) => {
        setLanguage(e.target.value);
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
        showNotification(`Low stock alert: Product ${data.productId} in Store ${data.storeId} has ${data.stockCount} units`);
    });

    // Page-specific logic
    const pathname = window.location.pathname;
    if (pathname === '/stores') {
        loadStores();
    } else if (pathname.startsWith('/stores/')) {
        const storeId = pathname.split('/')[2];
        loadStoreDetail(storeId);
    } else if (pathname === '/products') {
        loadProducts();
        initProductModal();
    } else if (pathname.startsWith('/products/')) {
        const productId = pathname.split('/')[2];
        loadProductDetail(productId);
    } else if (pathname === '/employees') {
        loadEmployees();
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
                    <td><i class="fi fi-${store.countryCode.value.toLowerCase()}"></i> ${store.countryCode.value}</td>
                    <td class="temp">${store.temperature ? store.temperature.value + '°C' : 'N/A'}</td>
                    <td class="humidity">${store.relativeHumidity ? store.relativeHumidity.value + '%' : 'N/A'}</td>
                    <td>
                        <button onclick="editStore('${store.id}')">Edit</button>
                        <button onclick="deleteStore('${store.id}')">Delete</button>
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
                    <td><img src="${product.image.value}" width="50" alt="${product.name.value}" /></td>
                    <td><a href="/products/${productKey}">${product.name.value}</a></td>
                    <td>€${product.price.value}</td>
                    <td>${product.size.value}</td>
                    <td><span class="color-box" style="background:${product.color.value}; width: 16px; height: 16px; display:inline-block; border: 1px solid #000;"></span></td>
                    <td>
                        <button onclick="editProduct('${product.id}')">Edit</button>
                        <button onclick="deleteProduct('${product.id}')">Delete</button>
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
            titleEl.textContent  = 'Add Product';
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
                    colorInput.value     = product.color ? product.color.value : '#000000';
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

            // PATCH sends NGSI-formatted attrs; POST sends plain values (model class builds NGSI)
            const body = isEdit
                ? {
                    name:  { type: 'String', value: name },
                    price: { type: 'Number', value: price },
                    size:  { type: 'String', value: sizeSelect.value },
                    color: { type: 'String', value: color },
                    image: { type: 'String', value: image }
                  }
                : { name, price, size: sizeSelect.value, color, image };

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
                    <td><i class="${categoryIcon(category)}"></i> ${category}</td>
                    <td>${skillHtml || '<span style="color:#aaa;">No skills</span>'}</td>
                    <td>${storeName}</td>
                    <td><button onclick="deleteEmployee('${emp.id}')">Delete</button></td>
                `;
                tbody.appendChild(row);
            });
        } catch (err) {
            console.error('Error loading employees:', err);
        }
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

    async function deleteEmployee(employeeId) {
        try {
            const entityId = employeeId.startsWith('urn:ngsi-ld:') ? employeeId : `urn:ngsi-ld:Employee:${employeeId}`;
            await fetch(`/api/employees/${encodeURIComponent(entityId)}`, { method: 'DELETE' });
            loadEmployees();
        } catch (err) {
            console.error('Error deleting employee:', err);
        }
    }

    async function loadProductDetail(productId) {
        try {
            const product = await fetch(`/api/products/${encodeURIComponent(productId)}`).then(r => r.json());
            document.getElementById('product-image').src = product.image.value;
            document.getElementById('product-name').textContent = product.name.value;
            document.getElementById('product-size').textContent = `Size: ${product.size.value}`;
            document.getElementById('product-price').textContent = `Price: €${product.price.value}`;
            document.getElementById('product-color').innerHTML = `<span class="color-box" style="background:${product.color.value}; width: 20px; height: 20px; display:inline-block; border:1px solid #000;"></span> ${product.color.value}`;

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
            document.getElementById('store-name').textContent = store.name.value;
            document.getElementById('store-description').textContent = store.description.value;
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
            initMap(store.address ? store.address.value : 'Unknown');
            init3D(storeId);
            loadInventory(storeId);
            // Add shelf button
            document.getElementById('add-shelf-btn').onclick = () => {
                const name = prompt('Shelf name:');
                const level = prompt('Level:');
                if (name && level) {
                    fetch('/api/shelves', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            storeId: `urn:ngsi-ld:Store:${storeId}`,
                            name: name,
                            level: parseInt(level),
                            image: 'https://example.com/shelf.jpg'
                        })
                    }).then(() => location.reload());
                }
            };
        } catch (err) {
            console.error('Error loading store detail:', err);
        }
    }

    async function initMap(address) {
        let lat = 0, lng = 0;
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const geo = await geoRes.json();
            if (geo.length > 0) {
                lat = parseFloat(geo[0].lat);
                lng = parseFloat(geo[0].lon);
            } else {
                alert('Geocoding failed, showing default location');
            }
        } catch (err) {
            console.error('Geocoding error:', err);
            alert('Geocoding failed, showing default location');
        }
        const map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([lat, lng]).addTo(map).bindPopup(address).openPopup();
    }

    function init3D(storeId) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(400, 400);
        document.getElementById('3d-tour').appendChild(renderer.domElement);
        const light = new THREE.AmbientLight(0x404040);
        scene.add(light);
        camera.position.z = 5;
        fetch(`/api/shelves?storeId=urn:ngsi-ld:Store:${storeId}`).then(r => r.json()).then(shelves => {
            shelves.forEach((shelf, i) => {
                const geometry = new THREE.BoxGeometry(1, 0.5, 0.5);
                const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(i * 1.2 - 2, shelf.level.value * 0.6, 0);
                scene.add(cube);
                fetch(`/api/inventoryitems?shelfId=${shelf.id}`).then(r => r.json()).then(items => {
                    items.forEach((item, j) => {
                        const smallGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
                        const smallMat = new THREE.MeshBasicMaterial({color: 0xff0000});
                        const smallCube = new THREE.Mesh(smallGeo, smallMat);
                        smallCube.position.set(i * 1.2 - 2 + j * 0.3, shelf.level.value * 0.6, 0);
                        scene.add(smallCube);
                    });
                });
            });
        });
        function animate() {
            requestAnimationFrame(animate);
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
                const shelfKey = shelfId.split(':')[3] || shelfId.split(':')[2] || shelfId;
                const shelfRes = await fetch(`/api/shelves/${encodeURIComponent(shelfKey)}`);
                const shelf = await shelfRes.json();
                const totalShelfCount = shelfItems.reduce((sum, item) => sum + item.shelfCount.value, 0);
                const maxCapacity = 100;
                const fillPercent = Math.min((totalShelfCount / maxCapacity) * 100, 100);
                const color = fillPercent < 25 ? 'red' : fillPercent <= 75 ? 'yellow' : 'green';
                const div = document.createElement('div');
                const title = document.createElement('h4');
                title.innerHTML = `${shelf.name.value} <button onclick="editShelf('${shelfId}')">Edit</button> <button onclick="addProductToShelf('${shelfId}')">Add Product</button>`;
                div.appendChild(title);

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
                    const prodKey = item.productId.value.split(':')[3] || item.productId.value.split(':')[2] || item.productId.value;
                    const prodRes = await fetch(`/api/products/${encodeURIComponent(prodKey)}`);
                    const product = await prodRes.json();
                    const dataProductId = item.productId.value.split(':')[3] || item.productId.value.split(':')[2] || item.productId.value;
                    const dataInventoryId = item.id.split(':')[3] || item.id.split(':')[2] || item.id;

                    const row = document.createElement('tr');
                    const imageCell = document.createElement('td');
                    const img = document.createElement('img');
                    img.src = product.image.value;
                    img.width = 30;
                    imageCell.appendChild(img);
                    row.appendChild(imageCell);

                    const nameCell = document.createElement('td');
                    nameCell.textContent = product.name.value;
                    row.appendChild(nameCell);

                    const priceCell = document.createElement('td');
                    priceCell.className = 'price';
                    priceCell.dataset.productId = dataProductId;
                    priceCell.textContent = `€${product.price.value}`;
                    row.appendChild(priceCell);

                    const sizeCell = document.createElement('td');
                    sizeCell.textContent = product.size.value;
                    row.appendChild(sizeCell);

                    const colorCell = document.createElement('td');
                    const colorBox = document.createElement('span');
                    colorBox.className = 'color-box';
                    colorBox.style.background = product.color.value;
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
                    buyButton.textContent = 'Buy One';
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

    function editShelf(id) { alert('Edit shelf not implemented'); }

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
        // Update price in all elements with data-product-id
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
        // Append to notifications panel if exists, else alert
        const panel = document.getElementById('notifications-list');
        if (panel) {
            const li = document.createElement('li');
            li.textContent = new Date().toLocaleTimeString() + ': ' + message;
            panel.appendChild(li);
            // Keep only last 10
            while (panel.children.length > 10) {
                panel.removeChild(panel.firstChild);
            }
        } else {
            alert(message);
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