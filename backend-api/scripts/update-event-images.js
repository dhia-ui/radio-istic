require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

async function updateEventImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🖼️  Updating event images...\n');

    // Update Podcast Recording Workshop
    const podcastEvent = await Event.findOne({ 
      title: { $regex: 'Podcast Recording Workshop', $options: 'i' } 
    });
    if (podcastEvent) {
      podcastEvent.image = '/podcast-studio-recording.jpg';
      await podcastEvent.save();
      console.log('   ✅ Podcast Recording Workshop');
      console.log('      📷 Image: /podcast-studio-recording.jpg');
    }

    // Update Soirée Musicale
    const soireeEvent = await Event.findOne({ 
      title: { $regex: 'Soirée Musicale', $options: 'i' } 
    });
    if (soireeEvent) {
      soireeEvent.image = '/events/soiree-event.jpg';
      await soireeEvent.save();
      console.log('   ✅ Soirée Musicale - Concert Live');
      console.log('      📷 Image: /events/soiree-event.jpg');
    }

    // Update Welcome Freshman Event
    const welcomeEvent = await Event.findOne({ 
      title: { $regex: 'Welcome Freshman', $options: 'i' } 
    });
    if (welcomeEvent) {
      welcomeEvent.image = '/student-life-vlog-campus.jpg';
      await welcomeEvent.save();
      console.log('   ✅ Welcome Freshman Event');
      console.log('      📷 Image: /student-life-vlog-campus.jpg');
    }

    console.log('\n📊 Updated Events Summary:');
    const allEvents = await Event.find().sort({ startDate: 1 });
    allEvents.forEach((event, index) => {
      console.log(`\n   ${index + 1}. ${event.title}`);
      console.log(`      📅 ${event.startDate.toLocaleDateString('fr-FR')}`);
      console.log(`      📍 ${event.location}`);
      console.log(`      🖼️  ${event.image || '❌ No image'}`);
    });

    console.log(`\n✅ Total events: ${allEvents.length}`);
    console.log('🎉 Image updates completed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

updateEventImages();
