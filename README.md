# Uber-backend

## 🚗 Project Overview

This is the backend server for the Uber-style ride-hailing application built using **Node.js**, **Express**, **MongoDB**, and **Socket.io**. It supports real-time ride booking where users can request rides and captains can accept or reject them dynamically.

Key features:
- Real-time communication with WebSockets (`socket.io`) for instant ride updates.
- Integration with Google Maps API for real-time location tracking and route optimization.
- JWT-based authentication and token blacklisting for secure API access.
- Estimated fare calculation based on distance and demand.
- Modular MVC architecture separating concerns (controllers, models, services, routes).
- Middleware for authentication and request validation.

---

---

## ⚙️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- Google Maps API key for location services

---

### Installation steps

1. **Clone the repo**


git clone https://github.com/SamarthSolanki1/samarthsolanki1-uber-backend.git
cd samarthsolanki1-uber-backend

 2. npm install
 3. PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
 4 npm start


## 🔌 API Overview
The backend exposes RESTful APIs for:

User registration, login, and profile management

Captain registration, availability, and ride management

Ride booking, acceptance, and real-time updates via Socket.io

Map-related services (location tracking, route optimization)

Authentication middleware securing protected routes

Refer to the routes/ and controllers/ folders for detailed API endpoints.

## 🔄 Real-time Communication
The project uses Socket.io to enable real-time communication between users and captains:

When a user requests a ride, the request is pushed instantly to available captains.

Captains can accept or reject rides, and the status updates back to the user in real-time.

Location updates are transmitted live for tracking during the ride.

## 🛡️ Authentication
Uses JWT tokens for user and captain authentication.

Implements a blacklist token model to handle logout and token revocation.

auth.middleware.js protects API routes ensuring only authorized access.

 ## 📚 Technologies Used
Node.js & Express.js

MongoDB & Mongoose

Socket.io for WebSocket communication

JSON Web Tokens (JWT) for authentication

Google Maps API for geolocation & routing

## 🤝 Contribution
Feel free to fork the repository and create pull requests for bug fixes or new features.





