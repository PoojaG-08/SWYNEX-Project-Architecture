# 🎁 SecretGift – Anonymous Gift Exchange

A modern, mysterious, and festive full-stack web application designed for friends, families, and teams to organize private gift exchanges (Secret Santa). The system utilizes a mathematical **Hamiltonian cycle Derangement algorithm** to ensure fair, zero-leak random assignments where no member receives themselves, and nobody can see other members' assignments until the official reveal date.

Built as **Full-Stack Development Internship Task 1**.

---

## 🎨 Color Themes & Visual Identity

SecretGift includes an interactive **Theme Switcher** in the top navigation with 4 festive palettes:
- **Midnight Royale & Champagne Gold (New Default)**: Deep Midnight Indigo (`#0B0F19`), Obsidian Card (`#131C2E`), Radiant Berry Rose (`#F43F5E`), Champagne Amber (`#FBBF24`), and Crisp Pearlescent text (`#F8FAFC`).
- **Alpine Evergreen & Cranberry**: Forest Evergreen (`#05241C`), Frosted Mint (`#34D399`), and Cranberry Red (`#DC2626`).
- **Cosmic Royal Plum & Stardust**: Velvet Violet (`#150826`), Neon Flamingo (`#EC4899`), and Electric Amber (`#FDE047`).
- **Nordic Aurora & Deep Teal**: Deep Teal (`#073B4C`), Coral (`#FF6B6B`), and Soft Aqua (`#4ECDC4`).

---

## 🎊 React-Confetti Celebration System

A full-screen celebratory confetti cascade powered by `react-confetti`:
1. **Unwrapping Secret Match**: Triggered instantly when the user taps "Unwrap & Reveal" on their secret recipient card.
2. **Reveal Date Reached**: Triggered automatically when the countdown timer reaches zero, or when the organizer activates the **Test Final Reveal** mode.
3. **Interactive Launchers**: Users can also click "Confetti!" on the recipient profile or "Celebrate with Confetti!" on the final reveal matrix anytime.
4. **Theme-Adaptive Confetti**: Confetti particles dynamically take on the exact color accents of your selected theme!

---

## ✨ Main Features

1. **Authentication (JWT + bcrypt)**
   - Secure user registration and login with bcrypt password hashing (10 salt rounds).
   - Protected routes using JWT bearer tokens in `Authorization` headers.
   - Built-in 1-Click Demo Accounts Switcher (Sarah - Organizer, Alex - Participant, Maya - Participant, Liam - Participant) for instant reviewer testing.

2. **Group Creation & Invitations**
   - Create private gift circles with customizable gift budgets (support for $, ₹, €, £).
   - Set future reveal dates & times with live tabular countdowns (Days, Hours, Minutes, Seconds).
   - Unique readable invite codes (e.g. `FROST-2026`, `GIFT-7890`) with 1-click clipboard sharing.

3. **Joining Groups**
   - Fast join modal using the group's invite code.
   - Real-time member rosters showing member avatars, names, and wishlist readiness indicators.

4. **Secret Random Assignment (Derangement Algorithm)**
   - Mathematical guarantee: $\forall i, \text{assign}(i) \ne i$. Nobody ever gives to themselves.
   - Closed Hamiltonian cycle: Everyone gives to exactly one person and receives from exactly one person.
   - **Zero-Leak Backend Privacy**: The API endpoint `/api/groups/:id/my-assignment` only transmits the requester's own recipient. All other pairings remain secret in the database until the reveal date.

5. **Wishlist Management (Full CRUD)**
   - Add, edit, and delete gift suggestions with estimated prices, product links, preferences (sizes/colors), and priority tags (Top Wish, Liked, Nice to Have).
   - The assigned gift giver can view their secret recipient's wishlist directly on their assignment card!

6. **Interactive Dashboard & Mystery Reveal**
   - Active circles overview with live status indicators.
   - Mystery Gift Box card with interactive "Unwrap & Reveal" flip toggle and "Hide for Privacy" mode.
   - Post-reveal matrix: When the reveal date is reached (or when the organizer activates the test reveal mode), a multi-stage celebratory confetti explosion triggers, and the full exchange chain is displayed to all group members.

---

## 📁 Project Structure

