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

// Static method to find or create a conversation between users
conversationSchema.statics.findOrCreate = async function(participantIds) {
  const sortedIds = participantIds.sort();
  
  let conversation = await this.findOne({
    participants: { $all: sortedIds, $size: sortedIds.length },
    isGroup: false
  });
  
  if (!conversation) {
    conversation = await this.create({
      participants: sortedIds
    });
  }
  
  return conversation;
};

module.exports = mongoose.model('Conversation', conversationSchema);
