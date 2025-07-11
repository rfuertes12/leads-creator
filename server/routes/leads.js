import express from 'express';
import { fetchLeads } from '../services/apolloService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await fetchLeads(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;