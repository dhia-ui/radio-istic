const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Event = require('../models/Event');
const connectDB = require('../config/database');

// Sample members data
const members = [
  {
    firstName: 'Aziz',
    lastName: 'Mehri',
    email: 'aziz.mehri@istic.rnu.tn',
    password: 'password123',
    phone: '+216 20 123 456',
    field: 'GLSI',
    year: 3,
    role: 'president',
    isBureau: true,
    points: 1500,
    avatar: '/avatars/aziz-mehri.png',
    motivation: 'Passionate about leading Radio ISTIC to new heights',
    projects: ['Radio Management', 'Event Organization'],
    skills: ['Leadership', 'Communication', 'Project Management'],
    isActive: true,
    status: 'offline'
  },
  {
    firstName: 'Eya',
    lastName: 'Ssekk',
    email: 'eya.ssekk@istic.rnu.tn',
    password: 'password123',
    phone: '+216 20 234 567',
    field: 'IRS',
    year: 3,
    role: 'vice-president',
    isBureau: true,
    points: 1400,
    avatar: '/avatars/eya-ssekk.png',
    motivation: 'Dedicated to managing operations and community engagement',
    projects: ['Member Relations', 'Social Media'],
    skills: ['Management', 'Marketing', 'Team Building'],
    isActive: true,
    status: 'offline'
  },
  {
    firstName: 'Mohamed',
    lastName: 'Ben Ali',
    email: 'mohamed.benali@istic.rnu.tn',
    password: 'password123',
    phone: '+216 20 345 678',
    field: 'LISI',
    year: 2,
    role: 'treasurer',
    isBureau: true,
    points: 1200,
    avatar: '/avatars/default-male.png',
    motivation: 'Managing finances and ensuring sustainability',
    projects: ['Budget Management', 'Sponsorship'],
    skills: ['Finance', 'Excel', 'Planning'],
    isActive: true,
    status: 'offline'
  },
  {
    firstName: 'Salma',
    lastName: 'Trabelsi',
    email: 'salma.trabelsi@istic.rnu.tn',
    password: 'password123',
    phone: '+216 20 456 789',
    field: 'LAI',
    year: 2,
    role: 'secretary',
    isBureau: true,
    points: 1100,
    avatar: '/avatars/default-female.png',
    motivation: 'Organizing and documenting club activities',
    projects: ['Documentation', 'Meeting Minutes'],
    skills: ['Organization', 'Writing', 'Time Management'],
    isActive: true,
    status: 'offline'
  },
  {
    firstName: 'Yassine',
    lastName: 'Khelifi',
    email: 'yassine.khelifi@istic.rnu.tn',
    password: 'password123',
    phone: '+216 20 567 890',
    field: 'IOT',
    year: 2,
    role: 'technical-lead',
    isBureau: true,
    points: 1300,
    avatar: '/avatars/default-male.png',
    motivation: 'Building technical infrastructure for the club',
    projects: ['Website', 'Audio Equipment'],
    skills: ['Programming', 'Electronics', 'Problem Solving'],
    isActive: true,
    status: 'offline'
  },
  // Regular members
  {
    firstName: 'Amira',
    lastName: 'Hammami',
    email: 'amira.hammami@istic.rnu.tn',
    password: 'password123',
    phone: '+216 20 678 901',
    field: 'GLSI',
    year: 1,
    role: 'member',
    isBureau: false,
    points: 500,
    avatar: '/avatars/default-female.png',
    motivation: 'Excited to be part of Radio ISTIC',
    projects: [],
    skills: ['Writing', 'Creativity'],
    isActive: true,
    status: 'offline'
  },
  {
    firstName: 'Karim',
    lastName: 'Jebali',
    email: 'karim.jebali@istic.rnu.tn',
    password: 'password123',
    phone: '+216 20 789 012',
    field: 'IRS',
    year: 1,
    role: 'member',
    isBureau: false,
    points: 450,
    avatar: '/avatars/default-male.png',
    motivation: 'Passionate about radio broadcasting',
    projects: [],
    skills: ['Voice', 'Audio Editing'],
    isActive: true,
    status: 'offline'
  },
  {
    firstName: 'Nour',
    lastName: 'Sassi',
    email: 'nour.sassi@istic.rnu.tn',
    password: 'password123',
    phone: '+216 20 890 123',
    field: 'LISI',
    year: 1,
    role: 'member',
    isBureau: false,
    points: 400,
    avatar: '/avatars/default-female.png',
    motivation: 'Learning about media and communication',
    projects: [],
    skills: ['Social Media', 'Design'],
    isActive: true,
    status: 'offline'
  }
];

