const apiUrl = '/api/servers';
const serverForm = document.getElementById('server-form');
const serversList = document.getElementById('servers-list');

// Función para obtener y mostrar los servidores
const getServers = async () => {
    const response = await fetch(apiUrl);
    const servers = await response.json();
    serversList.innerHTML = '';
    servers.forEach(server => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${server.name}</td>
            <td>${server.ip}</td>
            <td>${server.os}</td>
            <td>
                <button class="edit-btn" data-id="${server.id}">Editar</button>
                <button class="delete-btn" data-id="${server.id}">Eliminar</button>
            </td>
        `;
        serversList.appendChild(row);
    });
};

// Manejar el envío del formulario (Crear/Actualizar)
serverForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('server-id').value;
    const name = document.getElementById('server-name').value;
    const ip = document.getElementById('server-ip').value;
    const os = document.getElementById('server-os').value;

    const serverData = { name, ip, os };

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
        document.getElementById('server-name').value = server.name;
        document.getElementById('server-ip').value = server.ip;
        document.getElementById('server-os').value = server.os;
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
