// js/settings.js

document.addEventListener('DOMContentLoaded', () => {
    // Selectores para los elementos del DOM
    const themeToggleBtn = document.getElementById('themeToggle');
    const storeNameInput = document.getElementById('storeNameInput');
    const saveStoreNameBtn = document.getElementById('saveStoreNameBtn');
    const storeNameDisplay = document.getElementById('storeNameDisplay');
    const appTitle = document.getElementById('appTitle');
    const currencyInput = document.getElementById('currencyInput');
    const saveCurrencyBtn = document.getElementById('saveCurrencyBtn');
    
    // Función para aplicar el tema (claro/oscuro)
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>'; // Icono de sol para cambiar a claro
        } else {
            document.documentElement.classList.remove('dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>'; // Icono de luna para cambiar a oscuro
        }
    }

    // Cargar el tema guardado en el Local Storage
    const savedTheme = localStorage.getItem('theme') || 'light'; // Por defecto es 'light'
    applyTheme(savedTheme);

    // Event Listener para cambiar el tema al hacer clic en el botón
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
    
    // Event Listeners para los botones de radio del tema en la vista de Ajustes
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const newTheme = event.target.value;
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    });

    // Cargar y mostrar el nombre de la tienda guardado
    function loadStoreName() {
        const savedStoreName = localStorage.getItem('storeName') || 'Mi Tienda';
        storeNameInput.value = savedStoreName;
        storeNameDisplay.textContent = savedStoreName;
        appTitle.textContent = `ERP - ${savedStoreName}`;
    }

    // Guardar el nombre de la tienda
    saveStoreNameBtn.addEventListener('click', () => {
        const newName = storeNameInput.value.trim();
        if (newName) {
            localStorage.setItem('storeName', newName);
            loadStoreName();
            alert('Nombre de la tienda actualizado con éxito.');
        } else {
            alert('Por favor, ingresa un nombre para la tienda.');
        }
    });
    
    // Cargar y mostrar el símbolo de la moneda
    function loadCurrencySymbol() {
        const savedCurrencySymbol = localStorage.getItem('currencySymbol') || 'S/.';
        currencyInput.value = savedCurrencySymbol;
    }
    
    // Guardar el símbolo de la moneda
    saveCurrencyBtn.addEventListener('click', () => {
        const newCurrency = currencyInput.value.trim();
        if (newCurrency) {
            localStorage.setItem('currencySymbol', newCurrency);
            loadCurrencySymbol();
            alert('Símbolo de moneda actualizado con éxito.');
        } else {
            alert('Por favor, ingresa un símbolo de moneda.');
        }
    });

    // Inicializar los valores al cargar la página
    loadStoreName();
    loadCurrencySymbol();
    
    // Sincronizar el estado del radio button con el tema actual
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const currentThemeRadio = document.getElementById(`theme-${currentTheme}`);
    if (currentThemeRadio) {
        currentThemeRadio.checked = true;
    }
});