import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';


// Contraseña requerida: "coder123" encriptada
const PLAIN_PASSWORD = 'coder123';
const SALT_ROUNDS = 10; // puedes bajar a 8 si quieres velocidad


export async function generateMockUsers(count = 50) {
const salt = await bcrypt.genSalt(SALT_ROUNDS);
const hashed = await bcrypt.hash(PLAIN_PASSWORD, salt);


const roles = ['user', 'admin'];


const users = Array.from({ length: count }, (_, i) => {
const first = faker.person.firstName();
const last = faker.person.lastName();


return {
_id: faker.database.mongodbObjectId(), // para imitar formato Mongo en respuestas de mocking
first_name: first,
last_name: last,
email: faker.internet.email({ firstName: first, lastName: last }).toLowerCase(),
password: hashed,
role: roles[Math.floor(Math.random() * roles.length)],
pets: []
};
});


return users;
}


export function generateMockPets(count = 10) {
const species = ['dog', 'cat', 'bird', 'reptile', 'other'];
const pets = Array.from({ length: count }, () => ({
_id: faker.database.mongodbObjectId(),
name: faker.person.firstName(),
species: species[Math.floor(Math.random() * species.length)],
birthDate: faker.date.past({ years: 12 })
}));
return pets;
}