import { Router } from 'express';
import { PetModel } from '../models/pet.model.js';


const router = Router();


router.get('/', async (req, res, next) => {
try {
const pets = await PetModel.find().populate('owner').lean();
res.json({ status: 'success', payload: pets });
} catch (err) { next(err); }
});


export default router;