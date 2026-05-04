import express from 'express';
import { createIncome, updateIncome, deleteIncome } from '../controllers/incomeController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Income
 *   description: Income entries management
 */

/**
 * @swagger
 * /api/income:
 *   post:
 *     summary: Create a new income entry
 *     tags: [Income]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               project_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               is_received:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: The created income entry
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', createIncome);

/**
 * @swagger
 * /api/income/{id}:
 *   put:
 *     summary: Update an income entry
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               project_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               is_received:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The updated income entry
 *       404:
 *         description: Income entry not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete an income entry
 *     tags: [Income]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Income entry deleted successfully
 *       404:
 *         description: Income entry not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;
