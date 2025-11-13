# 💬 Chat en Temps Réel - Configuration Complète

## ✅ Résumé des Modifications

### 🔧 Backend (Node.js + Express + Socket.io)

#### 1. **websocket-server.js** (NOUVEAU - 400+ lignes)
Serveur WebSocket complet avec:
- **Authentification JWT**: Vérification automatique du token à la connexion
- **Gestion des utilisateurs**: Map des utilisateurs en ligne avec socketId
- **Événements implémentés**:
  - `join-conversation`: Rejoindre une conversation + charger l'historique
  - `leave-conversation`: Quitter une conversation
  - `send-message`: Envoyer un message en temps réel
  - `typing-start`/`typing-stop`: Indicateurs de frappe
  - `mark-as-read`: Marquer messages comme lus
  - `get-online-users`: Liste des utilisateurs en ligne
  
```javascript
// Exemple de connexion
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id)
  socket.userId = user._id.toString()
  socket.userInfo = { id, name, avatar, ... }
  next()
})
```

#### 2. **server.js** (MODIFIÉ)
Intégration du WebSocket avec Express:
```javascript
const http = require('http')
const { initializeWebSocket } = require('./websocket-server')

const httpServer = http.createServer(app)
const io = initializeWebSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log('🚀 API server running on port', PORT)
  console.log('🔌 WebSocket server running on port', PORT)
})
```

### 🖥️ Frontend (Next.js + React + Socket.io-client)

#### 3. **lib/websocket-context.tsx** (MODIFIÉ)
Changements majeurs:
- **URL**: `http://localhost:5000` au lieu de `3001`
- **Authentification JWT**: 
  ```typescript
  const token = localStorage.getItem('radio-istic-token')
  const newSocket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling']
  })
  ```
- **Gestion des messages améliorée**:
  - Prévention des duplicatas
  - Mise à jour de l'historique par conversation
  - Affichage des logs détaillés
- **Envoi de messages robuste**:
  ```typescript
  const sendMessage = (recipientId, message, conversationId) => {
    if (!socket || !isConnected) {
      alert('Not connected to chat server')
      return
    }
    socket.emit('send-message', {
      conversationId,
      recipientId,
      message,
      tempId: `temp-${Date.now()}`
    })
  }
  ```

### 📊 Base de Données MongoDB

Collections utilisées:
- **conversations**: Stocke les conversations entre utilisateurs
- **messages**: Stocke tous les messages avec statuts de lecture
- **users**: Enrichi avec `socketId` et `status` (online/offline)

## 🚀 Comment Démarrer

### Étape 1: Backend
```powershell
cd backend-api
node server.js
```

**Sortie attendue:**
```
🔌 WebSocket server initialized
🚀 Radio Istic API server running on port 5000
🔌 WebSocket server running on port 5000
✅ MongoDB Connected: ac-eby7hbq-shard-00-02.o1rwzg0.mongodb.net
📦 Database: radio-istic
```

### Étape 2: Frontend
Dans un NOUVEAU terminal:
```powershell
npm run dev
```

**Sortie attendue:**
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Étape 3: Test avec 2 Navigateurs

#### Navigateur 1 (Chrome)
1. Ouvrir: http://localhost:3000/login
2. Se connecter avec utilisateur 1 (ex: aziz.mehri@istic.rnu.tn)
3. Aller sur: http://localhost:3000/chat
4. Ouvrir DevTools (F12) → Console

**Logs attendus:**
```
🔌 Connecting to WebSocket server: http://localhost:5000
✅ WebSocket connected to backend on port 5000
👥 Online users: 1
```

#### Navigateur 2 (Firefox ou Chrome Incognito)
1. Ouvrir: http://localhost:3000/login
2. Se connecter avec utilisateur 2 (DIFFÉRENT)
3. Aller sur: http://localhost:3000/chat

**Dans Navigateur 1, les logs affichent maintenant:**
```
👥 Online users: 2
```

#### Test du Chat
1. **Navigateur 1**: Sélectionner l'utilisateur 2 dans la liste
2. **Navigateur 1**: Taper "Salut! 👋" et appuyer sur Entrée

**Logs Navigateur 1:**
```
📤 Sending message: { conversationId: "...", message: "Salut! 👋" }
✅ Message sent confirmation: {...}
```

**Navigateur 2:**
- Le message apparaît **INSTANTANÉMENT**
- Notification sonore (si disponible)

**Logs Navigateur 2:**
```
💬 Message received: { id: "...", content: "Salut! 👋", ... }
📝 Total messages now: 1
```

