import { Router } from 'express';
import { UserModel } from '../models/user.model.js';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Lista todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 665f8a0b9a0c3a0012ab34cd
 *                       first_name:
 *                         type: string
 *                         example: Ada
 *                       last_name:
 *                         type: string
 *                         example: Lovelace
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: ada@lovelace.dev
 *                       role:
 *                         type: string
 *                         enum: [user, admin]
 *                         example: user
 *                       pets:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: ObjectId de Pet
 */
router.get('/', async (req, res, next) => {
  try {
    const users = await UserModel.find().populate('pets').lean();
    res.json({ status: 'success', payload: users });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de Mongo del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: object
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id).populate('pets').lean();
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    res.json({ status: 'success', payload: user });
  } catch (err) { next(err); }
});

export default router;
