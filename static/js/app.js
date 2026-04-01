document.addEventListener('DOMContentLoaded', () => {
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

    function updateProductPrice(productId, newPrice) {
        // Update price in all elements with data-product-id
        const priceElements = document.querySelectorAll(`[data-product-id="${productId}"] .price`);
        priceElements.forEach(el => {
            el.textContent = `€${newPrice}`;
        });
    }

    function updateInventoryStock(inventoryItemId, stockCount) {
        // Update stock count in inventory tables
        const stockElements = document.querySelectorAll(`[data-inventory-id="${inventoryItemId}"] .stock-count`);
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
        // Simple alert for now, can be enhanced with a notification panel
        alert(message);
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