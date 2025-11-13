const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  
  // Profile Information
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: '/avatars/default-avatar.jpg'
  },
  field: {
    type: String,
    enum: ['GLSI', 'IRS', 'LISI', 'LAI', 'IOT', 'LT'],
    required: [true, 'Field of study is required']
  },
  year: {
    type: Number,
    enum: [1, 2, 3],
    required: [true, 'Year is required']
  },
  motivation: {
    type: String,
    maxlength: 500
  },
  projects: {
    type: String,
    maxlength: 500
  },
  skills: {
    type: String,
    maxlength: 500
  },
  
  // Role & Permissions
  role: {
    type: String,
    enum: [
      'admin',
      'president',
      'vice-president',
      'secretary',
      'sponsor-manager',
      'events-organizer',
      'event-manager',
      'media-responsable',
      'rh-manager',
      'member',
      'guest'
    ],
    default: 'member'
  },
  isBureau: {
    type: Boolean,
    default: false
  },
  
  // Gamification
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  lastLogin: {
    type: Date
  },
  socketId: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Virtual for full name
userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.toPublicProfile = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ points: -1 }); // For leaderboard queries
userSchema.index({ field: 1, year: 1 }); // For filtering

module.exports = mongoose.model('User', userSchema);
