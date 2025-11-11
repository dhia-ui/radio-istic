const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// @route   GET /api/events
// @desc    Get all events with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, status, upcoming, page = 1, limit = 20, sort = '-startDate' } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    
    // Filter upcoming events
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
      query.status = { $in: ['published', 'ongoing'] };
    }

    // Execute query with pagination
    const events = await Event.find(query)
      .populate('organizer', 'firstName lastName avatar')
      .populate('participants', 'firstName lastName avatar')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName avatar email')
      .populate('participants', 'firstName lastName avatar field year')
      .populate('waitlist', 'firstName lastName avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (events-organizer, admin, president, vice-president)
router.post('/', protect, authorize('admin', 'president', 'vice-president', 'events-organizer'), [
  body('title').notEmpty().withMessage('Event title is required'),
  body('description').notEmpty().withMessage('Event description is required'),
  body('category').isIn(['Sport', 'Podcast', 'Social Events', 'Voyage', 'Social', 'Training', 'Other']).withMessage('Invalid category'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('location').notEmpty().withMessage('Event location is required'),
  validate
], async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (event organizer, admin, president)
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is authorized to update
    const isOrganizer = event.organizer.toString() === req.user._id.toString();
    const isAuthorized = ['admin', 'president', 'vice-president'].includes(req.user.role);

    if (!isOrganizer && !isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    try {
      await event.registerUser(req.user._id);
      
      res.json({
        success: true,
        message: 'Successfully registered for event',
        event
      });
    } catch (registrationError) {
      // Check if it's a waitlist addition
      if (registrationError.message.includes('waitlist')) {
        return res.status(200).json({
          success: true,
          message: registrationError.message,
          onWaitlist: true,
          event
        });
      }
      throw registrationError;
    }
  } catch (error) {
    console.error('Register event error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/events/:id/unregister
// @desc    Unregister from an event
// @access  Private
router.post('/:id/unregister', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.unregisterUser(req.user._id);

    res.json({
      success: true,
      message: 'Successfully unregistered from event',
      event
    });
  } catch (error) {
    console.error('Unregister event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering from event',
      error: error.message
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (event organizer, admin, president)
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is authorized to delete
    const isOrganizer = event.organizer.toString() === req.user._id.toString();
    const isAuthorized = ['admin', 'president'].includes(req.user.role);

    if (!isOrganizer && !isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
});

// @route   GET /api/events/stats/overview
// @desc    Get event statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      startDate: { $gte: new Date() },
      status: { $in: ['published', 'ongoing'] }
    });
    const completedEvents = await Event.countDocuments({ status: 'completed' });

    // Events by category
    const byCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalEvents,
        upcoming: upcomingEvents,
        completed: completedEvents,
        byCategory
      }
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event statistics',
      error: error.message
    });
  }
});

module.exports = router;
