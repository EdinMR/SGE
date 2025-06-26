// js/products.js

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const productForm = document.getElementById('productForm');
    const productTableBody = document.getElementById('products-table-body');
    const productNameInput = document.getElementById('product-name');
    const productSkuInput = document.getElementById('product-sku');
    const productCostInput = document.getElementById('product-cost');
    const productMarginInput = document.getElementById('product-margin');
    const productPriceInput = document.getElementById('product-price');
    const productStockInput = document.getElementById('product-stock');
    const productMinStockInput = document.getElementById('product-min-stock');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const productSearchInput = document.getElementById('product-search');

    // --- State Variables ---
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let editingSku = null;

    // --- Core Functions ---

    /**
     * @function formatCurrency
     * @description Formats a number as a currency string, using the symbol from localStorage.
     * @param {number} value - The number to format.
     * @returns {string} The formatted currency string.
     */
    const formatCurrency = (value) => {
        const currencySymbol = localStorage.getItem('currencySymbol') || 'S/. ';
        return `${currencySymbol}${parseFloat(value).toFixed(2)}`;
    };

    /**
     * @function calculatePrice
     * @description Calculates the sale price based on cost and margin.
     */
    const calculatePrice = () => {
        const cost = parseFloat(productCostInput.value);
        const margin = parseFloat(productMarginInput.value);
        const IGV_RATE = 0.18; // Peruvian IGV
        
        if (!isNaN(cost) && !isNaN(margin) && cost >= 0 && margin >= 0) {
            const priceWithoutTax = cost * (1 + margin / 100);
            const finalPrice = priceWithoutTax * (1 + IGV_RATE);
            productPriceInput.value = finalPrice.toFixed(2);
        } else {
            productPriceInput.value = '';
        }
    };

    /**
     * @function renderProductsTable
     * @description Renders the product list in the table.
     * @param {Array<Object>} productList - The list of products to render.
     */
    const renderProductsTable = (productList) => {
        productTableBody.innerHTML = ''; // Clear table body
        if (productList.length === 0) {
            productTableBody.innerHTML = `<tr><td colspan="6" class="p-12 text-center text-zinc-500 dark:text-zinc-400 italic font-medium">No hay productos registrados.</td></tr>`;
            return;
        }

        productList.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors';
            
            const stockClass = product.stock <= product.minStock ? 'text-red-500 font-bold' : 'text-green-600';

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium">${product.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-zinc-600 dark:text-zinc-400">${product.sku}</td>
                <td class="px-6 py-4 whitespace-nowrap">${formatCurrency(product.cost)}</td>
                <td class="px-6 py-4 whitespace-nowrap font-semibold">${formatCurrency(product.price)}</td>
                <td class="px-6 py-4 whitespace-nowrap ${stockClass}">${product.stock}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="edit-btn text-blue-600 hover:text-blue-900 mr-4" data-sku="${product.sku}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="add-stock-btn text-green-600 hover:text-green-900 mr-4" data-sku="${product.sku}">
                        <i class="fas fa-plus-square"></i> Ingresar Stock
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-900" data-sku="${product.sku}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    };

    /**
     * @function saveProduct
     * @description Saves or updates a product in the localStorage.
     */
    const saveProduct = (event) => {
        event.preventDefault();

        const newProduct = {
            name: productNameInput.value,
            sku: productSkuInput.value.toUpperCase(),
            cost: parseFloat(productCostInput.value),
            margin: parseFloat(productMarginInput.value),
            price: parseFloat(productPriceInput.value),
            stock: parseInt(productStockInput.value),
            minStock: parseInt(productMinStockInput.value)
        };

        if (editingSku) {
            // Update existing product
            const index = products.findIndex(p => p.sku === editingSku);
            if (index !== -1) {
                products[index] = { ...products[index], ...newProduct };
            }
        } else {
            // Add new product
            if (products.some(p => p.sku === newProduct.sku)) {
                alert('Error: Ya existe un producto con este SKU. Por favor, use otro.');
                return;
            }
            products.push(newProduct);
        }

        localStorage.setItem('products', JSON.stringify(products));
        clearForm();
        renderProductsTable(products);
        alert('Producto guardado con éxito.');
        
        // Dispatch custom event to notify other modules of the stock update
        window.dispatchEvent(new CustomEvent('stockUpdated', { detail: { products: products } }));
    };

    /**
     * @function deleteProduct
     * @description Deletes a product from the list by its SKU.
     * @param {string} sku - The SKU of the product to delete.
     */
    const deleteProduct = (sku) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el producto con SKU: ${sku}?`)) {
            products = products.filter(product => product.sku !== sku);
            localStorage.setItem('products', JSON.stringify(products));
            renderProductsTable(products);
            alert('Producto eliminado.');
            window.dispatchEvent(new CustomEvent('stockUpdated', { detail: { products: products } }));
        }
    };

    /**
     * @function editProduct
     * @description Fills the form with a product's data for editing.
     * @param {string} sku - The SKU of the product to edit.
     */
    const editProduct = (sku) => {
        const product = products.find(p => p.sku === sku);
        if (product) {
            editingSku = product.sku;
            productNameInput.value = product.name;
            productSkuInput.value = product.sku;
            productCostInput.value = product.cost;
            productMarginInput.value = product.margin;
            productPriceInput.value = product.price; // Read-only
            productStockInput.value = product.stock;
            productMinStockInput.value = product.minStock;

            productSkuInput.disabled = true; // SKU cannot be changed
            saveProductBtn.textContent = 'Actualizar Producto';
            cancelEditBtn.classList.remove('hidden');
        }
    };

    /**
     * @function addStock
     * @description Prompts the user to add stock to a product.
     * @param {string} sku - The SKU of the product to update.
     */
    const addStock = (sku) => {
        const product = products.find(p => p.sku === sku);
        if (!product) return;

        const quantityToAdd = parseInt(prompt(`Ingresa la cantidad de stock a añadir para "${product.name}" (SKU: ${sku}):`));

        if (!isNaN(quantityToAdd) && quantityToAdd > 0) {
            product.stock += quantityToAdd;
            localStorage.setItem('products', JSON.stringify(products));
            renderProductsTable(products);
            alert(`Se añadieron ${quantityToAdd} unidades al stock de ${product.name}. Stock actual: ${product.stock}`);
            
            // Dispatch a custom event to notify the Dashboard
            window.dispatchEvent(new CustomEvent('stockUpdated', { detail: { products: products } }));
        } else if (quantityToAdd !== null) {
            alert('Cantidad inválida. Por favor, ingresa un número positivo.');
        }
    };

    /**
     * @function clearForm
     * @description Clears the product form and resets state.
     */
    const clearForm = () => {
        productForm.reset();
        productPriceInput.value = '';
        editingSku = null;
        productSkuInput.disabled = false;
        saveProductBtn.textContent = 'Guardar Producto';
        cancelEditBtn.classList.add('hidden');
    };

    // --- Event Handlers ---
    
    /**
     * @function handleTableClick
     * @description Handles clicks on the product table (edit, delete, add stock).
     * @param {Event} event - The click event.
     */
    const handleTableClick = (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        
        const sku = target.dataset.sku;

        if (target.classList.contains('edit-btn')) {
            editProduct(sku);
        } else if (target.classList.contains('delete-btn')) {
            deleteProduct(sku);
        } else if (target.classList.contains('add-stock-btn')) {
            addStock(sku);
        }
    };

    /**
     * @function handleSearch
     * @description Filters the product list based on the search query.
     */
    const handleSearch = () => {
        const query = productSearchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query)
        );
        renderProductsTable(filteredProducts);
    };

    // --- Event Listeners ---
    productForm.addEventListener('submit', saveProduct);
    productCostInput.addEventListener('input', calculatePrice);
    productMarginInput.addEventListener('input', calculatePrice);
    cancelEditBtn.addEventListener('click', clearForm);
    productTableBody.addEventListener('click', handleTableClick);
    productSearchInput.addEventListener('input', handleSearch);

    // --- Custom Event Listener from Settings Module ---
    // Re-renders the product table when the currency symbol is changed.
    window.addEventListener('settingsUpdated', () => {
        renderProductsTable(products);
    });

    // --- Initializations ---

    // Use a MutationObserver to render the product table when the products view is shown
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const productsView = document.getElementById('products-view');
                if (productsView && productsView.classList.contains('active')) {
                    // Refresh products from localStorage and render the table
                    products = JSON.parse(localStorage.getItem('products')) || [];
                    renderProductsTable(products);
                }
            }
        });
    });

    // Start observing the views-container for changes in the active class
    observer.observe(document.getElementById('views-container'), { attributes: true, subtree: true });

});