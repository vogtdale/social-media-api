const app = require("express").Router()
const {register, login, isloggedin, logout} = require("../controllers/authController")
const {registerValidator, loginValidator} = require("../middleware/express-validator/expressValidator")


app.post("/register", registerValidator, register)
app.post("/login", loginValidator, login)

app.get("/loggedin", isloggedin)
app.get("/logout", logout)

module.exports = app