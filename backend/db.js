const mongoose = require('mongoose');
require('dotenv').config(); // This loads the .env file at the start

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log(' databse connect enjou bro ');
}).catch(err => {
  console.log('DB connection error:', err);
});

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

module.exports = mongoose.model('user', userSchema);
