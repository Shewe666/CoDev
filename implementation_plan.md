# Implementation Plan

## Goal
Complete the CoDev MERN application by adding a simple backend, authentication, room management, real‑time code synchronization (using Monaco Editor), and chat while preserving the existing UI and keeping the code beginner‑friendly.

## User Review Required
> **[!IMPORTANT]**
> - Confirm that adding a new `server/` directory and a dashboard page (`/dashboard`) is acceptable.
> - Confirm that replacing the current CodeMirror editor with Monaco (`@monaco-editor/react`) is desired (you approved this).
> - Let us know if you prefer any different route naming or additional UI tweaks.

## Open Questions
> **[!QUESTION]**
> 1. Should the dashboard be a separate page (`/dashboard`) or merged into the existing home page after login?
> 2. Do you want email verification during registration, or is simple password login sufficient?

## Proposed Changes

### Backend (`server/`)
- **server.js** – Express app, CORS, JSON parsing, MongoDB connection, mounts auth & room routes, starts Socket.IO server.
- **models/** – `User.js`, `Room.js`, `Message.js` (basic schemas as described).
- **routes/** – `auth.js` (register, login, optional `/me`), `room.js` (create room, get room, fetch messages).
- **middleware/auth.js** – JWT verification middleware.
- **sockets/socket.js** – Handles Socket.IO events: `join`, `code-change`, `send-message`, `leave`, broadcasts participant list and code state.
- **.env.example** – Backend variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`).

### Frontend Additions
- **pages/Login.jsx**, **pages/Register.jsx**, **pages/Dashboard.jsx** – Simple forms using existing dark/green styles, store JWT in `localStorage`.
- **ProtectedRoute.jsx** – Wrapper that redirects to `/login` when no token.
- Update **src/App.jsx** routes to include `/login`, `/register`, `/dashboard`.
- **src/socket.js** – Remains but will now be used after auth.
- **src/Components/Editor.jsx** – Replace CodeMirror implementation with Monaco Editor (`@monaco-editor/react`). Use `editorDidMount` to emit `code-change` on change (debounced).
- **src/pages/EditorPage.jsx** – Add chat UI (messages list, input, send button) using existing dark theme and `react-hot-toast` for notifications.
- Add utility functions for API calls (`fetch` with Authorization header).
- **src/pages/Home.jsx** – If user is logged in, redirect to `/dashboard` instead of showing join/create UI.

### Packages
- **Backend**: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `socket.io`, `cors`, `dotenv`, `nodemon` (dev).
- **Frontend**: Add `@monaco-editor/react` (optional, approved). Ensure `socket.io-client` is present (already).

### Database Schemas
- **User**: name, email (unique), password (hashed).
- **Room**: roomId (UUID), owner (User ref), createdAt.
- **Message**: roomId (ref), username, message, createdAt.

### Flow Summary
1. User registers → `/api/auth/register` (hash password).
2. User logs in → receives JWT, stored in `localStorage`.
3. Authenticated user accesses `/dashboard` → can create a room (POST `/api/rooms`) or join an existing one.
4. On entering `/editor/:roomId`, client connects Socket.IO, joins room, receives current code and participant list.
5. Monaco editor emits `code-change`; server broadcasts to other participants.
6. Chat messages are sent via Socket.IO, saved to MongoDB, and loaded on room entry.
7. “Copy Room ID” copies to clipboard with toast.
8. “Leave” disconnects socket and navigates back to dashboard.

### Verification Plan
- Manual testing of registration/login, protected routes, room creation/join, real‑time code sync, chat, message persistence, copy ID toast, leave handling.
- Ensure CORS works (`cors` with origin `*` for development) and Socket.IO connects to `VITE_BACKEND_URL`.
- Run `npm run dev` for Vite client and `npm run server:dev` (or `nodemon server.js`) for backend.

## Files to be Created / Modified
| Path | Action |
|------|--------|
| `server/server.js` | New
| `server/models/User.js` | New
| `server/models/Room.js` | New
| `server/models/Message.js` | New
| `server/routes/auth.js` | New
| `server/routes/room.js` | New
| `server/middleware/auth.js` | New
| `server/sockets/socket.js` | New
| `.env.example` (backend) | New
| `src/pages/Login.jsx` | New
| `src/pages/Register.jsx` | New
| `src/pages/Dashboard.jsx` | New
| `src/ProtectedRoute.jsx` | New
| `src/App.jsx` | Modify (add routes, auth guard)
| `src/Components/Editor.jsx` | Modify (Monaco replacement)
| `src/pages/EditorPage.jsx` | Modify (add chat UI)
| `src/pages/Home.jsx` | Slight modify (redirect if logged in)
| `package.json` (frontend) | Add `@monaco-editor/react` if not present
| `package.json` (backend scripts) | Add `"server:dev": "nodemon server/server.js"`

## How to Run
1. **Backend**
   ```bash
   cd server
   npm install   # express, mongoose, bcryptjs, jsonwebtoken, socket.io, cors, dotenv
   cp .env.example .env   # Fill in your MongoDB URI and JWT secret
   npm run server:dev   # nodemon server.js
   ```
2. **Frontend**
   ```bash
   cd ..   # back to project root
   npm install   # ensure @monaco-editor/react is installed
   cp .env.example .env   # set VITE_BACKEND_URL=http://localhost:5000
   npm run dev
   ```
3. Open `http://localhost:5173` (Vite default) and use the app.

---
*Please review the plan and answer the open questions. Once approved, I will proceed with the implementation.*
