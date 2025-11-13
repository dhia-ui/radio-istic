require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

async function cleanupEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Events to remove
    const eventsToRemove = [
      'Radio ISTIC Launch Party 2025',
      'Annual Radio Competition',
      'Radio ISTIC Launch Party',
      'Annual Radio Competition 2025',
    ];

    console.log('\n🗑️  Removing unwanted events...');
    
    for (const eventTitle of eventsToRemove) {
      const result = await Event.deleteMany({ 
        title: { $regex: eventTitle, $options: 'i' } 
      });
      if (result.deletedCount > 0) {
        console.log(`   ❌ Deleted: ${eventTitle} (${result.deletedCount} event(s))`);
      } else {
        console.log(`   ⏭️  Not found: ${eventTitle}`);
      }
    }

    // Update Matchy Matchy image to use speed dating students photo
    console.log('\n🖼️  Updating Matchy Matchy image...');
    
    const matchyEvent = await Event.findOne({ 
      title: { $regex: 'Matchy', $options: 'i' } 
    });

    if (matchyEvent) {
      matchyEvent.image = '/events/matchy-matchy.jpg'; // Speed dating students image
      await matchyEvent.save();
      console.log(`   ✅ Updated: ${matchyEvent.title}`);
      console.log(`   📷 New image: /events/matchy-matchy.jpg`);
    } else {
      console.log('   ⚠️  Matchy Matchy event not found');
    }

    // Display remaining events
    console.log('\n📊 Current events in database:');
    const allEvents = await Event.find().sort({ startDate: 1 });
    allEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title}`);
      console.log(`      📅 ${event.startDate.toLocaleDateString('fr-FR')}`);
      console.log(`      📍 ${event.location}`);
      console.log(`      🖼️  ${event.image || 'No image'}`);
    });

    console.log(`\n✅ Total events: ${allEvents.length}`);
    console.log('🎉 Cleanup completed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupEvents();
