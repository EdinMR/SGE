// cash.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const cashForm = document.getElementById('cashForm');
    const cashTypeInput = document.getElementById('cash-type');
    const cashDescriptionInput = document.getElementById('cash-description');
    const cashAmountInput = document.getElementById('cash-amount');
    const currentBalanceElement = document.getElementById('current-balance');
    const totalInElement = document.getElementById('total-in');
    const totalOutElement = document.getElementById('total-out');
    const cashTableBody = document.getElementById('cash-table-body');

    // Almacenamiento y estado
    let cashMovements = JSON.parse(localStorage.getItem('cashMovements')) || [];
    let currentBalance = parseFloat(localStorage.getItem('currentBalance')) || 0;

    // --- Funciones del Módulo de Caja ---

    // 1. Guardar movimientos de caja en localStorage
    const saveCashMovements = () => {
        localStorage.setItem('cashMovements', JSON.stringify(cashMovements));
    };

    // 2. Guardar saldo actual en localStorage
    const saveCurrentBalance = () => {
        localStorage.setItem('currentBalance', currentBalance.toFixed(2));
    };

    // 3. Renderizar la tabla de movimientos
    const renderCashTable = () => {
        cashTableBody.innerHTML = ''; // Limpiar la tabla
        let totalIn = 0;
        let totalOut = 0;

        if (cashMovements.length === 0) {
            cashTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="p-12 text-center text-zinc-500 dark:text-zinc-400 italic font-medium">No hay movimientos registrados.</td>
                </tr>
            `;
            return;
        }

        cashMovements.forEach(movement => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm">${new Date(movement.date).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${movement.type === 'in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-semibold">${movement.type === 'in' ? 'Ingreso' : 'Egreso'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${movement.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${movement.type === 'in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">${movement.type === 'in' ? '+' : '-'} S/. ${movement.amount.toFixed(2)}</td>
            `;
            cashTableBody.appendChild(row);

            if (movement.type === 'in') {
                totalIn += movement.amount;
            } else {
                totalOut += movement.amount;
            }
        });

        // Actualizar el resumen
        currentBalanceElement.textContent = `S/. ${currentBalance.toFixed(2)}`;
        totalInElement.textContent = `S/. ${totalIn.toFixed(2)}`;
        totalOutElement.textContent = `S/. ${totalOut.toFixed(2)}`;
    };

    // 4. Manejar el envío del formulario
    cashForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const type = cashTypeInput.value;
        const description = cashDescriptionInput.value;
        const amount = parseFloat(cashAmountInput.value);

        if (isNaN(amount) || amount <= 0) {
            alert('Por favor, ingresa un monto válido.');
            return;
        }

        const newMovement = {
            id: Date.now(),
            date: Date.now(),
            type: type,
            description: description,
            amount: amount
        };

        cashMovements.push(newMovement);

        // Actualizar el saldo
        if (type === 'in') {
            currentBalance += amount;
        } else {
            currentBalance -= amount;
        }

        saveCashMovements();
        saveCurrentBalance();
        renderCashTable();
        cashForm.reset(); // Limpiar el formulario
    });

    // --- Inicialización del módulo ---
    renderCashTable(); // Renderizar la tabla de movimientos al cargar la página
});