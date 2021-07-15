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

// get one beer by id
app.get('/:id', (req, res) => {
  pool.getConnection((err, connection) => {

    if (err) throw err

    connection.query('SELECT * FROM beers WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (err) {
        console.log(err)
        return res.status(400).json({ 'error': err.message })
      }

      return res.status(200).json(...rows)
    })
  })
})

// update beer and return a beer if is successfully updated
app.put('/:id', (req, res, next) => {
  if (!req.body.name || req.body.name.length < 3) {
    return res.status(400).json({ error: "invalid params to update the object" })
  }
  pool.getConnection((err, connection) => {

    if (err) throw err

    connection.query("UPDATE `beers` SET `name` = ? WHERE `beers`.`id` = ?", [req.body.name, req.params.id], (err, rows) => {
      connection.release()
      if (err) {
        console.log(err)
        return res.status(400).json({ 'error': err.message })
      }

      if (rows.affectedRows > 0) {
        res.redirect(`/${req.params.id}`)

      }
      else {
        return res.status(204).send()
      }
    })
  })
})


// delete beer and return a beer if is successfully deleted
app.delete('/:id', (req, res, next) => {

  pool.getConnection((err, connection) => {

    if (err) throw err

    connection.query("DELETE FROM  `beers` WHERE `id` = ?", [req.params.id], (err, rows) => {
      connection.release()
      if (err) {
        console.log(err)
        return res.status(400).json({ 'error': err.message })
      }

      if (rows.affectedRows > 0) {
        res.status(200).send()

      }
      else {
        return res.status(204).send()
      }
    })
  })
})


// create beer and return a beer 
app.post('/', (req, res, next) => {
  if (!req.body.name || req.body.name.length < 3) {
    return res.status(400).json({ error: "invalid params to update the object" })
  }
  pool.getConnection((err, connection) => {

    if (err) throw err

    connection.query("INSERT INTO `beers` (`id`, `name`, `tagline`, `description`, `image_url`) VALUES (NULL, ?, ?, ?, ?)", [req.body.name, req.body.tagline, req.body.description, req.body.image_url], (err, rows) => {
      connection.release()
      if (err) {
        console.log(err)
        return res.status(400).json({ 'error': err.message })
      }

      if (rows.affectedRows > 0) {
        res.redirect(`/${rows.insertedId}`)

      }
      else {
        return res.status(204).send()
      }
    })
  })
})



// run
app.listen(PORT, () => console.log(`App running -> http://localhost:${PORT}`))

