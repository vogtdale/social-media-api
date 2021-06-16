const mongoose = require("mongoose")

const db = mongoose.connect(process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

console.log("MongooseDb Connected");

module.exports = db