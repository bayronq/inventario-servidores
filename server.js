const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './servers.json';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Función para leer los servidores del archivo
const readServers = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, retornamos un arreglo vacío
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Función para escribir los servidores en el archivo
const writeServers = async (servers) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(servers, null, 2), 'utf8');
};

// Rutas de la API

// GET /api/servers - Obtener todos los servidores
app.get('/api/servers', async (req, res) => {
  const servers = await readServers();
  const { search } = req.query;

  if (search) {
    const filteredServers = servers.filter(s => 
      s.hostname.toLowerCase().includes(search.toLowerCase()) ||
      s.direccion_ip.toLowerCase().includes(search.toLowerCase())
    );
    res.json(filteredServers);
  } else {
    res.json(servers);
  }
});

// POST /api/servers - Crear un nuevo servidor
app.post('/api/servers', async (req, res) => {
  const servers = await readServers();
  const newServer = {
    id: Date.now(), // ID único simple
    ...req.body
  };
  servers.push(newServer);
  await writeServers(servers);
  res.status(201).json(newServer);
});

// PUT /api/servers/:id - Actualizar un servidor existente
app.put('/api/servers/:id', async (req, res) => {
  const servers = await readServers();
  const serverId = parseInt(req.params.id, 10);
  const serverIndex = servers.findIndex(s => s.id === serverId);

  if (serverIndex === -1) {
    return res.status(404).json({ message: 'Servidor no encontrado' });
  }

  const updatedServer = { ...servers[serverIndex], ...req.body };
  servers[serverIndex] = updatedServer;
  await writeServers(servers);
  res.json(updatedServer);
});

// DELETE /api/servers/:id - Eliminar un servidor
app.delete('/api/servers/:id', async (req, res) => {
  const servers = await readServers();
  const serverId = parseInt(req.params.id, 10);
  const filteredServers = servers.filter(s => s.id !== serverId);

  if (servers.length === filteredServers.length) {
    return res.status(404).json({ message: 'Servidor no encontrado' });
  }

  await writeServers(filteredServers);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
