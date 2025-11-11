const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  isGroup: {
    type: Boolean,
    default: false
  },
  groupName: {
    type: String,
    trim: true
  },
  groupAvatar: {
    type: String
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageTimestamp: {
    type: Date
  },
  // Track unread counts per user
  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTimestamp: -1 });

// Validate that conversation has at least 2 participants
conversationSchema.pre('save', function(next) {
  if (this.participants.length < 2) {
    next(new Error('A conversation must have at least 2 participants'));
  } else {
    next();
  }
});

// Static method to find or create a conversation between users
conversationSchema.statics.findOrCreate = async function(participantIds) {
  // Sort participant IDs to ensure consistent ordering
  const sortedIds = participantIds.sort();
  
  // Try to find existing conversation
  let conversation = await this.findOne({
    participants: { $all: sortedIds, $size: sortedIds.length },
    isGroup: false
  });
  
  // Create new conversation if not found
  if (!conversation) {
    conversation = await this.create({
      participants: sortedIds
    });
  }
  
  return conversation;
};

module.exports = mongoose.model('Conversation', conversationSchema);
