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