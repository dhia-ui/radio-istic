require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');

const events = [
  {
    title: "Tournoi de Ping-Pong ISTIC 2025",
    description: "Compétition de ping-pong entre membres. Montrez vos talents et gagnez des prix! Inscription limitée à 32 participants. Tournoi à élimination directe avec finales passionnantes.",
    category: "Sport",
    startDate: new Date('2025-12-15T14:00:00'),
    endDate: new Date('2025-12-15T18:00:00'),
    location: "Salle de Sport ISTIC",
    maxParticipants: 32,
    status: "published",
    image: "/events/ping-pong-tournament.jpg",
    pointsReward: 15,
    participants: []
  },
  {
    title: "Tournoi de Football Inter-Départements",
    description: "Grand tournoi de football entre les différents départements de l'ISTIC. Formez vos équipes et venez défendre les couleurs de votre département! Match amical suivi d'une remise de prix.",
    category: "Sport",
    startDate: new Date('2025-12-20T15:00:00'),
    endDate: new Date('2025-12-20T19:00:00'),
    location: "Terrain de Football ISTIC",
    maxParticipants: 50,
    status: "published",
    image: "/vibrant-football-tournament.png",
    pointsReward: 20,
    participants: []
  },
  {
    title: "Soirée Cinéma - Film Classique",
    description: "Projection d'un film classique dans notre salle de cinéma improvisée. Apportez vos amis, du popcorn sera fourni! Une soirée relaxante pour profiter d'un bon film ensemble.",
    category: "Social",
    startDate: new Date('2025-12-10T19:00:00'),
    endDate: new Date('2025-12-10T22:00:00'),
    location: "Amphithéâtre A",
    maxParticipants: 100,
    status: "published",
    image: "/events/cinema-night.jpg",
    pointsReward: 10,
    participants: []
  },
  {
    title: "Matchy Matchy - Speed Dating",
    description: "Événement de speed dating pour les membres de Radio ISTIC. Rencontrez de nouvelles personnes dans une ambiance conviviale et amusante! Jeux, discussions et opportunités de créer des liens.",
    category: "Social",
    startDate: new Date('2025-12-18T18:00:00'),
    endDate: new Date('2025-12-18T21:00:00'),
    location: "Salle des Événements ISTIC",
    maxParticipants: 60,
    status: "published",
    image: "/events/matchy-matchy.jpg",
    pointsReward: 12,
    participants: []
  },
  {
    title: "Soirée Musicale - Concert Live",
    description: "Soirée musicale avec performances live de nos membres talentueux. Musique, danse et ambiance festive garanties! Venez encourager vos camarades et profiter d'une soirée inoubliable.",
    category: "Social Events",
    startDate: new Date('2025-12-22T20:00:00'),
    endDate: new Date('2025-12-22T23:30:00'),
    location: "Grande Salle ISTIC",
    maxParticipants: 150,
    status: "published",
    image: "/events/soiree-event.jpg",
    pointsReward: 15,
    participants: []
  }
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get an admin or president user to use as organizer
    const adminUser = await User.findOne({ role: { $in: ['admin', 'president', 'vice-president'] } });
    
    if (!adminUser) {
      console.log('⚠️  No admin user found. Creating events with first available user...');
      const firstUser = await User.findOne();
      if (!firstUser) {
        console.error('❌ No users found in database. Please create a user first.');
        process.exit(1);
      }
      var organizerId = firstUser._id;
      console.log(`📋 Using user: ${firstUser.firstName} ${firstUser.lastName} (${firstUser.email})`);
    } else {
      var organizerId = adminUser._id;
      console.log(`📋 Using organizer: ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email})`);
    }

    // Clear existing events (optional - comment out if you want to keep existing events)
    // await Event.deleteMany({});
    // console.log('🗑️  Cleared existing events');

    // Check if events already exist
    for (const eventData of events) {
      const existingEvent = await Event.findOne({ title: eventData.title });
      
      if (existingEvent) {
        console.log(`⏭️  Event already exists: ${eventData.title}`);
        continue;
      }

      // Create event with organizer
      const event = await Event.create({
        ...eventData,
        organizer: organizerId
      });
      console.log(`✅ Created event: ${event.title}`);
    }

    console.log('\n🎉 Event seeding completed successfully!');
    console.log(`📊 Total events to add: ${events.length}`);
    
    // Display summary
    const totalEvents = await Event.countDocuments();
    console.log(`📈 Total events in database: ${totalEvents}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();
