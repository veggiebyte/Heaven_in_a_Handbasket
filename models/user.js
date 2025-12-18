const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
  basketName: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },

  recipientAge: {
    type: Number,
    min: 0,
    max: 120,
  },

  occasion: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
  },
  dateNeeded: {
    type: Date,
    required: true,
  },
  items: {
    type: String,
  },
  budget: {
    type: String,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    default: "Planning",
  },
  photo: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  baskets: [basketSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;