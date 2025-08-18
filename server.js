const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './servers.json';

// Configurar lowdb
const adapter = new JSONFile(DATA_FILE);
const db = new Low(adapter, { servers: [] });

// Función para inicializar la base de datos y el servidor
const startServer = async () => {
  // Leer la base de datos e inicializar si está vacía
  await db.read();
  db.data ||= { servers: [] };
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static('public'));

  // Rutas de la API

  // GET /api/servers - Obtener todos los servidores
  app.get('/api/servers', (req, res) => {
    const { servers } = db.data;
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

  // GET /api/servers/:id - Obtener un servidor por ID
  app.get('/api/servers/:id', (req, res) => {
    const { servers } = db.data;
    const serverId = parseInt(req.params.id, 10);
    const server = servers.find(s => s.id === serverId);

    if (!server) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    res.json(server);
  });

  // POST /api/servers - Crear un nuevo servidor
  app.post('/api/servers', async (req, res) => {
    const { servers } = db.data;
    const newServer = {
      id: servers.length > 0 ? Math.max(...servers.map(s => s.id)) + 1 : 1,
      ...req.body
    };
    servers.push(newServer);
    await db.write();
    res.status(201).json(newServer);
  });

  // PUT /api/servers/:id - Actualizar un servidor existente
  app.put('/api/servers/:id', async (req, res) => {
    const serverId = parseInt(req.params.id, 10);
    const { servers } = db.data;
    const serverIndex = servers.findIndex(s => s.id === serverId);

    if (serverIndex === -1) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    const updatedServer = { ...servers[serverIndex], ...req.body };
    servers[serverIndex] = updatedServer;
    await db.write();
    res.json(updatedServer);
  });

  // DELETE /api/servers/:id - Eliminar un servidor
  app.delete('/api/servers/:id', async (req, res) => {
    const serverId = parseInt(req.params.id, 10);
    const { servers } = db.data;
    const initialLength = servers.length;
    db.data.servers = servers.filter(s => s.id !== serverId);

    if (db.data.servers.length === initialLength) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    await db.write();
    res.status(204).send();
  });

  // Iniciar el servidor
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

<<<<<<< HEAD
// Función para escribir los servidores en el archivo
const writeServers = async (servers) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(servers, null, 2), 'utf8');
};

// Rutas de la API

// GET /api/servers - Obtener todos los servidores
app.get('/api/servers', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Error al leer los servidores' });
  }
});

// GET /api/servers/:id - Obtener un servidor por su id
app.get('/api/servers/:id', async (req, res) => {
  try {
    const servers = await readServers();
    const serverId = parseInt(req.params.id, 10);
    const server = servers.find(s => s.id === serverId);

    if (server) {
      res.json(server);
    } else {
      res.status(404).json({ message: 'Servidor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al leer el servidor' });
  }
});

// POST /api/servers - Crear un nuevo servidor
app.post('/api/servers', async (req, res) => {
  try {
    const servers = await readServers();
    const newServer = {
      id: Date.now(), // ID único simple
      ...req.body
    };
    servers.push(newServer);
    await writeServers(servers);
    res.status(201).json(newServer);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el servidor' });
  }
});

// PUT /api/servers/:id - Actualizar un servidor existente
app.put('/api/servers/:id', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el servidor' });
  }
});

// DELETE /api/servers/:id - Eliminar un servidor
app.delete('/api/servers/:id', async (req, res) => {
  try {
    const servers = await readServers();
    const serverId = parseInt(req.params.id, 10);
    const filteredServers = servers.filter(s => s.id !== serverId);

    if (servers.length === filteredServers.length) {
      return res.status(404).json({ message: 'Servidor no encontrado' });
    }

    await writeServers(filteredServers);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el servidor' });
  }
});

// Iniciar el servidor solo si el script se ejecuta directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
=======
// Arrancar el servidor
startServer();
>>>>>>> v2