```text
secretgift/
├── client/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                # Typed Fetch API client
│   │   ├── assets/             # Generated photographic hero & mystery assets
│   │   ├── components/         # Navbar, Countdown, SecretCard, Wishlist, etc.
│   │   ├── context/            # AuthContext (JWT, state, demo switcher)
│   │   ├── types/              # TypeScript data interfaces
│   │   ├── App.tsx             # Root layout controller
│   │   ├── index.css           # Tailwind CSS v4 styling & color definitions
│   │   └── main.tsx            # React DOM mounting
│   ├── index.html              # HTML entry point with Plus Jakarta Sans & Outfit fonts
│   ├── package.json
│   └── vite.config.ts          # Vite configuration with /api backend proxy
│
└── server/                     # Node.js + Express Backend
    ├── middleware/             # JWT auth verification middleware
    ├── models/                 # Mongoose schemas (User, Group, Wishlist)
    ├── routes/                 # Express API routers (auth, groups, wishlist)
    ├── utils/                  # Derangement pairing algorithm
    ├── store.ts                # Dual-mode store (MongoDB Atlas + reliable persistent fallback)
    ├── server.ts               # Express application entry point
    ├── .env.example            # Environment variables template
    └── package.json
```

---

## 🚀 Step-by-Step Installation & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**
- *(Optional)* **MongoDB** (Local instance or free MongoDB Atlas cluster). If MongoDB is not running, the backend automatically uses a persistent local JSON store in `data/database.json`, allowing you to run and grade the project with zero external dependencies!

---

### Step 1: Run the Backend (Server)

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd secretgift/server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` if you want to connect to your MongoDB Atlas connection string or custom JWT secret:*
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/secretgift
   JWT_SECRET=super_secret_jwt_internship_key_2026
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   You will see:
   ```text
   🎁 SecretGift backend listening at http://localhost:5000
   ```

---

### Step 2: Run the Frontend (Client)

1. Open a new terminal tab and navigate to the `client` directory:
   ```bash
   cd secretgift/client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🧪 Pre-Configured Demo Accounts (Ready to Test!)

The database is pre-seeded with a holiday group (`Winter Holiday Circle 2026`) and active members so you can test all features immediately without manually filling out forms:

| Name | Role | Email | Password |
|---|---|---|---|
| **Sarah Jenkins** | **Group Organizer** | `sarah@example.com` | `password123` |
| **Alex Rivera** | Participant | `alex@example.com` | `password123` |
| **Maya Patel** | Participant | `maya@example.com` | `password123` |
| **Liam Chen** | Participant | `liam@example.com` | `password123` |

*Tip: You can switch between users instantly using the **"Switch Active Account"** menu in the top-right navbar dropdown or the **1-Click Demo Accounts** in the Sign In modal.*

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` – Register a new user with hashed password.
- `POST /login` – Authenticate email & password, returns JWT.
- `POST /demo` – 1-click login as one of the pre-seeded demo users.
- `GET /demo-users` – List available demo accounts.
- `GET /me` – Get profile of the currently logged-in user.

### Gift Groups (`/api/groups`)
- `GET /` – Get all groups the authenticated user belongs to.
- `POST /` – Create a new group (sets creator as organizer, generates invite code).
- `POST /join` – Join a group using an invite code.
- `GET /:id` – Get group details, member rosters, and reveal status.
- `GET /:id/my-assignment` – Retrieve the user's secret match and their wishlist.
- `POST /:id/draw` – Organizer only: run Derangement shuffle and assign gifts.
- `POST /:id/reset-draw` – Organizer only: reset all assignments.
- `POST /:id/toggle-test-reveal` – Organizer only: preview the post-reveal state.

### Wishlist (`/api/wishlist`)
- `GET /` – Fetch the current user's wishlist items.
- `POST /` – Add a new wish (title, price, link, notes, priority).
- `PUT /:id` – Update an existing wish.
- `DELETE /:id` – Remove a wish.
- `GET /user/:targetUserId` – View a group member's wishlist (protected).

---

## 🛡️ Derangement Algorithm Details

A standard random shuffle can result in a user being assigned to themselves. To solve this, **SecretGift** implements a randomized Hamiltonian cycle:

```typescript
function generateAssignments(memberIds: string[]) {
  const shuffled = [...memberIds];
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Assign each person to the next in the cycle:
  // p[0] -> p[1], p[1] -> p[2], ..., p[n-1] -> p[0]
  return shuffled.map((giver, idx) => ({
    giverId: giver,
    recipientId: shuffled[(idx + 1) % shuffled.length],
  }));
}
```

This guarantees:
1. $P(\text{self-assignment}) = 0$.
2. Every person gives exactly one gift.
3. Every person receives exactly one gift.
4. Completes in deterministic $O(n)$ time with zero rejection-sampling retries.

---

## 📜 License
Apache-2.0. Built for Full-Stack Development Internship Task 1.
