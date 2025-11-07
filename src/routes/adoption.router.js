// src/routes/adoption.router.js
import { Router } from 'express';
import mongoose from 'mongoose';

// Creamos el modelo directamente acá (puede estar en /models/adoption.model.js también)
const adoptionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true
    }
  },
  { timestamps: true }
);

const AdoptionModel = mongoose.model('Adoption', adoptionSchema);

const router = Router();

/**
 * @openapi
 * /api/adoptions:
 *   get:
 *     summary: Lista todas las adopciones registradas
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', async (req, res, next) => {
  try {
    const adoptions = await AdoptionModel.find().populate(['owner', 'pet']).lean();
    res.json({ status: 'success', payload: adoptions });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/adoptions:
 *   post:
 *     summary: Crea una nueva adopción
 *     tags: [Adoptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *               pet:
 *                 type: string
 *     responses:
 *       201:
 *         description: Adopción creada
 *       400:
 *         description: Faltan datos requeridos
 */
router.post('/', async (req, res, next) => {
  try {
    const { owner, pet } = req.body;

    if (!owner || !pet) {
      return res.status(400).json({ status: 'error', message: 'owner y pet son obligatorios' });
    }

    const adoption = await AdoptionModel.create({ owner, pet });
    res.status(201).json({ status: 'success', payload: adoption });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/adoptions/{aid}:
 *   get:
 *     summary: Obtiene una adopción por ID
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adopción encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:aid', async (req, res, next) => {
  try {
    const adoption = await AdoptionModel.findById(req.params.aid).populate(['owner', 'pet']).lean();
    if (!adoption)
      return res.status(404).json({ status: 'error', message: 'Adopción no encontrada' });
    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/adoptions/{aid}:
 *   put:
 *     summary: Actualiza una adopción
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *               pet:
 *                 type: string
 *     responses:
 *       200:
 *         description: Adopción actualizada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: No encontrada
 */
router.put('/:aid', async (req, res, next) => {
  try {
    const { owner, pet } = req.body;

    if (!owner || !pet)
      return res.status(400).json({ status: 'error', message: 'owner y pet son obligatorios' });

    const adoption = await AdoptionModel.findByIdAndUpdate(
      req.params.aid,
      { owner, pet },
      { new: true }
    ).lean();

    if (!adoption)
      return res.status(404).json({ status: 'error', message: 'Adopción no encontrada' });

    res.json({ status: 'success', payload: adoption });
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/adoptions/{aid}:
 *   delete:
 *     summary: Elimina una adopción
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Eliminada correctamente
 *       404:
 *         description: No encontrada
 */
router.delete('/:aid', async (req, res, next) => {
  try {
    const deleted = await AdoptionModel.findByIdAndDelete(req.params.aid).lean();
    if (!deleted)
      return res.status(404).json({ status: 'error', message: 'Adopción no encontrada' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
