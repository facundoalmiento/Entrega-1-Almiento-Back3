import { Router } from 'express';
import { UserModel } from '../models/user.model.js';


const router = Router();


router.get('/', async (req, res, next) => {
try {
const users = await UserModel.find().populate('pets').lean();
res.json({ status: 'success', payload: users });
} catch (err) { next(err); }
});


export default router;