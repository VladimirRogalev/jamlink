# 🎵 JamLink - Collaborative Music Rehearsal Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-black.svg)](https://socket.io/)

> **JamLink** is an innovative collaborative music rehearsal platform that enables musicians to practice together virtually. The application serves as a digital platform for musical groups where participants with different instruments can view the same songs simultaneously, with each user seeing customized content based on their instrument.

## ✨ Key Features

### 🎯 **Core Functionality**
- **🔐 Authentication System** - Complete user registration and login with role-based access (admin/regular users) including Google Sign-In
- **👥 Group Management** - Users can create groups (becoming admins) or join existing ones
- **🎼 Song Management** - Admins can search and select songs from a database to display to their group
- **🎹 Instrument-Specific Views** - Content optimized for different instruments (vocalists see only lyrics)
- **📜 Auto-scrolling Lyrics** - Configurable auto-scroll functionality with speed control
- **📱 Responsive Design** - Full compatibility across desktop and mobile devices

### 🚀 **Real-time Features**
- **⚡ Real-time Synchronization** - All group members see the same song simultaneously
- **🔄 WebSocket Connections** - Instant updates between users
- **🎵 Synchronized Playback** - Admin controls which song the entire group sees

## 🛠 Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Typed JavaScript for reliability
- **Redux Toolkit** - State management
- **Socket.IO Client** - Real-time communication
- **SCSS Modules** - Component-scoped styling
- **Vite** - Fast build tool and development
- **React Router** - Client-side routing

### Backend
- **Node.js** - Server platform
- **Express.js** - RESTful API framework
- **TypeScript** - Typed server-side code
- **Socket.IO** - WebSocket server
- **Passport.js** - Authentication (Local + Google OAuth)
- **bcryptjs** - Password hashing
- **Cheerio** - Web scraping for songs

### Infrastructure
- **JSON Files** - Simple data storage
- **Cookie Sessions** - Session management
- **CORS** - Cross-origin resource sharing
- **Helmet** - HTTP security headers

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VladimirRogalev/jamlink.git
   cd jamlink
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   **Server** (`server/.env`):
   ```env
   NODE_ENV=development
   PORT=8000
   SESSION_SECRET=your-super-secure-session-secret-key-here
   SESSION_SECRET2=your-second-super-secure-session-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CLIENT_URL=http://localhost:5173
   SERVER_URL=http://localhost:8000
   ```

   **Client** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

   Or run separately:
   ```bash
   # Server
   npm run server
   
   # Client
   npm run client
   ```

5. **Open in browser**
   - Client: http://localhost:5173
   - Server API: http://localhost:8000

## 📁 Project Structure

```
jamlink/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   └── style/         # SCSS styles
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── socket/        # Socket.IO logic
│   │   ├── config/        # Configuration
│   │   └── utils/         # Utilities
│   ├── data/              # JSON data
│   └── package.json
└── package.json           # Root package.json
```

## 🎮 Usage

### For Users
1. **Registration/Login** - Create an account or sign in with Google
2. **Instrument Selection** - Choose your musical instrument
3. **Join a Group** - Create a new group or join an existing one
4. **Rehearsal** - Follow along with songs selected by the group admin

### For Group Admins
1. **Create Group** - Become an admin of a new group
2. **Search Songs** - Find songs in the database
3. **Manage Rehearsal** - Select songs for the entire group
4. **Control Synchronization** - Manage what the entire group sees

## 🌐 Deployment

### Production
The application is deployed and available at: ****

### Local Build
```bash
npm run build
```

## 🔧 Development

### Available Scripts

```bash
# Install all dependencies
npm run install-all

# Start development mode
npm start

# Start server only
npm run server

# Start client only
npm run client

# Build for production
npm run build

# Lint client code
cd client && npm run lint
```

### Architecture

- **Modular Structure** - Clear separation between client and server
- **TypeScript** - Full type safety for reliability
- **Real-time Communication** - Socket.IO for instant updates
- **Security** - Authentication, authorization, CSRF protection
- **Scalability** - Ready for feature expansion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Vladimir Rogalev**
- GitHub: [@VladimirRogalev](https://github.com/VladimirRogalev)
- Project: [JamLink](https://github.com/VladimirRogalev/jamlink)

## 🎯 Roadmap

- [ ] Mobile application (React Native)
- [ ] Enhanced notification system
- [ ] Integration with music platforms
- [ ] Group chat system
- [ ] Rehearsal recordings
- [ ] Metronome system
- [ ] MIDI file support

---

<div align="center">

**Made with ❤️ for the music community**

[🌟 Star this repo](https://github.com/VladimirRogalev/jamlink) | [🐛 Report bug](https://github.com/VladimirRogalev/jamlink/issues) | [💡 Request feature](https://github.com/VladimirRogalev/jamlink/issues)

</div>