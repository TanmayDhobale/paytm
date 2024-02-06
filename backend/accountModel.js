const mongoose = require('mongoose');

const AccountSchema = mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('account', AccountSchema);
