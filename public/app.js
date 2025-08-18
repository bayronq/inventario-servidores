const apiUrl = '/api/servers';
const serverForm = document.getElementById('server-form');
const serversList = document.getElementById('servers-list');
const searchInput = document.getElementById('search-input');
const clearSearchButton = document.getElementById('clear-search-button');

// Función para obtener y mostrar los servidores
const getServers = async (searchTerm = '') => {
    let url = apiUrl;
    if (searchTerm) {
        url += `?search=${searchTerm}`;
    }
    const response = await fetch(url);
    const servers = await response.json();
    serversList.innerHTML = '';
    servers.forEach(server => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${server.hostname}</td>
            <td>${server.direccion_ip}</td>
            <td>${server.sistema_operativo}</td>
            <td>${server.ambiente}</td>
            <td>${server.proposito}</td>
            <td>${server.administrador_responsable}</td>
            <td>${server.estado}</td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-warning edit-btn" data-id="${server.id}">Editar</button>
                    <button class="btn btn-danger delete-btn" data-id="${server.id}">Eliminar</button>
                </div>
            </td>
        `;
        serversList.appendChild(row);
    });
};

// Manejar la búsqueda interactiva
searchInput.addEventListener('input', () => {
    getServers(searchInput.value);
});

// Manejar el botón de limpiar búsqueda
clearSearchButton.addEventListener('click', () => {
    searchInput.value = '';
    getServers();
});

// Manejar el envío del formulario (Crear/Actualizar)
serverForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('server-id').value;
    const serverData = {
        hostname: document.getElementById('server-hostname').value,
        direccion_ip: document.getElementById('server-ip').value,
        sistema_operativo: document.getElementById('server-os').value,
        ambiente: document.getElementById('server-ambiente').value,
        proposito: document.getElementById('server-purpose').value,
        administrador_responsable: document.getElementById('server-admin').value,
        estado: document.getElementById('server-status').value
    };

    let response;
    if (id) {
        // Actualizar
        response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serverData)
        });
    } else {
        // Crear
        response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serverData)
        });
    }

    if (response.ok) {
        serverForm.reset();
        getServers();
    }
});

// Manejar clicks en la lista (Editar/Eliminar)
serversList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        const response = await fetch(`${apiUrl}/${id}`);
        const server = await response.json();
        document.getElementById('server-id').value = server.id;
        document.getElementById('server-hostname').value = server.hostname;
        document.getElementById('server-ip').value = server.direccion_ip;
        document.getElementById('server-os').value = server.sistema_operativo;
        document.getElementById('server-ambiente').value = server.ambiente;
        document.getElementById('server-purpose').value = server.proposito;
        document.getElementById('server-admin').value = server.administrador_responsable;
        document.getElementById('server-status').value = server.estado;
    }

    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            getServers();
        }
    }
});

// Carga inicial de los servidores
getServers();