require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  field: String,
  year: Number,
  role: { type: String, default: 'member' },
  isBureau: Boolean,
  avatar: String,
  motivation: String,
  projects: String,
  skills: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function updateBureau() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Reset all bureau members to regular members (except Aziz Mehri - president)
    console.log('🔄 Resetting bureau members to regular members...');
    const resetResult = await User.updateMany(
      { 
        role: { $nin: ['president', 'member'] },
        email: { $ne: 'aziz.mehri@istic.rnu.tn' }
      },
      { 
        $set: { 
          role: 'member',
          isBureau: false
        }
      }
    );
    console.log(`   Reset ${resetResult.modifiedCount} users to regular members\n`);

    // 2. Update or create Aziz Wertani (Event Manager)
    console.log('👤 Updating Aziz Wertani...');
    const azizWertani = await User.findOne({ email: 'aziz.wertani96@gmail.com' });
    
    if (azizWertani) {
      azizWertani.phone = '96615902';
      azizWertani.role = 'event-manager';
      azizWertani.isBureau = true;
      azizWertani.motivation = 'Organise events to make it work without problems';
      azizWertani.skills = 'Event management, organization, problem solving';
      azizWertani.isActive = true;
      await azizWertani.save();
      console.log(`   ✅ Updated: Aziz Wertani - event-manager`);
    } else {
      const defaultPassword = await bcrypt.hash('radioistic2025', 10);
      const newAzizWertani = new User({
        firstName: 'Aziz',
        lastName: 'Wertani',
        email: 'aziz.wertani96@gmail.com',
        password: defaultPassword,
        phone: '96615902',
        field: 'GLSI',
        year: 3,
        role: 'event-manager',
        isBureau: true,
        motivation: 'Organise events to make it work without problems',
        skills: 'Event management, organization, problem solving',
        avatar: '/avatars/default-avatar.png',
        isActive: true
      });
      await newAzizWertani.save();
      console.log(`   ✅ Created: Aziz Wertani - event-manager`);
    }

    // 3. Update or create Amal Mahsni (RH)
    console.log('👤 Updating Amal Mahsni...');
    const amalMahsni = await User.findOne({ email: 'amoulamahsni@gmail.com' });
    
    if (amalMahsni) {
      amalMahsni.firstName = 'Amal';
      amalMahsni.lastName = 'Mahsni';
      amalMahsni.phone = '53560405';
      amalMahsni.role = 'rh-manager';
      amalMahsni.isBureau = true;
      amalMahsni.motivation = 'Améliorer l\'ambiance et l\'organisation du club';
      amalMahsni.projects = 'Structurer le recrutement, suivre les membres et renforcer l\'esprit d\'équipe';
      amalMahsni.skills = 'Communication, organisation et gestion d\'équipe';
      amalMahsni.isActive = true;
      await amalMahsni.save();
      console.log(`   ✅ Updated: Amal Mahsni - rh-manager`);
    } else {
      const defaultPassword = await bcrypt.hash('radioistic2025', 10);
      const newAmalMahsni = new User({
        firstName: 'Amal',
        lastName: 'Mahsni',
        email: 'amoulamahsni@gmail.com',
        password: defaultPassword,
        phone: '53560405',
        field: 'GLSI',
        year: 3,
        role: 'rh-manager',
        isBureau: true,
        motivation: 'Améliorer l\'ambiance et l\'organisation du club',
        projects: 'Structurer le recrutement, suivre les membres et renforcer l\'esprit d\'équipe',
        skills: 'Communication, organisation et gestion d\'équipe',
        avatar: '/avatars/default-avatar.png',
        isActive: true
      });
      await newAmalMahsni.save();
      console.log(`   ✅ Created: Amal Mahsni - rh-manager`);
    }

    // 4. Verify Aziz Mehri (President) is still there
    console.log('👤 Verifying Aziz Mehri (President)...');
    const azizMehri = await User.findOne({ email: 'aziz.mehri@istic.rnu.tn' });
    if (azizMehri) {
      console.log(`   ✅ Confirmed: Aziz Mehri - president\n`);
    }

    // 5. Display final bureau composition
    console.log('📊 Final Bureau Composition:');
    const bureauMembers = await User.find({ 
      $or: [
        { role: 'president' },
        { isBureau: true }
      ]
    }).select('firstName lastName email phone role');

    bureauMembers.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.firstName} ${member.lastName}`);
      console.log(`      Email: ${member.email}`);
      console.log(`      Phone: ${member.phone}`);
      console.log(`      Role: ${member.role}`);
      console.log('');
    });

    console.log(`✅ Total Bureau Members: ${bureauMembers.length}`);

    mongoose.connection.close();
    console.log('\n🎉 Bureau updated successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateBureau();
