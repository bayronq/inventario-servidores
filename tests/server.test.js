const request = require('supertest');

// Mock lowdb
var mockDb = {
  read: jest.fn(),
  write: jest.fn(),
  data: null, // Start with null data
};
jest.mock('lowdb', () => ({
  Low: jest.fn(() => mockDb),
}));
jest.mock('lowdb/node', () => ({
  JSONFile: jest.fn(),
}));

let app;

describe('API de Servidores', () => {
  const mockServers = [
    { id: 1, hostname: 'test-server-1', direccion_ip: '192.168.1.1' },
    { id: 2, hostname: 'test-server-2', direccion_ip: '192.168.1.2' },
  ];

  beforeEach(() => {
    jest.resetModules();
    app = require('../server');
    // Reset the mock before each test
    mockDb.read.mockClear();
    mockDb.write.mockClear();
    mockDb.data = { servers: [] }; // Reset data for each test
  });

  describe('GET /api/servers', () => {
    it('debería retornar todos los servidores', async () => {
      mockDb.data.servers = mockServers;
      const response = await request(app).get('/api/servers');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockServers);
    });

    it('debería retornar un arreglo vacío si no hay servidores', async () => {
      const response = await request(app).get('/api/servers');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/servers', () => {
    it('debería crear un nuevo servidor', async () => {
      const newServer = { hostname: 'new-server', direccion_ip: '192.168.1.3' };
      const response = await request(app).post('/api/servers').send(newServer);
      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(newServer);
      expect(response.body.id).toBe(1);
      expect(mockDb.write).toHaveBeenCalled();
    });
  });

  describe('PUT /api/servers/:id', () => {
    it('debería actualizar un servidor existente', async () => {
      mockDb.data.servers = [...mockServers];
      const updatedData = { hostname: 'updated-server' };
      const response = await request(app).put('/api/servers/1').send(updatedData);
      expect(response.statusCode).toBe(200);
      expect(response.body.hostname).toBe('updated-server');
      expect(mockDb.write).toHaveBeenCalled();
    });

    it('debería retornar 404 si el servidor no existe', async () => {
      const updatedData = { hostname: 'updated-server' };
      const response = await request(app).put('/api/servers/99').send(updatedData);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/servers/:id', () => {
    it('debería eliminar un servidor', async () => {
      mockDb.data.servers = [...mockServers];
      const response = await request(app).delete('/api/servers/1');
      expect(response.statusCode).toBe(204);
      expect(mockDb.write).toHaveBeenCalled();
    });

    it('debería retornar 404 si el servidor no existe', async () => {
      const response = await request(app).delete('/api/servers/99');
      expect(response.statusCode).toBe(404);
    });
  });
});