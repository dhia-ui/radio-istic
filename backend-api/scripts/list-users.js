require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function listUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({}).select('firstName lastName email role isBureau coordonation').sort({ role: 1, lastName: 1 });

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                     ALL USERS IN DATABASE');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    console.log(`Total Users: ${users.length}\n`);

    // Group by role
    const roles = {
      'Admin': [],
      'Bureau Members': [],
      'Regular Members': []
    };

    users.forEach(user => {
      const userInfo = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        coordonation: user.coordonation || 'N/A'
      };

      if (user.role === 'admin') {
        roles['Admin'].push(userInfo);
      } else if (user.isBureau || ['president', 'vice-president', 'secretary', 'sponsor-manager', 'events-organizer', 'media-responsable'].includes(user.role)) {
        roles['Bureau Members'].push(userInfo);
      } else {
        roles['Regular Members'].push(userInfo);
      }
    });

    // Print Admin
    if (roles['Admin'].length > 0) {
      console.log('👑 ADMINISTRATORS');
      console.log('─────────────────────────────────────────────────────────────────');
      roles['Admin'].forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: radioistic2025`);
        console.log(`   👔 Role: ${user.role}`);
        console.log('');
      });
    }

    // Print Bureau
    if (roles['Bureau Members'].length > 0) {
      console.log('👥 BUREAU MEMBERS');
      console.log('─────────────────────────────────────────────────────────────────');
      roles['Bureau Members'].forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: radioistic2025`);
        console.log(`   👔 Role: ${user.role}`);
        console.log(`   🎯 Coordination: ${user.coordonation}`);
        console.log('');
      });
    }

    // Print Regular Members
    if (roles['Regular Members'].length > 0) {
      console.log('📋 REGULAR MEMBERS');
      console.log('─────────────────────────────────────────────────────────────────');
      roles['Regular Members'].forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: radioistic2025`);
        console.log(`   👔 Role: ${user.role}`);
        console.log('');
      });
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('\n💡 All passwords are set to: radioistic2025');
    console.log('   (Users can change their password after logging in)\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listUsers();