// Sample events data
const events = [
  {
    title: 'Radio ISTIC Launch Party 2024',
    description: 'Celebrating the launch of our new radio station with live music, games, and special guests!',
    date: new Date('2024-12-15T18:00:00Z'),
    location: 'ISTIC Main Auditorium',
    image: '/events/launch-party.jpg',
    category: 'social',
    maxParticipants: 200,
    registrationDeadline: new Date('2024-12-10T23:59:59Z'),
    status: 'upcoming',
    organizers: [], // Will be populated with user IDs
    participants: [],
    isPublic: true
  },
  {
    title: 'Podcast Recording Workshop',
    description: 'Learn the art of podcast recording, editing, and publishing. Hands-on workshop with professional equipment.',
    date: new Date('2024-12-01T14:00:00Z'),
    location: 'Radio ISTIC Studio',
    image: '/events/workshop.jpg',
    category: 'workshop',
    maxParticipants: 20,
    registrationDeadline: new Date('2024-11-28T23:59:59Z'),
    status: 'upcoming',
    organizers: [],
    participants: [],
    isPublic: true
  },
  {
    title: 'Annual Radio Competition',
    description: 'Compete with other members to create the best radio show! Prizes for top 3 winners.',
    date: new Date('2025-01-20T10:00:00Z'),
    location: 'ISTIC Campus',
    image: '/events/competition.jpg',
    category: 'competition',
    maxParticipants: 50,
    registrationDeadline: new Date('2025-01-15T23:59:59Z'),
    status: 'upcoming',
    organizers: [],
    participants: [],
    isPublic: true
  },
  {
    title: 'Welcome Freshman Event',
    description: 'Welcome new students to ISTIC! Meet the team, learn about our club, and enjoy free snacks.',
    date: new Date('2024-09-25T16:00:00Z'),
    location: 'ISTIC Courtyard',
    image: '/events/welcome.jpg',
    category: 'social',
    maxParticipants: 150,
    registrationDeadline: new Date('2024-09-20T23:59:59Z'),
    status: 'completed',
    organizers: [],
    participants: [],
    isPublic: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Event.deleteMany({});
    
    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(members);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Get bureau member IDs for event organizers
    const bureauMembers = createdUsers.filter(u => u.isBureau);
    const organizerIds = bureauMembers.slice(0, 2).map(u => u._id);
    
    // Add organizers to events
    const eventsWithOrganizers = events.map(event => ({
      ...event,
      organizers: organizerIds
    }));
    
    // Create events
    console.log('📅 Creating events...');
    const createdEvents = await Event.create(eventsWithOrganizers);
    console.log(`✅ Created ${createdEvents.length} events`);
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Bureau Members: ${bureauMembers.length}`);
    console.log(`   - Regular Members: ${createdUsers.length - bureauMembers.length}`);
    console.log(`   - Events: ${createdEvents.length}`);
    console.log('\n🔐 Default password for all users: password123');
    console.log('\n👤 Test accounts:');
    console.log('   President: aziz.mehri@istic.rnu.tn / password123');
    console.log('   Vice President: eya.ssekk@istic.rnu.tn / password123');
    console.log('   Member: amira.hammami@istic.rnu.tn / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();
