const router = require('express').Router()
const User = require("../models/User")
const bcrypt = require('bcrypt')



//REGISTER
router.post("/register", async (req,res) => {
    
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //create new user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        //save user
        const newUser = await user.save()
        res.status(200).json(newUser)

    } catch (error) {
        res.status(404).json(error)
    }

})


//LOGIN
router.post("/login", async (req,res) => {

    try {

        const user = await User.findOne({email: req.body.email})
        if(user){

            const validPassword = await bcrypt.compare(req.body.password, user.password)

            if(validPassword){
                res.status(200).json(user)
            }else{
                res.status(400).json("wrong password")
            }

        }else{
            res.status(404).json("no user found")
        }
        
    } catch (error) {
        res.status(400).json(error)
    }

})


module.exports = router
