require('dotenv').config();
const mongoose = require('mongoose');

async function checkConfig() {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║  Radio ISTIC - Configuration Check       ║');
  console.log('╚═══════════════════════════════════════════╝\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✓ MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`✓ JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`✓ PORT: ${process.env.PORT || '5000 (default)'}`);
  console.log(`✓ CORS_ORIGIN: ${process.env.CORS_ORIGIN || 'http://localhost:3000 (default)'}\n`);

  if (!process.env.MONGODB_URI) {
    console.log('❌ ERROR: MONGODB_URI is not set in .env file!');
    console.log('   Please check backend-api/.env file\n');
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.log('❌ ERROR: JWT_SECRET is not set in .env file!');
    console.log('   Please check backend-api/.env file\n');
    return;
  }

  // Test MongoDB connection
  console.log('🔌 Testing MongoDB Connection:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}\n`);

    // Check collections
    console.log('📁 Collections:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count} documents`);
    }
    
    await mongoose.connection.close();
    
    console.log('\n✅ All configuration checks passed!');
    console.log('\n🚀 You can now start the backend server:');
    console.log('   cd backend-api');
    console.log('   node server.js\n');
    
  } catch (error) {
    console.log(`❌ MongoDB Connection Failed!`);
    console.log(`   Error: ${error.message}\n`);
  }
}

checkConfig();
