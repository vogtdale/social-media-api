const jwt = require("jsonwebtoken")

const auth = async(req,res, next) => {
    const {token} = req.cookies

    try {
        if (!token) {
            return res.status(401).send({error: "Unauthorized"})
        }else {
            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.id = verified.id
            return next()
        }
        
    } catch (error) {
        res.status(401).send({error: "Not Authorized"})
    }
}

module.exports = auth