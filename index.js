const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('.'))

const db = new sqlite3.Database('tareas.db')

db.run(`CREATE TABLE IF NOT EXISTS tareas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  texto TEXT NOT NULL
)`)

app.get('/tareas', (req, res) => {
  db.all('SELECT * FROM tareas', (err, rows) => {
    res.json(rows)
  })
})

app.post('/tareas', (req, res) => {
  const { texto } = req.body
  db.run('INSERT INTO tareas (texto) VALUES (?)', [texto], function() {
    res.json({ id: this.lastID, texto })
  })
})

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000')
})