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
  coordonation: String,
  motivation: String,
  projects: String,
  skills: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function updateBureauTeam() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const defaultPassword = await bcrypt.hash('radioistic2025', 10);

    // Bureau Members to add/update
    const bureauMembers = [
      {
        firstName: 'Dhia Eddine',
        lastName: 'Ktiti',
        email: 'dhiaguetiti@gmail.com',
        phone: '92454120',
        field: 'GLSI',
        year: 3,
        role: 'media-manager',
        coordonation: 'Responsable Média',
        motivation: 'Créer du contenu visuel de qualité pour le club',
        projects: 'Design des affiches, gestion des réseaux sociaux, création de contenu',
        skills: 'Photoshop, Illustrator, Design graphique'
      },
      {
        firstName: 'Balkis',
        lastName: 'Slimen',
        email: 'balkis.slimen@istic.rnu.tn',
        phone: '',
        field: 'GLSI',
        year: 3,
        role: 'secretary-general',
        coordonation: 'Secrétaire Général',
        motivation: 'Assurer la coordination et l\'organisation du bureau',
        projects: 'Gestion administrative, comptes-rendus, suivi des activités',
        skills: 'Organisation, rédaction, communication'
      },
      {
        firstName: 'Nassim',
        lastName: 'Ben Mrad',
        email: 'nassim.benmrad@istic.rnu.tn',
        phone: '',
        field: 'GLSI',
        year: 3,
        role: 'vice-president',
        coordonation: 'Vice-Président',
        motivation: 'Soutenir la direction et développer les activités du club',
        projects: 'Stratégie du club, développement des partenariats',
        skills: 'Leadership, stratégie, gestion de projet'
      },
      {
        firstName: 'Mohamed',
        lastName: 'Sehly',
        email: 'mohamed.sehly@istic.rnu.tn',
        phone: '',
        field: 'GLSI',
        year: 3,
        role: 'sponsor-manager',
        coordonation: 'Responsable Sponsors',
        motivation: 'Développer les partenariats et sponsorships',
        projects: 'Prospection sponsors, négociation, suivi partenariats',
        skills: 'Négociation, communication commerciale, networking'
      },
      {
        firstName: 'Aymen',
        lastName: 'Ksouri',
        email: 'aymen.ksouri@istic.rnu.tn',
        phone: '',
        field: 'GLSI',
        year: 3,
        role: 'event-manager',
        coordonation: 'Responsable Événements',
        motivation: 'Organiser des événements mémorables pour les membres',
        projects: 'Organisation événements, logistique, coordination équipes',
        skills: 'Organisation, gestion de projet, créativité'
      }
    ];

    console.log('📝 Adding/Updating Bureau Members...\n');

    for (const memberData of bureauMembers) {
      const existingMember = await User.findOne({ email: memberData.email });
      
      if (existingMember) {
        // Update existing member
        existingMember.firstName = memberData.firstName;
        existingMember.lastName = memberData.lastName;
        existingMember.phone = memberData.phone || existingMember.phone;
        existingMember.field = memberData.field;
        existingMember.year = memberData.year;
        existingMember.role = memberData.role;
        existingMember.coordonation = memberData.coordonation;
        existingMember.isBureau = true;
        existingMember.motivation = memberData.motivation;
        existingMember.projects = memberData.projects;
        existingMember.skills = memberData.skills;
        existingMember.isActive = true;
        
        await existingMember.save();
        console.log(`   ✅ Updated: ${memberData.firstName} ${memberData.lastName} - ${memberData.role}`);
      } else {
        // Create new member
        const newMember = new User({
          ...memberData,
          password: defaultPassword,
          isBureau: true,
          avatar: '/avatars/default-avatar.png',
          isActive: true
        });
        
        await newMember.save();
        console.log(`   ✅ Created: ${memberData.firstName} ${memberData.lastName} - ${memberData.role}`);
      }
    }

    // Display final bureau composition
    console.log('\n📊 Complete Bureau Team:');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const allBureauMembers = await User.find({ 
      $or: [
        { role: 'president' },
        { isBureau: true }
      ]
    }).select('firstName lastName email phone role coordonation').sort({ role: -1 });

    allBureauMembers.forEach((member, index) => {
      console.log(`${index + 1}. ${member.firstName} ${member.lastName}`);
      console.log(`   📧 Email: ${member.email}`);
      if (member.phone) console.log(`   📞 Phone: ${member.phone}`);
      console.log(`   👔 Role: ${member.role}`);
      console.log(`   🎯 Coordination: ${member.coordonation || 'N/A'}`);
      console.log('');
    });

    console.log(`✅ Total Bureau Members: ${allBureauMembers.length}`);
    console.log('═══════════════════════════════════════════════════════\n');

    mongoose.connection.close();
    console.log('🎉 Bureau team updated successfully!');
    console.log('\n💡 Default password for new members: radioistic2025');
    console.log('   (Please ask them to change it on first login)\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateBureauTeam();
