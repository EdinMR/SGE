// clients.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const clientForm = document.getElementById('clientForm');
    const clientDniInput = document.getElementById('client-dni');
    const clientNameInput = document.getElementById('client-name');
    const clientPhoneInput = document.getElementById('client-phone');
    const clientEmailInput = document.getElementById('client-email');
    const saveClientBtn = document.getElementById('saveClientBtn');
    const cancelClientEditBtn = document.getElementById('cancelClientEditBtn');
    const clientsTableBody = document.getElementById('clients-table-body');
    const clientSearchInput = document.getElementById('client-search');
    
    // Almacenamiento y estado
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    let isEditing = false;
    let clientToEditId = null;

    // --- Funciones del Módulo de Clientes ---

    // 1. Guardar clientes en localStorage
    const saveClients = () => {
        localStorage.setItem('clients', JSON.stringify(clients));
    };

    // 2. Renderizar la tabla de clientes
    const renderClientsTable = (filteredClients = clients) => {
        clientsTableBody.innerHTML = ''; // Limpiar la tabla

        if (filteredClients.length === 0) {
            clientsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="p-12 text-center text-zinc-500 dark:text-zinc-400 italic font-medium">No hay clientes registrados.</td>
                </tr>
            `;
            return;
        }

        filteredClients.forEach(client => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold">${client.dni}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${client.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${client.phone || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="edit-btn text-blue-600 hover:text-blue-900 mr-4" data-id="${client.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-900" data-id="${client.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            clientsTableBody.appendChild(row);
        });

        // Añadir listeners a los botones de la tabla
        clientsTableBody.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', startEditing));
        clientsTableBody.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', deleteClient));
    };

    // 3. Manejar el envío del formulario (Guardar/Actualizar)
    clientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newClient = {
            id: isEditing ? clientToEditId : Date.now(), // Usar ID existente o generar uno nuevo
            dni: clientDniInput.value,
            name: clientNameInput.value,
            phone: clientPhoneInput.value,
            email: clientEmailInput.value
        };

        if (isEditing) {
            // Actualizar cliente existente
            const index = clients.findIndex(c => c.id === clientToEditId);
            if (index > -1) {
                clients[index] = newClient;
            }
            isEditing = false;
            clientToEditId = null;
            cancelClientEditBtn.classList.add('hidden');
            saveClientBtn.textContent = 'Guardar Cliente';
        } else {
            // Añadir nuevo cliente
            // Verificar si el DNI ya existe
            if (clients.some(c => c.dni === newClient.dni)) {
                alert('Ya existe un cliente con este DNI.');
                return;
            }
            clients.push(newClient);
        }

        saveClients();
        renderClientsTable();
        clientForm.reset(); // Limpiar el formulario
    });

    // 4. Iniciar el modo de edición
    const startEditing = (event) => {
        const id = parseInt(event.currentTarget.dataset.id);
        const client = clients.find(c => c.id === id);

        if (client) {
            isEditing = true;
            clientToEditId = id;
            
            clientDniInput.value = client.dni;
            clientNameInput.value = client.name;
            clientPhoneInput.value = client.phone;
            clientEmailInput.value = client.email;
            
            saveClientBtn.textContent = 'Actualizar Cliente';
            cancelClientEditBtn.classList.remove('hidden');
        }
    };

    // 5. Cancelar la edición
    cancelClientEditBtn.addEventListener('click', () => {
        isEditing = false;
        clientToEditId = null;
        clientForm.reset();
        saveClientBtn.textContent = 'Guardar Cliente';
        cancelClientEditBtn.classList.add('hidden');
    });

    // 6. Eliminar un cliente
    const deleteClient = (event) => {
        const id = parseInt(event.currentTarget.dataset.id);
        if (confirm('¿Estás seguro de que quieres eliminar a este cliente?')) {
            clients = clients.filter(c => c.id !== id);
            saveClients();
            renderClientsTable();
        }
    };

    // 7. Filtrar la tabla por búsqueda
    clientSearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredClients = clients.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            client.dni.includes(searchTerm) ||
            (client.phone && client.phone.includes(searchTerm))
        );
        renderClientsTable(filteredClients);
    });

    // --- Inicialización del módulo ---
    renderClientsTable(); // Renderizar la tabla de clientes al cargar la página
});