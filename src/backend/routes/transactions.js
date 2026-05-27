import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transactions ORDER BY date DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST new transaction
router.post('/', async (req, res) => {
  const { name, amount, type, category, date } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO transactions (name, amount, type, category, date) VALUES (?, ?, ?, ?, ?)',
      [name, amount, type, category, date]
    )
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE id = ?',
      [result.insertId]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update transaction
router.put('/:id', async (req, res) => {
  const { name, amount, type, category, date } = req.body
  try {
    await pool.query(
      'UPDATE transactions SET name=?, amount=?, type=?, category=?, date=? WHERE id=?',
      [name, amount, type, category, date, req.params.id]
    )
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE id = ?',
      [req.params.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM transactions WHERE id = ?',
      [req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router