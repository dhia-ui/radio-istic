# 🚀 Radio ISTIC - Guide de Démarrage

## ✅ BACKEND ET INSCRIPTION CONFIGURÉS!

Tout est déjà configuré pour sauvegarder automatiquement vos données!

---

## 📝 Démarrage des Serveurs

### Option 1: Démarrage Automatique (Recommandé)
```bash
# Exécutez ce fichier batch:
start-all.bat
```

### Option 2: Démarrage Manuel

#### Terminal 1 - Backend (IMPORTANT!)
```bash
cd backend-api
node server.js
```
**⚠️ NE FERMEZ PAS CE TERMINAL!**

#### Terminal 2 - Frontend
```bash
npm run dev
```

---

## 🌐 URLs Disponibles

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Inscription**: http://localhost:3000/signup
- **Connexion**: http://localhost:3000/login

---

## 📝 Comment S'Inscrire

### Étapes:

1. **Ouvrez** http://localhost:3000/signup

2. **Remplissez le formulaire:**
   - Prénom: Votre prénom
   - Nom: Votre nom  
   - Email: votre@email.com (doit être unique)
   - Téléphone: +216 XX XXX XXX (optionnel)
   - Filière: GLSI, IRS, LISI, LAI, IOT, ou LT
   - Année: 1, 2, ou 3
   - Mot de passe: minimum 6 caractères
   - Confirmer le mot de passe

3. **Cliquez** sur le bouton "S'INSCRIRE"

4. **Redirection automatique** vers la page /members

5. **Rafraîchissez la page (F5)** → Vous restez connecté! ✨

---

## 💾 Sauvegarde Automatique

### ✅ Ce qui est sauvegardé:

#### Dans MongoDB (Base de données):
- ✅ Compte utilisateur complet
- ✅ Mot de passe (crypté avec bcrypt)
- ✅ Toutes vos informations (nom, email, filière, etc.)
- ✅ Conversations et messages du chat
- ✅ Inscriptions aux événements
- ✅ Statut de membre

#### Dans localStorage (Navigateur):
- ✅ JWT Token (authentification)
- ✅ Profil utilisateur (accès rapide)
- ✅ Préférences de thème (Dark/Light)
- ✅ Rappels d'événements
- ✅ Interactions sociales (likes, comments)

---

## 🔑 Persistence des Données

### Après inscription:

1. **JWT Token** → Sauvegardé dans `localStorage['radio-istic-token']`
2. **Profil** → Sauvegardé dans `localStorage['radio-istic-user']`
3. **Base de données** → Compte créé dans MongoDB

### Après refresh (F5):

1. ✅ Le système vérifie le JWT token
2. ✅ Récupère votre profil depuis la base de données
3. ✅ Vous reste connecté automatiquement
4. ✅ Toutes vos données sont conservées

---

## 🧪 Test Complet

### Pour tester la persistence:

```bash
1. Inscrivez-vous sur /signup
2. Vous êtes redirigé vers /members
3. Appuyez sur F5 pour rafraîchir
4. ✨ Vous êtes toujours connecté!
5. Fermez le navigateur
6. Rouvrez http://localhost:3000
7. ✨ Vous êtes toujours connecté!
```

---

## 🔧 Endpoints API

### Authentication:
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil actuel

### Members:
- `GET /api/members` - Liste des membres
- `GET /api/members/:id` - Détails d'un membre

### Events:
- `GET /api/events` - Liste des événements
- `POST /api/events/:id/register` - Inscription événement

### Chat:
- `GET /api/chat/conversations` - Conversations
- `POST /api/chat/messages` - Envoyer un message

---

## ⚙️ Configuration

### Backend (.env dans backend-api/):
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=YOUR_JWT_SECRET
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Frontend:
L'URL du backend est configurée automatiquement:
- Development: `http://localhost:5000/api`
- Production: À définir dans `NEXT_PUBLIC_API_URL`

---

## 🐛 Troubleshooting

### Erreur "Échec de l'inscription":
- ✅ Vérifiez que le backend est démarré (port 5000)
- ✅ Vérifiez la console du backend pour les erreurs
- ✅ Email peut être déjà utilisé (doit être unique)

### "Cannot connect to server":
- ✅ Démarrez le backend: `cd backend-api && node server.js`
- ✅ Vérifiez que le port 5000 est libre

### Session ne persiste pas:
- ✅ Vérifiez localStorage dans DevTools (F12)
- ✅ Le JWT token doit être présent
- ✅ Vérifiez que les cookies ne sont pas bloqués

---

## ✨ Fonctionnalités Disponibles

### Après inscription, vous pouvez:

- ✅ Voir tous les membres (46 membres actifs)
- ✅ Consulter le bureau (3 membres)
- ✅ S'inscrire aux événements (6 disponibles)
- ✅ Recevoir des notifications
- ✅ Chatter avec d'autres membres
- ✅ Liker et commenter (Vie de club)
- ✅ Changer le thème (Dark/Light)
- ✅ Voir les sponsors et partenaires

---

## 📊 Base de Données

### Collections MongoDB:

- **users**: 46 utilisateurs
  - 43 membres réguliers
  - 3 membres du bureau
  
- **events**: 6 événements
  - Tournoi Ping-Pong
  - Match Football
  - Soirée Cinéma
  - Matchy Matchy
  - Podcast Workshop
  - Welcome Freshman

- **conversations**: Messages du chat
- **messages**: Historique des messages

---

## 🎯 Status

- ✅ Backend: Configuré et prêt
- ✅ Frontend: Configuré et prêt
- ✅ Database: MongoDB Atlas connecté
- ✅ Authentication: JWT + localStorage
- ✅ Persistence: Complètement implémentée
- ✅ Session: Reste après refresh
- ✅ Données: Sauvegardées automatiquement

---

## 🚀 Prêt à Utiliser!

Tout est configuré! Démarrez les serveurs et testez l'inscription.

**Commande rapide:**
```bash
# Terminal 1
cd backend-api && node server.js

# Terminal 2  
npm run dev
```

Ensuite ouvrez: http://localhost:3000/signup

**Bonne utilisation! 🎉**
