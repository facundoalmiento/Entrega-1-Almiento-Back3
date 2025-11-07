import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { UserModel } from '../models/user.model.js';
import { PetModel } from '../models/pet.model.js';

jest.setTimeout(20000);

let mongod;
// helper para emails únicos
const u = (tag='u') => `${tag}_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}, 20000);

beforeEach(async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

test('GET /api/adoptions -> 200 y payload array', async () => {
  const res = await request(app).get('/api/adoptions').expect(200);
  expect(res.body).toHaveProperty('status', 'success');
  expect(Array.isArray(res.body.payload)).toBe(true);
});

test('POST /api/adoptions -> 201 crea', async () => {
  const user = await UserModel.create({ first_name: 'A', last_name: 'B', email: u('a'), password: 'x', role: 'user' });
  const pet  = await PetModel.create({ name: 'Firulais', species: 'dog', birthDate: new Date() });

  const res = await request(app)
    .post('/api/adoptions')
    .send({ owner: user._id.toString(), pet: pet._id.toString() })
    .expect(201);

  expect(res.body.status).toBe('success');
  expect(res.body.payload).toHaveProperty('_id');
});

test('POST /api/adoptions -> 400 faltan campos', async () => {
  await request(app).post('/api/adoptions').send({ owner: '123' }).expect(400);
});

test('GET /api/adoptions/:aid -> 200 existe, 404 no', async () => {
  const user = await UserModel.create({ first_name: 'C', last_name: 'D', email: u('c'), password: 'x', role: 'user' });
  const pet  = await PetModel.create({ name: 'Mishi', species: 'cat', birthDate: new Date() });

  const created = await request(app).post('/api/adoptions').send({ owner: user._id.toString(), pet: pet._id.toString() });
  const id = created.body.payload._id;

  await request(app).get(`/api/adoptions/${id}`).expect(200);
  await request(app).get('/api/adoptions/662222222222222222222222').expect(404);
});

test('PUT /api/adoptions/:aid -> 200 ok, 400 inválido, 404 no existe', async () => {
  const u1 = await UserModel.create({ first_name: 'A', last_name: 'B', email: u('u1'), password: 'x', role: 'user' });
  const u2 = await UserModel.create({ first_name: 'E', last_name: 'F', email: u('u2'), password: 'x', role: 'user' });
  const p1 = await PetModel.create({ name: 'Doggo', species: 'dog', birthDate: new Date() });
  const p2 = await PetModel.create({ name: 'Catto', species: 'cat', birthDate: new Date() });

  const created = await request(app).post('/api/adoptions').send({ owner: u1._id.toString(), pet: p1._id.toString() });
  const id = created.body.payload._id;

  await request(app).put(`/api/adoptions/${id}`).send({ owner: u2._id.toString(), pet: p2._id.toString() }).expect(200);
  await request(app).put('/api/adoptions/662222222222222222222222').send({ owner: u2._id.toString(), pet: p2._id.toString() }).expect(404);
  await request(app).put(`/api/adoptions/${id}`).send({ owner: u2._id.toString() }).expect(400);
});

test('DELETE /api/adoptions/:aid -> 204 ok y luego 404', async () => {
  const user = await UserModel.create({ first_name: 'A', last_name: 'B', email: u('del'), password: 'x', role: 'user' });
  const pet  = await PetModel.create({ name: 'Bicho', species: 'other', birthDate: new Date() });

  const created = await request(app).post('/api/adoptions').send({ owner: user._id.toString(), pet: pet._id.toString() });
  const id = created.body.payload._id;

  await request(app).delete(`/api/adoptions/${id}`).expect(204);
  await request(app).delete(`/api/adoptions/${id}`).expect(404);
});
