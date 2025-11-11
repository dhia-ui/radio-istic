const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/members
// @desc    Get all members with filtering and pagination
// @access  Public (basic info) / Private (detailed info)
router.get('/', async (req, res) => {
  try {
    const { field, year, status, search, page = 1, limit = 50, sort = '-points' } = req.query;

    // Build query
    const query = { isActive: true };

    if (field) query.field = field;
    if (year) query.year = parseInt(year);
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const members = await User.find(query)
      .select('-password')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: members.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      members
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching members',
      error: error.message
    });
  }
});

// @route   GET /api/members/leaderboard
// @desc    Get members leaderboard (top 10 by points)
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find({ isActive: true })
      .select('firstName lastName avatar field year points role isBureau')
      .sort('-points')
      .limit(parseInt(limit));

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

// @route   GET /api/members/bureau
// @desc    Get all bureau members
// @access  Public
router.get('/bureau', async (req, res) => {
  try {
    const bureauMembers = await User.find({ isBureau: true, isActive: true })
      .select('-password')
      .sort('role');

    res.json({
      success: true,
      count: bureauMembers.length,
      members: bureauMembers
    });
  } catch (error) {
    console.error('Get bureau members error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bureau members',
      error: error.message
    });
  }
});

// @route   GET /api/members/stats
// @desc    Get member statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ isActive: true });
    const onlineMembers = await User.countDocuments({ status: 'online', isActive: true });
    const bureauMembers = await User.countDocuments({ isBureau: true, isActive: true });

    // Members by field
    const byField = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$field', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Members by year
    const byYear = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalMembers,
        online: onlineMembers,
        bureau: bureauMembers,
        byField,
        byYear
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// @route   GET /api/members/:id
// @desc    Get single member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      member
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching member',
      error: error.message
    });
  }
});

// @route   PUT /api/members/:id/points
// @desc    Update member points (admin/bureau only)
// @access  Private (admin, president, vice-president)
router.put('/:id/points', protect, authorize('admin', 'president', 'vice-president'), async (req, res) => {
  try {
    const { points, action = 'set' } = req.body; // action: 'set', 'add', 'subtract'

    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Update points based on action
    if (action === 'add') {
      member.points += parseInt(points);
    } else if (action === 'subtract') {
      member.points = Math.max(0, member.points - parseInt(points));
    } else {
      member.points = parseInt(points);
    }

    await member.save();

    res.json({
      success: true,
      message: 'Points updated successfully',
      member: member.toPublicProfile()
    });
  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating points',
      error: error.message
    });
  }
});

// @route   PUT /api/members/:id/role
// @desc    Update member role (admin only)
// @access  Private (admin)
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, isBureau } = req.body;

    const member = await User.findByIdAndUpdate(
      req.params.id,
      { role, isBureau },
      { new: true, runValidators: true }
    ).select('-password');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Role updated successfully',
      member
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
});

// @route   DELETE /api/members/:id
// @desc    Deactivate member (soft delete)
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member deactivated successfully'
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating member',
      error: error.message
    });
  }
});

module.exports = router;
