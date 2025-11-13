const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// All chat routes require authentication
router.use(protect);

// @route   GET /api/chat/conversations
// @desc    Get all conversations for logged in user
// @access  Private
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'firstName lastName avatar status')
      .populate('lastMessage')
      .sort('-lastMessageTimestamp')
      .lean();

    // Calculate unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.getUnreadCount(conv._id, req.user._id);
        return {
          ...conv,
          unreadCount
        };
      })
    );

    res.json({
      success: true,
      count: conversationsWithUnread.length,
      conversations: conversationsWithUnread
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
});

// @route   GET /api/chat/conversations/:id
// @desc    Get single conversation with messages
// @access  Private
router.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id
    })
      .populate('participants', 'firstName lastName avatar status')
      .lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Get messages for this conversation
    const messages = await Message.find({
      conversation: req.params.id,
      isDeleted: false
    })
      .populate('sender', 'firstName lastName avatar')
      .sort('createdAt')
      .lean();

    // Mark all messages as read by current user
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.user._id },
        'readBy.user': { $ne: req.user._id }
      },
      {
        $push: { readBy: { user: req.user._id, readAt: new Date() } }
      }
    );

    res.json({
      success: true,
      conversation,
      messages
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
});

// @route   POST /api/chat/conversations
// @desc    Create or get existing conversation
// @access  Private
router.post('/conversations', [
  body('participantIds').isArray({ min: 1 }).withMessage('At least one participant is required'),
  validate
], async (req, res) => {
  try {
    const { participantIds, isGroup, groupName } = req.body;

    // Add current user to participants
    const allParticipants = [...new Set([req.user._id.toString(), ...participantIds])];

    if (allParticipants.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'A conversation must have at least 2 participants'
      });
    }

    let conversation;

    if (isGroup) {
      // Create new group conversation
      conversation = await Conversation.create({
        participants: allParticipants,
        isGroup: true,
        groupName
      });
    } else {
      // Find or create one-on-one conversation
      conversation = await Conversation.findOrCreate(allParticipants);
    }

    // Populate participants
    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'firstName lastName avatar status');

    res.status(201).json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: error.message
    });
  }
});

// @route   POST /api/chat/messages
// @desc    Send a message
// @access  Private
router.post('/messages', [
  body('conversationId').notEmpty().withMessage('Conversation ID is required'),
  body('content').notEmpty().withMessage('Message content is required'),
  validate
], async (req, res) => {
  try {
    const { conversationId, content, type = 'text', mediaUrl } = req.body;

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or you are not a participant'
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content,
      type,
      mediaUrl
    });

    // Update conversation last message
    conversation.lastMessage = message._id;
    conversation.lastMessageTimestamp = message.createdAt;
    await conversation.save();

    // Populate sender info
    await message.populate('sender', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// @route   PUT /api/chat/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/messages/:id/read', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read
    await message.markAsRead(req.user._id);

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking message as read',
      error: error.message
    });
  }
});

// @route   DELETE /api/chat/messages/:id
// @desc    Delete message (soft delete)
// @access  Private
router.delete('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      sender: req.user._id
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found or you are not the sender'
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
});

// @route   GET /api/chat/unread-count
// @desc    Get total unread message count for user
// @access  Private
router.get('/unread-count', async (req, res) => {
  try {
    // Get all conversations for user
    const conversations = await Conversation.find({
      participants: req.user._id
    }).select('_id');

    // Count unread messages across all conversations
    let totalUnread = 0;
    for (const conv of conversations) {
      const unread = await Message.getUnreadCount(conv._id, req.user._id);
      totalUnread += unread;
    }

    res.json({
      success: true,
      unreadCount: totalUnread
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
});

module.exports = router;
