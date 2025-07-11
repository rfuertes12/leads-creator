import express from 'express';
import { fetchLeads } from '../services/apolloService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const apiKey = req.headers['x-rapidapi-key'];
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is missing' });
    }

    const data = await fetchLeads({ ...req.query, apiKey });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; // ✅ MUST be present
