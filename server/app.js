const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')


mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', ()=> {
  console.log('Estas conectada a la base de datos')
})

mongoose.connection.on('error', (err)=> {
  console.log('Error conectando a la base de datos!!!', err)
})

require('./model/user')
require('./model/post')

//middleware
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.listen(PORT, () => {
  console.log("servidor levantado en puerto", PORT)
})