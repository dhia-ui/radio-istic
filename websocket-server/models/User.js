const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String,
    default: '/avatars/default-avatar.jpg'
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  socketId: {
    type: String
  },
  lastSeen: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);
