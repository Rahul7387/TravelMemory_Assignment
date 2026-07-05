const mongoose = require('mongoose')
const URL = process.env.MONGO_URI
mongoose.connect(URL)
mongoose.Promise = global.Promise
const db = mongoose.connection
db.once('open', () => console.log('MongoDB connected successfully!'))
db.on('error', console.error.bind(console, 'DB ERROR: '))
module.exports = {db, mongoose}