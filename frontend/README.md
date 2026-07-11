# ShadowDex - Pokemon Silhouette Guessing Game

ShadowDex is a Pokémon silhouette guessing game where players identify Pokémon from their shapes. It includes local gameplay, guest gameplay, and competitive/daily challenge modes powered by a Node.js + Express.js backend and a MongoDB database.

---

## Technical Stack

- **Frontend**: React, Next.js (App Router), Tailwind CSS, Framer Motion, Axios
- **Backend**: Node.js, Express.js, MongoDB Atlas (via Mongoose), JWT, Bcrypt

---

## Features & Game Rules

1. **Endless Mode (Public)**:
   - Guests can play with unlimited rounds.
   - No score or history is saved to the database.

2. **Daily Challenge (Authenticated)**:
   - Requires login.
   - Players get one attempt per day.
   - Completion dates are saved in the database for tracking.

3. **Quick Play (Authenticated & Competitive)**:
   - Requires login.
   - Exactly **3 rounds** per game session.
   - Points are awarded per round (up to 100 points, minus hint penalties, minimum 10 points per round).
   - **Perfect Game Bonus**: Getting all 3 answers correct awards a **+500 points** bonus.
   - Scores are submitted to the backend. The player's single **highest Quick Play score** is stored and used for rankings.
   - **totalQuickPlayWins** tracks the number of perfect games completed.

4. **Leaderboard**:
   - Order users descending by their single best (`highestQuickPlayScore`) score.

---

## Project Structure

```
shadow-dex-landing-page/
├── app/                      # Next.js Frontend views & layouts
├── components/               # Frontend reusable React components & sections
├── src/
│   └── api/                  # Axios configurations and endpoints
│       ├── client.ts         # Base Axios client with authorization interceptors
│       ├── auth.ts           # Auth requests (signup, login, me)
│       ├── user.ts           # Profile stats request
│       ├── quickplay.ts      # Quick Play starts and finishes
│       ├── daily.ts          # Daily Challenge starts and finishes
│       └── leaderboard.ts    # Global rankings
├── lib/
│   ├── context/              # GameContext and AuthContext
│   └── utils/                # Helper utilities (pokemon fetchers, date helpers)
│
├── backend/                  # Node.js + Express Backend
│   ├── config/               # DB connection
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Protect route authorization & error handling
│   ├── models/               # User, QuickPlayResult, DailyChallengeResult
│   ├── routes/               # Express endpoints routers
│   ├── server.js             # Main entry point
│   ├── .env.example          # Sample environment variables
│   └── package.json          # Node scripts & dependencies
```

---

## Local Setup & Configuration

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- A MongoDB Atlas database instance (or local MongoDB server)

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the sample file `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Configure your `.env` secrets:
   - **MONGO_URI**: Paste your MongoDB connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/shadowdex`).
   - **JWT_SECRET**: Enter a secure random string (e.g., `MySuperSecretPokemonTrainerKey_2026`).
   - **PORT**: Defaults to `5000` (make sure it matches `NEXT_PUBLIC_API_URL` on the frontend if modified).

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
5. Run the backend development server using nodemon:
   ```bash
   npm run dev
   ```
   *You should see success logs confirming server is running and database is connected.*

---

### Step 2: Frontend Setup

1. Return to the root workspace directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js local development server:
   ```bash
   npm run dev
   ```
4. Access the web app at [http://localhost:3000](http://localhost:3000).

---

## Backend API Endpoints Reference

### Authentication Route (`/api/auth`)
- `POST /signup` - Registers a new user. Expects JSON `{ username, email, password }`. Returns token and user object.
- `POST /login` - Authenticates user. Expects JSON `{ email, password }`. Returns token and user object.
- `GET /me` - Fetches authenticated user info. (Protected - requires Bearer token)

### User Profile Route (`/api/users`)
- `GET /profile` - Fetches user statistics and mode breakdowns. (Protected - requires Bearer token)

### Quick Play Route (`/api/quickplay`)
- `POST /start` - Logs the start of a session. (Protected)
- `POST /finish` - Stores Quick Play result, updates games, wins (perfect game check), and saves new best high score. Expects `{ score, correctAnswers, hintsUsed }`. (Protected)
- `GET /history` - Retrieves user's session logs. (Protected)

### Daily Challenge Route (`/api/daily`)
- `POST /start` - Logs the start of a challenge. (Protected)
- `POST /finish` - Saves challenge completion. Expects `{ completed }`. (Protected)

### Leaderboard Route (`/api/leaderboard`)
- `GET /` - Fetches global ranking ordered by best Quick Play score descending. (Public)
