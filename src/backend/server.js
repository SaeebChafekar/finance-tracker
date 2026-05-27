import express    from 'express'
import cors       from 'cors'
import dotenv     from 'dotenv'
import transactions  from './routes/transactions.js'
import subscriptions from './routes/subscriptions.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 6000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/transactions',  transactions)
app.use('/api/subscriptions', subscriptions)

app.listen(PORT, () => {
  console.log(`Ledger API running on http://localhost:${PORT}`)
})