3. **Navigateur 2**: Répondre "Ça va bien! 😊"

**Navigateur 1:**
- La réponse apparaît **INSTANTANÉMENT**

## 🎯 Fonctionnalités Implémentées

### ✅ Messages en Temps Réel
- Envoi instantané via WebSocket
- Pas besoin de rafraîchir la page
- Fonctionne comme Messenger/WhatsApp

### ✅ Utilisateurs en Ligne
- Point vert à côté du nom
- Liste mise à jour en temps réel
- Statut: online/offline

### ✅ Indicateurs de Frappe
```
Utilisateur 1 tape...
• • •
```

### ✅ Statuts des Messages
- **🕐 Envoi en cours**: Horloge
- **✓ Envoyé**: 1 coche grise
- **✓✓ Livré**: 2 coches grises
- **✓✓ Lu**: 2 coches bleues

### ✅ Historique des Messages
- Chargé automatiquement quand on rejoint une conversation
- Stocké dans MongoDB
- Scroll infini (charger plus de messages en scrollant vers le haut)

### ✅ Persistance
- Messages sauvegardés dans MongoDB
- Conversations conservées après refresh
- Historique accessible même après déconnexion

## 🔍 Débogage

### Vérifier la Connexion WebSocket

Ouvrez DevTools (F12) → Console et cherchez:

**✅ Connexion réussie:**
```
🔌 Connecting to WebSocket server: http://localhost:5000
✅ WebSocket connected to backend on port 5000
👥 Online users: 2
```

**❌ Erreur d'authentification:**
```
❌ Socket authentication error: jwt malformed
```
**Solution**: Reconnectez-vous pour obtenir un nouveau token

**❌ Erreur de connexion:**
```
❌ Connection error: connect ECONNREFUSED
```
**Solution**: Vérifiez que le backend tourne sur le port 5000

### Vérifier l'Envoi de Messages

**Console Navigateur 1 (sender):**
```
📤 Sending message: {
  conversationId: "673abc...",
  recipientId: "673def...",
  message: "Test"
}
✅ Message sent confirmation
```

**Console Navigateur 2 (receiver):**
```
💬 Message received: {
  id: "673msg...",
  content: "Test",
  senderId: "673user...",
  timestamp: "2025-11-12T10:30:00.000Z"
}
```

### Vérifier les Utilisateurs en Ligne

Dans la console du navigateur:
```javascript
// Demander la liste
window.wsConnection?.emit('get-online-users')

// Écouter la réponse
window.wsConnection?.on('online-users', (users) => {
  console.log('👥 Utilisateurs en ligne:', users)
})
```

## 🐛 Problèmes Courants

### ❌ "Not connected to chat server"
**Causes possibles:**
1. Backend pas démarré
2. Token JWT expiré
3. WebSocket bloqué par un pare-feu

**Solutions:**
1. Vérifier que `node server.js` tourne
2. Se reconnecter (obtenir nouveau token)
3. Vérifier les logs de la console

### ❌ Messages ne s'affichent pas
**Diagnostic:**
```javascript
// Dans la console du navigateur
console.log('Connected?', ws.isConnected)
console.log('Messages:', ws.messages)
console.log('Conversations:', ws.conversationHistories)
```

**Solution:**
1. Vérifier que vous avez rejoint la conversation:
   ```javascript
   ws.join(conversationId)
   ```
2. Vérifier les logs de la console
3. Rafraîchir la page

### ❌ "Authentication token required"
**Cause**: Pas de token JWT

**Solution:**
```javascript
// Vérifier le token
console.log(localStorage.getItem('radio-istic-token'))

// Si null, se reconnecter
window.location.href = '/login'
```

## 📊 Architecture Technique

### Flow d'un Message

```
Utilisateur 1 (Chrome)
   ↓ Tape "Salut!"
   ↓ Appuie sur Entrée
   ↓
Frontend (React)
   ↓ ws.sendMessage(recipientId, "Salut!", conversationId)
   ↓ socket.emit('send-message', {...})
   ↓
WebSocket (Socket.io)
   ↓ Connexion WebSocket persistante
   ↓
Backend (Node.js)
   ↓ socket.on('send-message', async (data) => {...})
   ↓ Message.create({...})
   ↓ MongoDB: INSERT message
   ↓ io.to(conversationId).emit('receive-message', message)
   ↓
WebSocket (Socket.io)
   ↓ Broadcast à tous les participants
   ↓
Frontend (React) - Utilisateur 2 (Firefox)
   ↓ socket.on('receive-message', (message) => {...})
   ↓ setMessages([...prev, message])
   ↓ Affichage INSTANTANÉ dans l'UI
   ↓ Notification sonore
```

