import { jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('../config/db.js', () => ({
  default: jest.fn(() => Promise.resolve()),
}));

const { app } = await import('../server.js');

describe('GET /api/health', () => {
  it('returns service status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toMatch(/StudyBuddy API is running/);
  });
});
