const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['Sport', 'Podcast', 'Social Events', 'Voyage', 'Social', 'Training', 'Other'],
    required: [true, 'Event category is required']
  },
  type: {
    type: String,
    enum: ['public', 'members-only', 'bureau-only'],
    default: 'public'
  },
  
  // Date and Location
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  
  // Media
  image: {
    type: String,
    default: '/events/default-event.jpg'
  },
  images: [{
    type: String
  }],
  
  // Registration
  maxParticipants: {
    type: Number,
    min: 1
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  waitlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  registrationDeadline: {
    type: Date
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  
  // Points system
  pointsReward: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Organizer
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Additional metadata
  tags: [{
    type: String,
    trim: true
  }],
  externalLink: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual for participant count
eventSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.maxParticipants) return null;
  return Math.max(0, this.maxParticipants - this.participants.length);
});

// Virtual for is full
eventSchema.virtual('isFull').get(function() {
  if (!this.maxParticipants) return false;
  return this.participants.length >= this.maxParticipants;
});

// Indexes
eventSchema.index({ startDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ participants: 1 });

// Method to register a user for the event
eventSchema.methods.registerUser = async function(userId) {
  // Check if already registered
  if (this.participants.includes(userId)) {
    throw new Error('User is already registered for this event');
  }
  
  // Check if event is full
  if (this.maxParticipants && this.participants.length >= this.maxParticipants) {
    // Add to waitlist
    if (!this.waitlist.includes(userId)) {
      this.waitlist.push(userId);
      await this.save();
    }
    throw new Error('Event is full. Added to waitlist.');
  }
  
  // Check registration deadline
  if (this.registrationDeadline && new Date() > this.registrationDeadline) {
    throw new Error('Registration deadline has passed');
  }
  
  // Register user
  this.participants.push(userId);
  await this.save();
  
  return this;
};

// Method to unregister a user
eventSchema.methods.unregisterUser = async function(userId) {
  this.participants = this.participants.filter(
    id => id.toString() !== userId.toString()
  );
  
  // Move first waitlist user to participants if space available
  if (this.waitlist.length > 0 && (!this.maxParticipants || this.participants.length < this.maxParticipants)) {
    const nextUserId = this.waitlist.shift();
    this.participants.push(nextUserId);
  }
  
  await this.save();
  return this;
};

module.exports = mongoose.model('Event', eventSchema);
