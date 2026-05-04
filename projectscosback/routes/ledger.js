import express from 'express';
import { getLedger } from '../controllers/ledgerController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ledger
 *   description: Monthly ledger and financial summary
 */

/**
 * @swagger
 * /api/ledger/monthly-ledger:
 *   get:
 *     summary: Get the monthly ledger and overall financial summary
 *     tags: [Ledger]
 *     responses:
 *       200:
 *         description: A detailed summary of total earned, pending, and monthly timeline
 *       500:
 *         description: Internal server error
 */
router.get('/monthly-ledger', getLedger);

export default router;
