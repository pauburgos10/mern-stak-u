const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
  //obtain authorization from header
  const {authorization} = req.headers
  if (!authorization) {
    res.status(401).json({error:"Must log in to see this page"})
  }
  const token = authorization.replace('Bearer ', '')
  jwt.verify(token, JWT_SECRET, (err,payload)=>{
    if(err) {
      return res.status(401).json({error:"must log in to access the page"})
    }
    const {_id} = payload
    User.findById(_id).then(userData=>{
      req.user = userData
      next()
    })
    
  })
}