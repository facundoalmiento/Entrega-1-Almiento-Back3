import { Router } from 'express';
import { generateMockUsers, generateMockPets } from '../utils/mocking.js';
import { UserModel } from '../models/user.model.js';
import { PetModel } from '../models/pet.model.js'; 

const router = Router();
// 5.3) POST "/generateData" → genera e INSERTA en la BD users y pets
// Body JSON: { "users": number, "pets": number }
router.get('/mockingpets', (req, res) => {
const { n } = req.query; // opcional: permitir ?n=20 para testear
const quantity = Number(n) > 0 ? Number(n) : 10;
const pets = generateMockPets(quantity);
return res.json({ status: 'success', payload: pets });
});

router.get('/mockingusers', async (req, res, next) => {
try {
const users = await generateMockUsers(50);
return res.json({ status: 'success', payload: users });
} catch (err) {
next(err);
}
});

// 5.3) POST "/generateData" → genera e INSERTA en la BD users y pets
// Body JSON: { "users": number, "pets": number }
router.post('/generateData', async (req, res, next) => {
try {
const usersCount = Number(req.body?.users) || 0;
const petsCount = Number(req.body?.pets) || 0;

// Generar e insertar usuarios
let createdUsers = [];
if (usersCount > 0) {
const mockUsers = await generateMockUsers(usersCount);
// Al insertar, dejamos que Mongo genere _id reales y aseguramos email único
const mapped = mockUsers.map(u => ({
first_name: u.first_name,
last_name: u.last_name,
email: u.email,
password: u.password,
role: u.role,
pets: []
}));
createdUsers = await UserModel.insertMany(mapped, { ordered: false });
}


// Generar e insertar pets, asignando owner aleatorio si hay usuarios
let createdPets = [];
if (petsCount > 0) {
const mockPets = generateMockPets(petsCount);
const userIds = createdUsers.length
? createdUsers.map(u => u._id)
: (await UserModel.find({}, '_id').lean()).map(u => u._id);


const mapped = mockPets.map(p => ({
name: p.name,
species: p.species,
birthDate: p.birthDate,
owner: userIds.length ? userIds[Math.floor(Math.random() * userIds.length)] : undefined
}));


createdPets = await PetModel.insertMany(mapped, { ordered: false });


// Actualizar relación inversa opcional (push en users.pets)
if (userIds.length && createdPets.length) {
const updates = createdPets
.filter(p => p.owner)
.map(p => ({ updateOne: { filter: { _id: p.owner }, update: { $push: { pets: p._id } } } }));
if (updates.length) await UserModel.bulkWrite(updates);
}
}


return res.status(201).json({
status: 'success',
inserted: { users: createdUsers.length, pets: createdPets.length }
});
} catch (err) {
// Si hay duplicados de email, ordered:false permite continuar; captura errores masivos
next(err);
}
});


export default router;