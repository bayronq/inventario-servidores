const request = require('supertest');
const app = require('../server');
const fs = require('fs').promises;

describe('API de Servidores', () => {
  const mockServers = [
    { id: 1, hostname: 'test-server-1', direccion_ip: '192.168.1.1' },
    { id: 2, hostname: 'test-server-2', direccion_ip: '192.168.1.2' },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/servers', () => {
    it('debería retornar todos los servidores', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(mockServers));

      const response = await request(app).get('/api/servers');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockServers);
      expect(fs.readFile).toHaveBeenCalledWith('./servers.json', 'utf8');
    });

    it('debería retornar un arreglo vacío si no hay servidores', async () => {
      jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([]));

      const response = await request(app).get('/api/servers');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('debería manejar errores de lectura de archivo', async () => {
      jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('Error de lectura'));

      const response = await request(app).get('/api/servers');
      expect(response.statusCode).toBe(500);
    });
  });
});