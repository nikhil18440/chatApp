const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require('dotenv')
const app = express()
const userRoute = require("./routes/users.js")
const authRoute = require("./routes/auth.js")
const postRoute = require("./routes/posts.js")
const conversationRoute = require("./routes/conversations.js")
const messagesRoute = require("./routes/messages.js")
const cors = require('cors')
const multer = require('multer')
const path = require('path/posix')

dotenv.config()


//middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())


mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true
    }).then(
        console.log("connected to mongodb")
    ).catch((err) => {
        console.log(err)
    })



app.use("/images", express.static(path.join(__dirname, "public/images")))

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "/public/images")
    },
    filename: (req,file,cb) => {
        cb(null, req.body.name)
    },
})

const upload = multer({storage})
app.post("/api/upload", upload.single("file"), (req,res) => {
    try {
        return res.status(200).json("File uploaded succesfully")
    } catch (error) {
        console.log(error)
    }
})

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/messages", messagesRoute)




app.listen(5000, () => {
    console.log('this is port 5000...')
})