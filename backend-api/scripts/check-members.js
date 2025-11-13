require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  field: String,
  year: Number,
  role: { type: String, default: 'member' },
  isActive: { type: Boolean, default: true },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkMembers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const allUsers = await User.find({}).select('firstName lastName email field year role isActive').sort({ createdAt: -1 });
    
    console.log(`📊 Total users in database: ${allUsers.length}\n`);

    // Count by role
    const members = allUsers.filter(u => u.role === 'member');
    const bureau = allUsers.filter(u => u.role !== 'member');
    
    console.log(`👥 Members: ${members.length}`);
    console.log(`⭐ Bureau: ${bureau.length}\n`);

    // Count by isActive
    const activeUsers = allUsers.filter(u => u.isActive !== false);
    const inactiveUsers = allUsers.filter(u => u.isActive === false);
    
    console.log(`✅ Active users: ${activeUsers.length}`);
    console.log(`❌ Inactive users: ${inactiveUsers.length}\n`);

    console.log('📝 Recent members added:');
    members.slice(0, 10).forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.firstName} ${member.lastName} (${member.email})`);
      console.log(`      Field: ${member.field} | Year: ${member.year} | Active: ${member.isActive !== false}`);
    });

    console.log('\n⭐ Bureau members:');
    bureau.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.firstName} ${member.lastName} - ${member.role}`);
    });

    // Check if isActive field exists
    console.log('\n🔍 Checking isActive field...');
    const membersWithoutActive = await User.find({ isActive: { $exists: false } }).countDocuments();
    const membersWithActiveFalse = await User.find({ isActive: false }).countDocuments();
    
    console.log(`   Users without isActive field: ${membersWithoutActive}`);
    console.log(`   Users with isActive=false: ${membersWithActiveFalse}`);

    if (membersWithoutActive > 0) {
      console.log('\n⚠️  Some users are missing the isActive field!');
      console.log('   This might cause them to be filtered out by the API.');
    }

    mongoose.connection.close();
    console.log('\n🎉 Check completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMembers();