### Événements WebSocket

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `connect` | ← Backend | Connexion établie |
| `authenticate` | → Backend | Authentification JWT (automatique) |
| `join-conversation` | → Backend | Rejoindre une conversation |
| `conversation-history` | ← Backend | Recevoir l'historique |
| `send-message` | → Backend | Envoyer un message |
| `message-sent` | ← Backend | Confirmation d'envoi |
| `receive-message` | ← Backend | Recevoir un message |
| `typing-start` | → Backend | Commencer à taper |
| `typing-stop` | → Backend | Arrêter de taper |
| `user-typing` | ← Backend | Quelqu'un tape |
| `mark-as-read` | → Backend | Marquer comme lu |
| `messages-read` | ← Backend | Messages lus |
| `online-users` | ← Backend | Liste utilisateurs en ligne |
| `user-status-change` | ← Backend | Changement de statut |
| `disconnect` | ← Backend | Déconnexion |

## 🎨 Interface Utilisateur

### Messages
```
┌─────────────────────────────────────┐
│  Aziz Wertani                   ●   │  ← Point vert (en ligne)
├─────────────────────────────────────┤
│                                     │
│  Salut! Comment ça va?              │  ← Message reçu (gauche, gris)
│  10:30                              │
│                                     │
│              Très bien merci! 😊    │  ← Message envoyé (droite, bleu)
│              Et toi?           ✓✓   │  ← Statut: livré
│              10:31                  │
│                                     │
│  • • •                              │  ← Indicateur de frappe
│                                     │
├─────────────────────────────────────┤
│  Message...                     [→] │  ← Zone de texte + bouton
└─────────────────────────────────────┘
```

## 🔐 Sécurité

### Authentification JWT
- Token vérifié à chaque connexion WebSocket
- Utilisateur identifié: `socket.userId`
- Pas d'usurpation d'identité possible

### Autorisation
- Utilisateur ne peut rejoindre que ses propres conversations
- Vérification: `participants.includes(socket.userId)`
- Messages ne sont envoyés qu'aux participants

### Validation
- Contenu des messages validé côté backend
- Limite de 2000 caractères
- Pas de contenu vide

## 📈 Performance

### Optimisations
- **Reconnexion automatique**: Si déconnexion, reconnexion automatique
- **Prévention des duplicatas**: Vérification des ID de messages
- **Historique limité**: Chargement de 100 derniers messages max
- **Indexation MongoDB**: Index sur `conversation`, `sender`, `createdAt`

### Scalabilité
Pour production (plusieurs serveurs):
- Utiliser Redis pour stocker les socketId
- Socket.io Adapter (Redis ou MongoDB)
- Load balancer avec sticky sessions

## 🚀 Prochaines Fonctionnalités Possibles

### 📎 Partage de Fichiers
- Upload d'images/documents
- Aperçu des images
- Téléchargement de fichiers

### 🎥 Appels Audio/Vidéo
- WebRTC pour peer-to-peer
- Signaling via WebSocket
- Partage d'écran

### 👥 Conversations de Groupe
- Support de conversations à 3+ personnes
- Nom de groupe
- Avatar de groupe

### 🔔 Notifications Push
- Service Worker
- Push API
- Notifications desktop

### 😀 Réactions et Emojis
- Réagir à un message (👍 ❤️ 😂)
- Picker d'emojis
- Compteur de réactions

### ✏️ Édition de Messages
- Modifier un message envoyé
- Historique des modifications
- Indication "modifié"

### 🗑️ Suppression
- Supprimer un message (soft delete)
- "Ce message a été supprimé"
- Délai de suppression

## 📞 Support

En cas de problème:
1. Vérifier les logs de la console (F12)
2. Vérifier que le backend tourne
3. Vérifier la connexion MongoDB
4. Lire TEST-CHAT.md pour plus de détails

## ✨ Conclusion

Votre système de chat en temps réel est maintenant **100% fonctionnel**!

**Caractéristiques:**
- ✅ Messages instantanés (0 latence perçue)
- ✅ Authentification sécurisée (JWT)
- ✅ Persistance dans MongoDB
- ✅ Indicateurs de frappe
- ✅ Statuts des messages
- ✅ Utilisateurs en ligne
- ✅ Historique chargé automatiquement
- ✅ Interface intuitive

**Pour tester:**
```powershell
# Terminal 1
cd backend-api && node server.js

# Terminal 2
npm run dev

# Navigateur
http://localhost:3000/chat
```

Bon chat! 💬🚀
