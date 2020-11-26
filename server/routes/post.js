const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/posts', requireLogin, (req, res) => {
  Post.find()
  .populate("postedBy", "_id name")
  .then(result=>{
    res.json({posts:result})
  })
  .catch(err=>{
    res.json(err)
  })

})

router.get('/myposts',requireLogin, (req, res) => {
  Post.find({postedBy:req.user._id})
  .populate("postedBy", "_id name")
  .then(result=>{
    res.json({post:result})
  })
  .catch(err=>{
    res.json(err)
  })

})

router.post('/posts', requireLogin, (req, res) => {
  const { title, body } = req.body
  if (!title || !body){
    return res.status(422).json({error:"Please, add all the fields"})
  }

  const post = new Post({
    title,
    body,
    postedBy:req.user
  })
  post.save().then(result=>{
    result.password=undefined
    res.json({post:result})
  })
})

module.exports = router