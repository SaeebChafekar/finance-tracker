import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET all subscriptions
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM subscriptions ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST new subscription
router.post('/', async (req, res) => {
  const { name, amount, cycle, category, next_date } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO subscriptions (name, amount, cycle, category, next_date) VALUES (?, ?, ?, ?, ?)',
      [name, amount, cycle, category, next_date]
    )
    const [rows] = await pool.query(
      'SELECT * FROM subscriptions WHERE id = ?',
      [result.insertId]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE subscription
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM subscriptions WHERE id = ?',
      [req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router