require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function resetPassword() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'dhiaguetiti@gmail.com';
    const newPassword = 'radioistic2025';

    console.log(`🔄 Resetting password for: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    // Update password (this will trigger the pre-save hook to hash it)
    user.password = newPassword;
    await user.save();

    console.log('✅ Password reset successfully!');
    console.log(`\nLogin with:`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${newPassword}\n`);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetPassword();
