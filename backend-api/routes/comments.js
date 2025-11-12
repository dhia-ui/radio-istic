const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Le commentaire ne peut pas être vide')
    .isLength({ max: 1000 }).withMessage('Le commentaire ne peut pas dépasser 1000 caractères'),
];

const validateCommentId = [
  param('commentId').isMongoId().withMessage('ID de commentaire invalide')
];

const validateEventId = [
  param('eventId').isMongoId().withMessage('ID d\'événement invalide')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @route   GET /api/comments/event/:eventId
 * @desc    Get all comments for an event
 * @access  Public
 */
router.get('/event/:eventId', validateEventId, handleValidationErrors, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    // Get comments with pagination
    const comments = await Comment.find({ eventId, replyTo: null }) // Only top-level comments
      .populate('userId', 'name avatar email')
      .populate({
        path: 'replies',
        populate: {
          path: 'userId',
          select: 'name avatar email'
        }
      })
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Comment.countDocuments({ eventId, replyTo: null });

    res.json({
      success: true,
      data: comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commentaires',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/comments/event/:eventId
 * @desc    Add a comment to an event
 * @access  Private
 */
router.post(
  '/event/:eventId',
  protect,
  validateEventId,
  validateComment,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { content, replyTo } = req.body;
      const userId = req.user._id;

      // Check if event exists
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Événement non trouvé'
        });
      }

      // If it's a reply, check if parent comment exists
      if (replyTo) {
        const parentComment = await Comment.findById(replyTo);
        if (!parentComment) {
          return res.status(404).json({
            success: false,
            message: 'Commentaire parent non trouvé'
          });
        }
      }

      // Create comment
      const comment = await Comment.create({
        eventId,
        userId,
        userName: req.user.name,
        userAvatar: req.user.avatar || req.user.photo,
        content,
        replyTo: replyTo || null
      });

      // If it's a reply, add to parent's replies array
      if (replyTo) {
        await Comment.findByIdAndUpdate(replyTo, {
          $push: { replies: comment._id }
        });
      }

      // Populate user data
      const populatedComment = await Comment.findById(comment._id)
        .populate('userId', 'name avatar email');

      res.status(201).json({
        success: true,
        data: populatedComment,
        message: 'Commentaire ajouté avec succès'
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajout du commentaire',
        error: error.message
      });
    }
  }
);

/**
 * @route   PUT /api/comments/:commentId
 * @desc    Edit a comment
 * @access  Private (own comments only)
 */
router.put(
  '/:commentId',
  protect,
  validateCommentId,
  validateComment,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = req.user._id;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }

      // Check if user owns the comment
      if (comment.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Non autorisé à modifier ce commentaire'
        });
      }

      // Update comment
      comment.content = content;
      comment.edited = true;
      comment.editedAt = new Date();
      await comment.save();

      const populatedComment = await Comment.findById(comment._id)
        .populate('userId', 'name avatar email');

      res.json({
        success: true,
        data: populatedComment,
        message: 'Commentaire modifié avec succès'
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification du commentaire',
        error: error.message
      });
    }
  }
);

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete a comment
 * @access  Private (own comments only)
 */
router.delete(
  '/:commentId',
  protect,
  validateCommentId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }

      // Check if user owns the comment
      if (comment.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Non autorisé à supprimer ce commentaire'
        });
      }

      // Delete all replies first
      if (comment.replies && comment.replies.length > 0) {
        await Comment.deleteMany({ _id: { $in: comment.replies } });
      }

      // Remove from parent's replies array if it's a reply
      if (comment.replyTo) {
        await Comment.findByIdAndUpdate(comment.replyTo, {
          $pull: { replies: comment._id }
        });
      }

      // Delete the comment
      await Comment.findByIdAndDelete(commentId);

      res.json({
        success: true,
        message: 'Commentaire supprimé avec succès'
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du commentaire',
        error: error.message
      });
    }
  }
);

/**
 * @route   POST /api/comments/:commentId/like
 * @desc    Like/unlike a comment
 * @access  Private
 */
router.post(
  '/:commentId/like',
  protect,
  validateCommentId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Commentaire non trouvé'
        });
      }

      // Toggle like
      const likeIndex = comment.likes.indexOf(userId);
      let action = '';
      
      if (likeIndex === -1) {
        // Add like
        comment.likes.push(userId);
        action = 'liked';
      } else {
        // Remove like
        comment.likes.splice(likeIndex, 1);
        action = 'unliked';
      }

      await comment.save();

      const populatedComment = await Comment.findById(comment._id)
        .populate('userId', 'name avatar email');

      res.json({
        success: true,
        data: populatedComment,
        action,
        message: action === 'liked' ? 'Commentaire aimé' : 'Like retiré'
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du like',
        error: error.message
      });
    }
  }
);

module.exports = router;
