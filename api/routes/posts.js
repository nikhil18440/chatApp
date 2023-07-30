const router = require('express').Router()
const Post = require('../models/Post.js')
const User = require('../models/User.js')




//create post
router.post("/", async (req,res) => {
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(err){
        res.status(400).json(err)
    }
})


//update a post
router.put("/:id", async (req,res) => {
    try{

        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body}, {new:true})
            res.status(200).json(post)
        }else{
            res.status(400).json("you can update only your post")
        }

    }catch(err){
        res.status(500).json(err)
    }
})


//delete a post
router.delete("/:id", async (req,res) => {
    try{

        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne()
            res.status(200).json("post has been deleted")
        }else{
            res.status(400).json("you can delete only your post")
        }

    }catch(err){
        res.status(500).json(err)
    }
})


//like or dislike a post
router.put("/:id/like" , async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}})
            res.status(200).json("The post has been liked")
        }else{
            await post.updateOne({$pull : {likes: req.body.userId}})
            res.status(200).json("the post has been disliked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})


//get a post
router.get("/:id", async (req,res) => {
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})


//get timeline posts
router.get("/timeline/:userId", async (req,res) => {
    try {
        const currUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({ userId: currUser._id })
        const friendPosts = await Promise.all(
            currUser.following.map((friendId) => {
                return Post.find({ userId: friendId})
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    }catch(err){
        res.status(500).json(err)
    }
})


//get user's all posts
router.get("/profile/:username", async (req,res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        const posts = await Post.find({userId: user._id})
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router