# Zenith Server

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-SDK-blue.svg)](https://stripe.com/)

Zenith Server is the robust Node.js, Express & TypeScript backend powering the **Zenith Luxury Accommodation & Membership Ecosystem**. It serves REST endpoints for user authentication, admin panel management, listing CRUD operations, and securely coordinates payment sessions with Stripe.

---

## ⚙️ Core Architecture & Features

### 🔐 JWT Authentication & Security
- **Secure Authentication**: Password hashing using `bcryptjs` and token generation/verification via `jsonwebtoken` (JWT).
- **Role-Based Authorization**: Middleware restrictions separating standard `user` actions from `admin` endpoints (e.g. managing users, viewing global dashboard stats, rejecting reservations).

### 🏡 Property Listings API (CRUD)
- **Database Listings**: Fetching, adding, deleting, and updating listings from MongoDB.
- **Manual Tags**: Automatic injection of `isManuallyCreated` flags on user-created listings to ensure real-time "New Available" tags bock on the frontend while avoiding mock-data pollution.
- **Spec Handlers**: Dynamic verification and default validation for accommodation counts (guests, beds, bedrooms, bathrooms).

### 💳 Stripe Checkout Integration
- **Stripe Checkout Sessions**: Creates secure checkout sessions for subscriptions (Silver/Gold tiers) and automatically mounts frontend success/cancellation links.
- **Secure Verification**: Direct backend session retrieval and payment verification with the Stripe API before updating database profiles, bypassing local webhook constraints.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express (v5)
- **Database**: MongoDB (via Mongoose ODM)
- **Payments**: Stripe Node SDK
- **Security**: JWT (jsonwebtoken), BCryptJS
- **Configuration**: Dotenv, CORS
- **Dev-tools**: Nodemon, TS-Node

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have a running MongoDB instance (or MongoDB Atlas URI) and a Stripe Account (with access to test API keys).

### 🔧 Installation & Setup

1. Clone the repository and navigate to the server folder:
   ```bash
   cd typescript-projects-server
   ```

2. Install server dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_secret
   STRIPE_SECRET_KEY=your_stripe_sk_test_key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Seed the database** (adds premium fallbacks and admin records):
   ```bash
   npx ts-node src/seed.ts
   ```

5. Run the server in development mode:
   ```bash
   npm run dev
   ```
   The backend API will run on [http://localhost:5001](http://localhost:5001).

---

## 🛣️ API Endpoints

### Auth Route (`/api/auth`)
- `POST /register` - Register a new account.
- `POST /login` - Authenticate credentials and return JWT.
- `PUT /profile` - Update profile name and avatar.
- `GET /users` - List all registered users (Admin only).
- `DELETE /users/:id` - Delete user account (Admin only).

### Listings Route (`/api/listings`)
- `GET /` - Fetch all properties.
- `POST /` - Add a new luxury property.
- `GET /my` - Fetch current user's listings.
- `GET /:id` - Fetch single property details.
- `PUT /:id` - Update listing details (specs, price, location, images).
- `DELETE /:id` - Remove property listing.

### Payments Route (`/api/payments`)
- `POST /create-checkout-session` - Initialize Stripe Checkout session for Silver/Gold tiers.
- `POST /verify-session` - Retrieve checkout status from Stripe and upgrade user membership tier.
