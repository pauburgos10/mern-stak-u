const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')


router.get('/protected', requireLogin, (req, res) => {
  res.send('Hola login')
})

router.get('/', (req, res) => {
  res.send('Hola')
})

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(422).json({ error: "ingrese nombre, email y password" })
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "Ya existe un usuario con ese email" })
      }
      bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            name: name,
            password: hashedPassword
          })

          user.save()
            .then(user => {
              res.json({ message: "Se creo el usuario exitosamente" })
            })
            .catch(err => {
              console.log(err)
            })
        })
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/signin', (req,res)=>{
  const {email, password} = req.body
  if (!email || !password){
    return res.status(422).json({error:"Ingrese ambos email y contraseña"})
  }
  User.findOne({email:email})
  .then(savedUser=>{
    if(!savedUser){
      return res.status(422).json({error: "password o email invalidos"})
    } 
    bcrypt.compare(password, savedUser.password)
    .then(doMatch=>{
      if(doMatch) {
        //res.json({message:"Login exitoso!!!"})        
        const token = jwt.sign({_id : savedUser._id}, JWT_SECRET)
        res.json({token})
      } else {
        return res.status(422).json({message: "email o password invalidos"})
      }
    })
    .catch(err=>{
      console.log(err)
    })
  })
})

module.exports = router