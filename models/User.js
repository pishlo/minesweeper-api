const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gems: { type: Number, default: 100.00 }
});

module.exports = mongoose.model('User', userSchema);
