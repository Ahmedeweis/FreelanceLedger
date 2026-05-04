import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects management
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Retrieve a list of all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - total_price
 *             properties:
 *               name:
 *                 type: string
 *               total_price:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [new, completed, pending, at_risk, canceled]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created project
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/', getProjects);
router.post('/', createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
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
 *               - name
 *               - total_price
 *             properties:
 *               name:
 *                 type: string
 *               total_price:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated project
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
