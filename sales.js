// js/sales.js

document.addEventListener('DOMContentLoaded', () => {
    // Selectores del DOM para el módulo de Ventas
    const posSearchInput = document.getElementById('pos-search');
    const productGrid = document.getElementById('product-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const cartTaxSpan = document.getElementById('cart-tax');
    const cartTotalSpan = document.getElementById('cart-total');
    const processSaleBtn = document.getElementById('process-sale-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const salesHistoryTabBtn = document.querySelector('[data-tab="history"]');
    const posTabContent = document.getElementById('pos-tab');
    const historyTabContent = document.getElementById('history-tab');
    const salesHistoryTableBody = document.getElementById('sales-history-table-body');

    // Datos desde localStorage (simulación de la base de datos)
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    
    // Carrito de compras en memoria
    let shoppingCart = [];
    
    /**
     * Actualiza y guarda los datos en localStorage.
     * Es una función local para este módulo, por lo que no necesita ser global.
     */
    function saveData() {
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('sales', JSON.stringify(sales));
    }

    /**
     * Actualiza el display del carrito, los totales y el estado de los botones.
     */
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        if (shoppingCart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center text-zinc-500 italic py-10">
                    <i class="fas fa-shopping-cart fa-3x mb-4"></i>
                    <p>El carrito está vacío. Agrega productos.</p>
                </div>
            `;
            processSaleBtn.disabled = true;
            processSaleBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            processSaleBtn.disabled = false;
            processSaleBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            shoppingCart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'flex items-center justify-between p-4 bg-zinc-100 dark:bg-zinc-700 rounded-lg shadow-sm';
                cartItemElement.innerHTML = `
                    <div class="flex-1">
                        <p class="font-bold text-lg">${item.name}</p>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400">SKU: ${item.sku} | Cantidad: ${item.quantity}</p>
                    </div>
                    <div class="flex items-center">
                        <span class="font-bold text-blue-600 dark:text-blue-400 mr-4">S/. ${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="remove-from-cart-btn text-red-500 hover:text-red-600 transition-colors p-2 rounded-full" data-sku="${item.sku}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
        updateCartTotals();
    }
    
    /**
     * Calcula y actualiza los totales del carrito (subtotal, impuesto y total).
     */
    function updateCartTotals() {
        let subtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let tax = subtotal * 0.18; // Asumiendo IGV del 18%
        let total = subtotal + tax;

        cartSubtotalSpan.textContent = `S/. ${subtotal.toFixed(2)}`;
        cartTaxSpan.textContent = `S/. ${tax.toFixed(2)}`;
        cartTotalSpan.textContent = `S/. ${total.toFixed(2)}`;
    }

    /**
     * Renderiza el listado de productos en la cuadrícula del TPV.
     * @param {Array<object>} productList - La lista de productos a renderizar.
     */
    function renderProductGrid(productList) {
        productGrid.innerHTML = '';
        if (productList.length === 0) {
            productGrid.innerHTML = `
                <div class="col-span-4 p-12 text-center text-zinc-500 dark:text-zinc-400 italic font-medium">
                    No se encontraron productos.
                </div>
            `;
            return;
        }

        productList.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = `product-card bg-zinc-50 dark:bg-zinc-700 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-600 text-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl relative ${product.stock <= product.minStock ? 'border-red-500' : ''}`;
            productCard.dataset.sku = product.sku;
            productCard.innerHTML = `
                <div class="absolute top-3 right-3 text-sm font-bold p-1 rounded-md ${product.stock <= product.minStock ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}">
                    Stock: ${product.stock}
                </div>
                <i class="fas fa-box-open fa-3x text-blue-600 dark:text-blue-400 mb-4"></i>
                <h4 class="font-bold text-lg">${product.name}</h4>
                <p class="text-zinc-500 dark:text-zinc-400 text-sm">SKU: ${product.sku}</p>
                <p class="font-extrabold text-2xl mt-2 text-green-600 dark:text-green-400">S/. ${product.price.toFixed(2)}</p>
                ${product.stock <= 0 ? '<div class="absolute inset-0 bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center font-bold text-red-600 text-xl rounded-2xl">Agotado</div>' : ''}
            `;
            productGrid.appendChild(productCard);
        });
    }

    /**
     * Renderiza el historial de ventas en la tabla.
     */
    function renderSalesHistory() {
        salesHistoryTableBody.innerHTML = '';
        if (sales.length === 0) {
            salesHistoryTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="p-12 text-center text-zinc-500 dark:text-zinc-400 italic font-medium">No hay ventas registradas.</td>
                </tr>
            `;
            return;
        }

        sales.forEach(sale => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-zinc-900 dark:text-zinc-100">${sale.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-zinc-600 dark:text-zinc-300">${sale.date}</td>
                <td class="px-6 py-4 whitespace-nowrap font-bold text-green-600 dark:text-green-400">S/. ${sale.total.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button class="view-sale-btn text-blue-600 hover:text-blue-800 transition-colors font-semibold" data-sale-id="${sale.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            `;
            salesHistoryTableBody.appendChild(row);
        });
    }

    // --- Event Listeners ---

    // Filtra productos al escribir en el buscador
    posSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || product.sku.toLowerCase().includes(searchTerm)
        );
        renderProductGrid(filteredProducts);
    });
    
    // Añade un producto al carrito al hacer clic en su tarjeta
    productGrid.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;

        const sku = productCard.dataset.sku;
        const productToAdd = products.find(p => p.sku === sku);

        if (!productToAdd || productToAdd.stock <= 0) {
            alert('¡Producto agotado!');
            return;
        }

        const existingItem = shoppingCart.find(item => item.sku === sku);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            shoppingCart.push({ ...productToAdd, quantity: 1 });
        }
        
        productToAdd.stock -= 1; // Disminuir stock en memoria
        updateCartDisplay();
        renderProductGrid(products); // Actualizar el grid para reflejar el stock
    });

    // Remueve un producto del carrito
    cartItemsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-from-cart-btn');
        if (!removeBtn) return;
        
        const sku = removeBtn.dataset.sku;
        const itemToRemove = shoppingCart.find(item => item.sku === sku);
        
        if (itemToRemove) {
            // Devolver el stock al inventario
            const productInStock = products.find(p => p.sku === sku);
            if (productInStock) {
                productInStock.stock += itemToRemove.quantity;
            }
            
            // Eliminar el producto del carrito
            shoppingCart = shoppingCart.filter(item => item.sku !== sku);
            updateCartDisplay();
            renderProductGrid(products); // Actualizar el grid
        }
    });

    // Vacía el carrito
    clearCartBtn.addEventListener('click', () => {
        // Devolver el stock de todos los productos del carrito
        shoppingCart.forEach(item => {
            const productInStock = products.find(p => p.sku === item.sku);
            if (productInStock) {
                productInStock.stock += item.quantity;
            }
        });
        shoppingCart = [];
        updateCartDisplay();
        renderProductGrid(products); // Actualizar el grid
    });

    // Procesa la venta
    processSaleBtn.addEventListener('click', () => {
        if (shoppingCart.length === 0) {
            alert('El carrito está vacío.');
            return;
        }

        const newSale = {
            id: `VENTA-${Date.now()}`,
            date: new Date().toISOString(),
            total: parseFloat(cartTotalSpan.textContent.replace('S/. ', '')),
            cost: shoppingCart.reduce((sum, item) => sum + (item.cost * item.quantity), 0),
            items: shoppingCart.map(item => ({
                sku: item.sku,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        sales.push(newSale);
        saveData(); // Guardar ventas y productos actualizados en localStorage
        
        // Limpiar el carrito y actualizar el TPV
        shoppingCart = [];
        updateCartDisplay();
        renderProductGrid(products);
        renderSalesHistory();

        alert('¡Venta procesada con éxito!');
        
        // --- Notifica al módulo principal para actualizar el Dashboard ---
        // Despacha un evento personalizado para que el main.js sepa que debe actualizar
        document.dispatchEvent(new Event('dataUpdated'));
    });
    
    // Maneja el cambio de pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remueve la clase activa de todos los botones y contenidos
            tabButtons.forEach(b => b.classList.remove('active-tab-btn'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

            // Añade la clase activa al botón y muestra el contenido correspondiente
            btn.classList.add('active-tab-btn');
            const targetTab = document.getElementById(`${btn.dataset.tab}-tab`);
            if (targetTab) {
                targetTab.classList.remove('hidden');
            }
        });
    });
    
    // --- Inicialización ---
    renderProductGrid(products);
    updateCartDisplay();
    renderSalesHistory();
});