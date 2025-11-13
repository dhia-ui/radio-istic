require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

async function removeSoireeMusicale() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🗑️  Removing Soirée Musicale...');
    
    // Remove Soirée Musicale event
    const result = await Event.deleteMany({ 
      title: { $regex: 'Soirée Musicale', $options: 'i' } 
    });

    if (result.deletedCount > 0) {
      console.log(`   ✅ Deleted: Soirée Musicale (${result.deletedCount} event(s))`);
    } else {
      console.log('   ⚠️  Soirée Musicale not found');
    }

    // Display remaining events
    console.log('\n📊 Current events in database:');
    const allEvents = await Event.find().sort({ startDate: 1 });
    allEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title}`);
      console.log(`      📅 ${event.startDate.toLocaleDateString('fr-FR')}`);
      console.log(`      📍 ${event.location}`);
    });

    console.log(`\n✅ Total events: ${allEvents.length}`);
    console.log('🎉 Removal completed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during removal:', error);
    process.exit(1);
  }
}

removeSoireeMusicale();
