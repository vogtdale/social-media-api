const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const { get } = require("mongoose")
require("dotenv").config()
require("./dbconfig")


const port = process.env.PORT || 8080
const app = express()

app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded( {limit: "50mb", extended: false}))
app.use(cookieParser())


app.get("/", (req,res) => {
    res.status(200).send("App is Running")
})

app.use("/api", require("./routes/userapi"))
app.use("/auth", require("./routes/authapi"))
app.use("/upload", require("./routes/profileapi"))
app.use("/api", require("./routes/postsapi"))
app.use("/api", require("./routes/commentapi"))

app.use(function (req,res,next) {
    res.status(404).type("text").send("Not Found")
})


app.listen(port, () => {
    console.log(`App running on port ${port}`);
})