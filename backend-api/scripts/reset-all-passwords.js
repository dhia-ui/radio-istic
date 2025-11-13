require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function resetAllPasswords() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const newPassword = 'radioistic2025';
    
    console.log('🔄 Resetting passwords for ALL users...\n');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users\n`);

    let successCount = 0;
    let failCount = 0;

    // Reset password for each user
    for (const user of users) {
      try {
        user.password = newPassword; // This will trigger the pre-save hook to hash it
        await user.save();
        console.log(`✅ ${user.firstName} ${user.lastName} (${user.email})`);
        successCount++;
      } catch (error) {
        console.log(`❌ Failed for ${user.email}: ${error.message}`);
        failCount++;
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log(`✅ Successfully reset: ${successCount} users`);
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount} users`);
    }
    console.log('═══════════════════════════════════════════════\n');
    
    console.log('💡 All passwords are now: radioistic2025\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAllPasswords();
