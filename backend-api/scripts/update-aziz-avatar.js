require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateAzizAvatar() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🖼️  Updating Aziz Mehri avatar...');
    
    // Find Aziz Mehri
    const aziz = await User.findOne({ 
      firstName: { $regex: 'Aziz', $options: 'i' },
      lastName: { $regex: 'Mehri', $options: 'i' }
    });

    if (aziz) {
      aziz.avatar = '/avatars/aziz-mehri.png';
      await aziz.save();
      console.log(`   ✅ Updated avatar for: ${aziz.firstName} ${aziz.lastName}`);
      console.log(`   📷 New avatar: /avatars/aziz-mehri.png`);
      console.log(`   👤 Email: ${aziz.email}`);
      console.log(`   🎭 Role: ${aziz.role}`);
    } else {
      console.log('   ⚠️  Aziz Mehri not found in database');
      
      // List all users with admin/bureau roles
      console.log('\n👥 Bureau members in database:');
      const bureauMembers = await User.find({ 
        role: { $in: ['admin', 'president', 'vice-president', 'treasurer', 'secretary'] }
      });
      bureauMembers.forEach(member => {
        console.log(`   • ${member.firstName} ${member.lastName} (${member.role})`);
      });
    }

    console.log('\n🎉 Avatar update completed!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating avatar:', error);
    process.exit(1);
  }
}

updateAzizAvatar();
