# 💬 TEST DU CHAT EN TEMPS RÉEL

## ✅ CE QUI A ÉTÉ CONFIGURÉ

### 1. Backend WebSocket Server
- ✅ Serveur WebSocket intégré avec Express (port 5000)
- ✅ Authentification JWT
- ✅ Gestion des conversations
- ✅ Messages en temps réel
- ✅ Indicateurs de frappe (typing indicators)
- ✅ Statuts des messages (envoyé/livré/lu)
- ✅ Utilisateurs en ligne

### 2. Frontend WebSocket Context
- ✅ Connexion automatique avec JWT
- ✅ Reconnexion automatique
- ✅ Gestion des messages
- ✅ Historique des conversations
- ✅ Détection des utilisateurs en ligne

### 3. Base de Données MongoDB
- ✅ Collection: conversations
- ✅ Collection: messages
- ✅ Participants des conversations
- ✅ Messages avec status de lecture

## 🚀 COMMENT TESTER

### Étape 1: Démarrer le Backend
```powershell
cd backend-api
node server.js
```

**Vous devriez voir:**
```
🚀 Radio Istic API server running on port 5000
🔌 WebSocket server running on port 5000
✅ MongoDB Connected
```

### Étape 2: Démarrer le Frontend
Dans un NOUVEAU terminal:
```powershell
npm run dev
```

**Vous devriez voir:**
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Étape 3: Ouvrir 2 Navigateurs
1. **Navigateur 1** (Chrome): http://localhost:3000
   - Connectez-vous avec un utilisateur (ex: aziz.mehri@istic.rnu.tn)
   - Allez sur `/chat`
   
2. **Navigateur 2** (Firefox/Chrome Incognito): http://localhost:3000
   - Connectez-vous avec un AUTRE utilisateur
   - Allez sur `/chat`

### Étape 4: Tester le Chat
1. Dans le Navigateur 1:
   - Sélectionnez l'utilisateur du Navigateur 2
   - Tapez un message: "Salut! 👋"
   - Appuyez sur Entrée

2. Dans le Navigateur 2:
   - Le message devrait apparaître IMMÉDIATEMENT
   - Répondez: "Ça va bien! 😊"

3. Dans le Navigateur 1:
   - La réponse devrait apparaître IMMÉDIATEMENT

## 🔍 DÉBOGAGE

### Vérifier la connexion WebSocket
Ouvrez la console du navigateur (F12) et cherchez:
```
🔌 Connecting to WebSocket server: http://localhost:5000
✅ WebSocket connected to backend on port 5000
👥 Online users: 2
```

### Vérifier l'envoi de messages
Dans la console, vous devriez voir:
```
📤 Sending message: { conversationId: "...", recipientId: "...", message: "..." }
✅ Message saved and sent: 673abc...
💬 Message received: { id: "673abc...", content: "...", ... }
```

### Problèmes courants

#### ❌ "Not connected to chat server"
**Solution**: 
- Vérifiez que le backend tourne (port 5000)
- Vérifiez la console: erreurs d'authentification?
- Réessayez de vous connecter

#### ❌ Messages n'apparaissent pas
**Solution**:
1. Ouvrez DevTools (F12) → Console
2. Regardez les erreurs WebSocket
3. Vérifiez que vous êtes dans la même conversation:
   ```javascript
   // Dans la console:
   localStorage.getItem('radio-istic-user')
   // Devrait afficher votre user ID
   ```

#### ❌ "Authentication token required"
**Solution**:
```javascript
// Dans la console:
localStorage.getItem('radio-istic-token')
// Si null, reconnectez-vous
```

## 📊 STRUCTURE DES MESSAGES

### Message envoyé (Frontend → Backend)
```javascript
{
  conversationId: "673abc123...",
  recipientId: "673def456...",
  message: "Salut!",
  senderId: "673user789...",
  senderName: "Aziz Mehri"
}
```

### Message reçu (Backend → Frontend)
```javascript
{
  id: "673msg001...",
  conversationId: "673abc123...",
  content: "Salut!",
  senderId: "673user789...",
  senderName: "Aziz Mehri",
  senderAvatar: "/avatars/aziz-mehri.png",
  timestamp: "2025-11-12T10:30:00.000Z",
  status: "sent",
  type: "text"
}
```

## 🎯 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Messages en temps réel
- Envoi instantané
- Réception instantanée
- Pas de rafraîchissement nécessaire

### ✅ Indicateurs de statut
- 🕐 Envoi en cours (horloge)
- ✓ Envoyé (1 coche)
- ✓✓ Livré (2 coches)
- ✓✓ Lu (2 coches bleues)

### ✅ Typing indicators
- Affiche "• • •" quand l'autre personne tape

### ✅ Utilisateurs en ligne
- Point vert = En ligne
- Gris = Hors ligne

### ✅ Historique des messages
- Chargement automatique des messages précédents
- Scroll infini vers le haut

### ✅ Conversations persistantes
- Messages sauvegardés dans MongoDB
- Récupération après rafraîchissement
- Synchronisation entre appareils

## 🧪 COMMANDES DE TEST

### Tester la connexion backend
```powershell
curl http://localhost:5000/api/health
```

**Réponse attendue:**
```json
{
  "status": "OK",
  "message": "Radio Istic API is running",
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

### Vérifier les conversations
```powershell
# Remplacez YOUR_TOKEN par votre vrai token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/chat/conversations
```

### Vérifier les utilisateurs en ligne
Dans la console du navigateur:
```javascript
// Émettre un événement
window.wsConnection = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('radio-istic-token') }
})

// Demander les utilisateurs en ligne
window.wsConnection.emit('get-online-users')

// Écouter la réponse
window.wsConnection.on('online-users', (users) => {
  console.log('👥 Utilisateurs en ligne:', users)
})
```

## 📝 EXEMPLE DE TEST COMPLET

### Terminal 1 (Backend)
```powershell
cd backend-api
node server.js
```

### Terminal 2 (Frontend)
```powershell
npm run dev
```

### Navigateur 1 (Chrome)
1. http://localhost:3000/login
2. Email: aziz.mehri@istic.rnu.tn
3. Password: [votre mot de passe]
4. Aller sur /chat
5. Sélectionner un membre
6. Taper: "Test message 1" + Entrée

### Navigateur 2 (Firefox)
1. http://localhost:3000/login
2. Email: [autre utilisateur]
3. Password: [mot de passe]
4. Aller sur /chat
5. **LE MESSAGE DEVRAIT APPARAÎTRE AUTOMATIQUEMENT!**
6. Répondre: "Test message 2" + Entrée

### Navigateur 1
- **LA RÉPONSE DEVRAIT APPARAÎTRE AUTOMATIQUEMENT!**

## ✨ C'EST PARTI!

Le système de chat en temps réel est maintenant configuré et prêt à l'emploi!

**Fonctionnalités:**
- ✅ Messages instantanés comme Messenger
- ✅ Indicateurs de frappe
- ✅ Statuts des messages
- ✅ Utilisateurs en ligne
- ✅ Historique persistant
- ✅ Conversations multiples

**Prochaines étapes possibles:**
- 📎 Partage de fichiers/images
- 🔔 Notifications push
- 📞 Appels audio/vidéo (WebRTC)
- 👥 Conversations de groupe
- 🎨 Emojis et réactions

Bon chat! 💬✨
