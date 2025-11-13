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
  motivation: String,
  projects: String,
  skills: String,
  role: { type: String, default: 'member' },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const members = [
  {
    firstName: "Maram",
    lastName: "El kamel",
    email: "eikametmaramf6@gmail.com",
    phone: "21687503",
    field: "GLSI",
    year: 3,
    motivation: "3ajjaw",
    projects: "Podcast anonyme (with voice changer and no names) topics: 'istic hater vibe'",
    skills: "Tbh barcha hajet"
  },
  {
    firstName: "Miniar",
    lastName: "Mahar",
    email: "mnimmina0@gmail.com",
    phone: "50827899",
    field: "GLSI",
    year: 3,
    motivation: ".",
    projects: ".",
    skills: "."
  },
  {
    firstName: "Amen",
    lastName: "Amon",
    email: "amenkhalfi0@gmail.com",
    phone: "20041436",
    field: "GLSI",
    year: 3,
    motivation: "Manedrouch",
    projects: "Podcast m3a ai version men Shrek",
    skills: "."
  },
  {
    firstName: "Abdallah",
    lastName: "Aksislah",
    email: "zreliLabdullah19@gmail.com",
    phone: "52623729",
    field: "GLSI",
    year: 3,
    motivation: "3al zab",
    projects: "Basketball Tournament",
    skills: "."
  },
  {
    firstName: "Adam",
    lastName: "Kaboubi",
    email: "Ademkaboub54@gmail.com",
    phone: "95268116",
    field: "GLSI",
    year: 3,
    motivation: "For fun",
    projects: ".",
    skills: "."
  },
  {
    firstName: "Malek",
    lastName: "Ben zalee",
    email: "Malekkaaeo@gmail.com",
    phone: "24119359",
    field: "IRS",
    year: 2,
    motivation: ".",
    projects: ".",
    skills: "."
  },
  {
    firstName: "Anas",
    lastName: "Kiskat",
    email: "anekskaks19@gmail.com",
    phone: "95631632",
    field: "GLSI",
    year: 3,
    motivation: ".",
    projects: ".",
    skills: "."
  },
  {
    firstName: "Ghrir",
    lastName: "Yomma",
    email: "yomengivir107@gmail.com",
    phone: "51787812",
    field: "GLSI",
    year: 2,
    motivation: "Aymen(isamm) 9ali",
    projects: ".",
    skills: "Sport (musculation) peinture"
  },
  {
    firstName: "Amin",
    lastName: "Silit",
    email: "aminist004@gmail.com",
    phone: "29300254",
    field: "GLSI",
    year: 3,
    motivation: "N7eb azouz",
    projects: "Camera cache",
    skills: "."
  },
  {
    firstName: "Mohamed Khalil",
    lastName: "Denouche",
    email: "Kobroula0@gmail.com",
    phone: "29084198",
    field: "GLSI",
    year: 1,
    motivation: "Pour développer mes compétences",
    projects: "..",
    skills: "Dynamique créatif"
  },
  {
    firstName: "Mohamed",
    lastName: "Selby",
    email: "medsair8915@gmail.com",
    phone: "99123371",
    field: "GLSI",
    year: 1,
    motivation: "To have fun",
    projects: "Micro trottoir ou matchy version istic",
    skills: "Cyber security and social activities"
  },
  {
    firstName: "Youssef",
    lastName: "Agnbi",
    email: "youssefeph250@gmail.com",
    phone: "29638940",
    field: "GLSI",
    year: 3,
    motivation: "Améliorez la vie associative au sein de l'institut",
    projects: ".",
    skills: "Communication, résolution des problèmes, créativité"
  },
  {
    firstName: "Eya",
    lastName: "Ssekk",
    email: "eyasseok74@gmail.com",
    phone: "55087415",
    field: "GLSI",
    year: 3,
    motivation: "Pour être actif dans la vie du campus",
    projects: "Tournoi rami/ ri7la lblasa 5adhra/ soirée sans alcool",
    skills: "Communication, Planning"
  },
  {
    firstName: "Elaa",
    lastName: "Chaamashi",
    email: "Chaamashikeba@gmail.com",
    phone: "52513777",
    field: "GLSI",
    year: 3,
    motivation: "Les ahbeb",
    projects: "Musique",
    skills: "."
  },
  {
    firstName: "Andel",
    lastName: "Belgacemi",
    email: "andelpasemi@gmail.com",
    phone: "94601187",
    field: "GLSI",
    year: 3,
    motivation: "New experience and self emprov",
    projects: "Podcast",
    skills: "Eager to learn everything"
  },
  {
    firstName: "Nour",
    lastName: "Manal",
    email: "Noormanal456@gmail.com",
    phone: "26594408",
    field: "LISI",
    year: 1,
    motivation: "Pour être plus active",
    projects: "Podcast",
    skills: "."
  },
  {
    firstName: "Mira",
    lastName: "Oueritalani",
    email: "miragc2006@gmail.com",
    phone: "21654440",
    field: "GLSI",
    year: 1,
    motivation: "Khater barcha jaww",
    projects: "Youmiyat bakaloria istic",
    skills: "Public speaking, na3rf nsafa9, barcha jaww"
  },
  {
    firstName: "Arij",
    lastName: "Yahyaoui",
    email: "yahyaouiarijyahyaoui@gmail.com",
    phone: "28287686",
    field: "GLSI",
    year: 1,
    motivation: "Il semble intéressant",
    projects: "Pas encore",
    skills: "Toujours actif"
  },
  {
    firstName: "Feryel",
    lastName: "Mekli",
    email: "feryelmekhi0@gmail.com",
    phone: "96573828",
    field: "GLSI",
    year: 2,
    motivation: "....",
    projects: "....",
    skills: "."
  },
  {
    firstName: "Med Ali",
    lastName: "Bilibas",
    email: "dali.kabin.007@gmail.com",
    phone: "59607495",
    field: "GLSI",
    year: 1,
    motivation: "Yes",
    projects: "Yes",
    skills: "."
  },
  {
    firstName: "Gabsi",
    lastName: "Ilef",
    email: "Ilefgabsi465@gmail.com",
    phone: "52234837",
    field: "LAI",
    year: 2,
    motivation: ".n",
    projects: ".n",
    skills: "."
  },
  {
    firstName: "Mariem",
    lastName: "Sasi",
    email: "sittimariemi@gmail.com",
    phone: "93087209",
    field: "IOT",
    year: 2,
    motivation: "Meb3a nassim",
    projects: "Hata idee",
    skills: "Presentation"
  },
  {
    firstName: "Mustapha",
    lastName: "Sahli",
    email: "mustafasahli199@gmail.com",
    phone: "54520805",
    field: "LT",
    year: 1,
    motivation: "Jaw",
    projects: "Podcast avec partie por hight tck news hajet t5os tranche dage mta3 les etudiant",
    skills: "Barcha jaw"
  },
  {
    firstName: "Amal",
    lastName: "Maheni",
    email: "amoulamahani@gmail.com",
    phone: "53580405",
    field: "GLSI",
    year: 3,
    motivation: "Oui",
    projects: "Emission small business et emission news",
    skills: "."
  },
  {
    firstName: "Sinda",
    lastName: "Chekir",
    email: "sindachekir1808@gmail.com",
    phone: "22560499",
    field: "GLSI",
    year: 1,
    motivation: "Je veux rejoindre Radio ISTIC pour découvrir le monde des médias et voir ce qui me plaît le plus. Je n'ai pas encore d'expérience, mais je suis très motivée à apprendre, à essayer de nouvelles choses et à développer ma créativité.",
    projects: "Pour l'instant, je n'ai pas encore d'idée précise, mais j'aimerais participer à différents types de projets pour découvrir ce qui m'intéresse le plus, comme les podcasts, les débats ou la création de contenu.",
    skills: "Je suis débutante mais motivée à apprendre. Je suis sérieuse, curieuse et j'aime travailler en groupe. J'ai aussi une bonne capacité d'écoute et d'adaptation."
  },
  {
    firstName: "Bourcheni",
    lastName: "Eya",
    email: "Bourcheniaya@gmail.com",
    phone: "20940583",
    field: "LAI",
    year: 2,
    motivation: "´",
    projects: "´",
    skills: "."
  },
  {
    firstName: "Mouadh",
    lastName: "Nasr",
    email: "mouadhnasr85@gmail.com",
    phone: "90334532",
    field: "LISI",
    year: 1,
    motivation: "Pour faire le jaw",
    projects: "Tournoi box 🥊",
    skills: "N7b jaw"
  },
  {
    firstName: "Mahdi",
    lastName: "Bernadi",
    email: "mahokoch.ratki@gmail.com",
    phone: "97771299",
    field: "LISI",
    year: 1,
    motivation: "Nhebou jaw",
    projects: "Autre",
    skills: "Autre"
  },
  {
    firstName: "Rahma",
    lastName: "Hajaji",
    email: "Rahmahajaji554@gmail.com",
    phone: "99651366",
    field: "LAI",
    year: 2,
    motivation: ".",
    projects: ".",
    skills: "."
  },
  {
    firstName: "Lina",
    lastName: "Mouithi",
    email: "teriamouithi@gmail.com",
    phone: "24399291",
    field: "LAI",
    year: 2,
    motivation: ".",
    projects: ".",
    skills: "."
  },
  {
    firstName: "Medeleh",
    lastName: "Maheim",
    email: "matrimedelehi90@gmail.com",
    phone: "21885209",
    field: "LAI",
    year: 2,
    motivation: ".",
    projects: ".",
    skills: "."
  },
  {
    firstName: "Self eddine",
    lastName: "Zouaoui",
    email: "Selfocussal@gmail.com",
    phone: "25020231",
    field: "LT",
    year: 1,
    motivation: "..",
    projects: ".",
    skills: "."
  },
  {
    firstName: "Nour el houda",
    lastName: "Sousi",
    email: "nousseuf790@gmail.com",
    phone: "28703053",
    field: "LAI",
    year: 2,
    motivation: "For the fun",
    projects: "Dont have for the moment",
    skills: "."
  },
  {
    firstName: "Aziz",
    lastName: "Wertami",
    email: "aziz.wertamite@gmail.com",
    phone: "96615802",
    field: "GLSI",
    year: 3,
    motivation: "Help devollopong the club",
    projects: "Des idées dans le domaine sportif",
    skills: "Club, event management"
  },
  {
    firstName: "Tourni",
    lastName: "Youssef",
    email: "youssef50070@gmail.com",
    phone: "29792041",
    field: "GLSI",
    year: 2,
    motivation: ".",
    projects: ".",
    skills: "Reparation des systemes informatique, Excellentes compétences en communication et en persuasion, Capacité à convaincre et à rallier les autres autour d'une idée, Aisance relationnelle et talent pour influ"
  }
];

async function addMembers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const defaultPassword = await bcrypt.hash('radioistic2025', 10);

    let added = 0;
    let skipped = 0;

    for (const member of members) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: member.email });
      
      if (existingUser) {
        console.log(`⏭️  Skipped: ${member.firstName} ${member.lastName} (${member.email}) - Already exists`);
        skipped++;
        continue;
      }

      // Create new user
      const newUser = new User({
        ...member,
        password: defaultPassword,
        role: 'member',
        avatar: '/avatars/default-avatar.png'
      });

      await newUser.save();
      console.log(`✅ Added: ${member.firstName} ${member.lastName} (${member.email}) - ${member.field} ${member.year}`);
      added++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Added: ${added} members`);
    console.log(`   ⏭️  Skipped: ${skipped} members (already exist)`);
    console.log(`   📝 Total: ${members.length} members processed`);
    
    // Get total member count
    const totalMembers = await User.countDocuments({ role: 'member' });
    console.log(`\n👥 Total members in database: ${totalMembers}`);

    mongoose.connection.close();
    console.log('\n🎉 Members added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMembers();
