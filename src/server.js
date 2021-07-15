const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
//require('dotenv/config')

const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json())

// MYSQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'nodejs_beers'
})

// get all beers 
app.get('', (req, res) => {
  pool.getConnection((err, connection) => {

    if (err) throw err

    connection.query('SELECT * FROM beers', (err, rows) => {
      connection.release()
      if (err) {
        console.log(err)
        return res.status(400).json({ 'error': err.message })
      }

      return res.status(200).json(rows)
    })
  })
})

// run
app.listen(PORT, () => console.log(`App running -> http://localhost:${PORT}`))

