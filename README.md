# 🎁 SecretGift – Anonymous Gift Exchange

## 📌 Project Overview

**SecretGift** is a full-stack web application that makes gift exchanges fun, private, and organized.

Users can create a private gift exchange group, invite friends using a unique invite code, set a gift budget and reveal date, and let the system randomly assign each participant a secret gift recipient.

Each participant can only see **their own assigned recipient**, keeping the exchange anonymous until the reveal date.

---

## ✨ Features

### 🔐 User Authentication

- User registration
- User login
- User logout
- Secure authentication using JWT
- Password encryption using bcrypt

### 🎁 Gift Group Management

- Create a private gift exchange group
- Enter a group name
- Set a gift budget
- Set a reveal date
- Generate a unique invite code

### 👥 Join Groups

- Join a group using an invite code
- View group members
- Manage active gift exchange groups

### 🎲 Secret Random Assignment

- Randomly assign each member another participant
- Users cannot be assigned to themselves
- Assignments remain private
- Each user can only see their own recipient

### 📝 Wishlist Management

Users can:

- Add gift wishes
- Edit gift wishes
- Delete gift wishes

The assigned gift giver can view their recipient's wishlist.

### 📊 Dashboard

The dashboard displays:

- Active gift groups
- Gift budget
- Reveal date
- Group members
- Secret recipient
- Countdown to the reveal date

### 🎉 Final Reveal

After the reveal date, the application can reveal all secret gift assignments to the group members.

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt

---

## 🎨 Design Theme

SecretGift uses a unique and modern color palette:

- 🌊 Deep Teal
- 🪸 Coral
- 💎 Aqua
- 🌟 Soft Yellow

The application is designed to feel:

- Modern
- Fun
- Festive
- Mysterious
- Responsive

---

## 📁 Project Structure

```text
secretgift/
│
├── client/                 # Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd secretgift
```

---

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the values with your own MongoDB connection string and JWT secret.

---

## ▶️ Running the Application

### Start the Backend

```bash
cd server
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

## 🔄 How SecretGift Works

### Step 1: Create an Account

The user registers and logs into the application.

### Step 2: Create a Gift Group

The user creates a private gift exchange group.

Example:

```text
Group Name: Christmas Surprise 🎄
Budget: ₹1000
Reveal Date: December 25
```

### Step 3: Share the Invite Code

The system generates a unique invite code.

Other users can join the group using this code.

### Step 4: Add Wishlists

Each participant adds gift ideas to their personal wishlist.

### Step 5: Generate Secret Assignments

The system randomly assigns every participant another person.

Example:

```text
User A → User B
User B → User C
User C → User D
User D → User A
```

No participant can be assigned to themselves.

### Step 6: Keep It Secret 🤫

Each user can only see their own assigned recipient.

### Step 7: Reveal 🎉

After the reveal date, all assignments can be displayed.

---

## 🗄️ Database Collections

### 👤 Users

```text
User
├── name
├── email
├── password
└── createdAt
```

### 🎁 Gift Groups

```text
GiftGroup
├── groupName
├── createdBy
├── members
├── budget
├── inviteCode
├── revealDate
└── createdAt
```

### 🎲 Assignments

```text
Assignment
├── groupId
├── giver
├── recipient
└── isRevealed
```

### 📝 Wishlists

```text
Wishlist
├── userId
├── groupId
├── itemName
└── description
```

---

## 🔒 Security

- Passwords are encrypted using bcrypt.
- Protected routes use JWT authentication.
- Users can only access authorized data.
- Secret assignments remain private before the reveal date.

---

## 🚀 Future Improvements

Possible future features include:

- 📧 Email invitations
- 🔔 Reveal date notifications
- 💬 Anonymous messages
- 🎁 Gift suggestions
- 🤖 AI-powered wishlist suggestions
- 🌐 Public deployment
- 📱 Improved mobile experience

---

## 🎯 Project Purpose

This project was developed as a **Full-Stack Development Internship Task**.

It demonstrates:

- Frontend development
- Backend development
- REST APIs
- Authentication
- Database management
- CRUD operations
- User authorization
- Full-stack application development

---

## 👩‍💻 Author

**Pooja G**

---

### 🎁 Made with React, Node.js, Express.js and MongoDB
