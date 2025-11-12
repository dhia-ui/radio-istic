require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

async function fixActiveStatus() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔧 Adding isActive field to all users...\n');

    // Update all users without isActive field
    const result = await User.updateMany(
      { isActive: { $exists: false } },
      { $set: { isActive: true } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with isActive: true\n`);

    // Verify the update
    const allUsers = await User.find({}).select('firstName lastName isActive');
    const activeCount = allUsers.filter(u => u.isActive === true).length;
    const inactiveCount = allUsers.filter(u => u.isActive === false).length;
    const missingCount = allUsers.filter(u => u.isActive === undefined).length;

    console.log('📊 Final status:');
    console.log(`   Total users: ${allUsers.length}`);
    console.log(`   ✅ Active (isActive=true): ${activeCount}`);
    console.log(`   ❌ Inactive (isActive=false): ${inactiveCount}`);
    console.log(`   ⚠️  Missing isActive field: ${missingCount}`);

    if (missingCount === 0) {
      console.log('\n🎉 All users now have isActive field!');
      console.log('   Members will now appear in the portal!');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixActiveStatus();
