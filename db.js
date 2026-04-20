const mongoose = require('mongoose')

const authUsername = process.env.MONGO_INITDB_ROOT_USERNAME || process.env.MONGO_USERNAME
const authPassword = process.env.MONGO_INITDB_ROOT_PASSWORD || process.env.MONGO_PASSWORD
const defaultUrl = 'mongodb://127.0.0.1:27017/fullstack-prints'

const mongoUrl = process.env.MONGODB_URI ||
  (authUsername && authPassword
    ? `mongodb://${encodeURIComponent(authUsername)}:${encodeURIComponent(authPassword)}@127.0.0.1:27017/fullstack-prints?authSource=admin`
    : defaultUrl)

mongoose.set('strictQuery', false)

const connect = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

 await mongoose.connect(mongoUrl)
  return mongoose
}

connect().catch(err => {
  console.error('MongoDB connection error:', err)
  process.exit(1)
})

module.exports = {
  connect,
  mongoose
}