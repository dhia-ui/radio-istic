const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

// In-memory storage (replace with MongoDB model later if needed)
let clubLifeEvents = [
  {
    id: 1,
    type: "workshop",
    title: "Atelier Arduino",
    description: "Découvrez les bases de l'électronique avec Arduino",
    date: "2025-12-15",
    votes: { up: 45, down: 3 },
    userVotes: {}, // userId: 'up' or 'down'
    comments: []
  },
  {
    id: 2,
    type: "social",
    title: "Soirée Jeux de Société",
    description: "Une soirée conviviale pour se détendre",
    date: "2025-12-20",
    votes: { up: 38, down: 5 },
    userVotes: {},
    comments: []
  },
  {
    id: 3,
    type: "sports",
    title: "Tournoi de Baby-foot",
    description: "Championnat inter-clubs de baby-foot",
    date: "2025-12-22",
    votes: { up: 52, down: 2 },
    userVotes: {},
    comments: []
  },
  {
    id: 4,
    type: "cultural",
    title: "Ciné-débat",
    description: "Projection suivie d'un débat sur les nouvelles technologies",
    date: "2025-12-28",
    votes: { up: 41, down: 4 },
    userVotes: {},
    comments: []
  }
];

// @route   GET /api/club-life
// @desc    Get all club life events
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      events: clubLifeEvents
    });
  } catch (error) {
    console.error('Get club life events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching club life events',
      error: error.message
    });
  }
});

// @route   POST /api/club-life/:id/vote
// @desc    Vote on a club life event
// @access  Private
router.post('/:id/vote', require('../middleware/auth').protect, [
  body('voteType').isIn(['up', 'down']).withMessage('Vote type must be "up" or "down"'),
  validate
], async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { voteType } = req.body;
    const userId = req.user._id.toString();

    const event = clubLifeEvents.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user already voted
    const previousVote = event.userVotes[userId];

    if (previousVote === voteType) {
      // Remove vote if clicking same button
      delete event.userVotes[userId];
      event.votes[voteType]--;
    } else {
      // Update vote
      if (previousVote) {
        event.votes[previousVote]--;
      }
      event.userVotes[userId] = voteType;
      event.votes[voteType]++;
    }

    res.json({
      success: true,
      message: 'Vote updated successfully',
      event
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing vote',
      error: error.message
    });
  }
});

// @route   POST /api/club-life/:id/comment
// @desc    Add comment to a club life event
// @access  Private
router.post('/:id/comment', require('../middleware/auth').protect, [
  body('text').notEmpty().withMessage('Comment text is required'),
  validate
], async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { text } = req.body;
    const user = req.user;

    const event = clubLifeEvents.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const newComment = {
      id: Date.now(),
      author: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      text,
      date: new Date().toISOString()
    };

    event.comments.push(newComment);

    res.json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
      event
    });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

module.exports = router;
