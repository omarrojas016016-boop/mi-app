const express = require('express')
const { createClient } = require('@libsql/client')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('.'))

const db = createClient({ url: 'file:tareas.db' })

async function init() {
  await db.execute(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL
  )`)
}

app.get('/tareas', async (req, res) => {
  const result = await db.execute('SELECT * FROM tareas')
  res.json(result.rows)
})

app.post('/tareas', async (req, res) => {
  const { texto } = req.body
  const result = await db.execute({
    sql: 'INSERT INTO tareas (texto) VALUES (?)',
    args: [texto]
  })
  res.json({ id: Number(result.lastInsertRowid), texto })
})

init().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
  })
})