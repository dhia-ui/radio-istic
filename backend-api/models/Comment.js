const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: {
    type: String
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
commentSchema.index({ eventId: 1, createdAt: -1 });

// Virtual for likes count
commentSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Ensure virtuals are included in JSON
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
