



# **Express.js Authentication with MongoDB and Passport.js**

A Node.js-based project demonstrating how to build a complete authentication system with **Express.js**, **MongoDB**, and **Passport.js**. This application supports **OAuth 2.0 authentication** via Google.

## **Features**

- 🔐 User Authentication:
  - Google OAuth 2.0 login using Passport.js.
  - Secure sessions with cookies and `express-session`.
- 🗄️ MongoDB Integration:
  - Save user profiles to MongoDB using Mongoose.
- 🔄 CRUD Operations:
  - Build and test APIs with Create, Read, Update, and Delete functionality.
- 🔧 **Environment Variables**:
  - Secrets and keys managed securely using `.env` files.

---

## **Technologies Used**

- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **Passport.js**: Middleware for authentication.
- **dotenv**: Manage environment variables.

---

## **Installation**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/deepak2301/expressjs-passport-mongo.git
   cd expressjs-passport-mongo
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following keys:
   ```plaintext
   GOOGLE_CLIENT_ID=<your_google_client_id>
   GOOGLE_SECRET_KEY=<your_google_secret_key>
   SESSION_SECRET=<your_session_secret>
   MONGO_URI=<your_mongo_connection_string>
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`.

---

## **Usage**

1. Navigate to `http://localhost:3000/api/auth/google` to initiate Google OAuth login.
2. After successful login, the user profile will be saved to the MongoDB database.

---

## **File Structure**

```plaintext
.
├── models/
│   └── google-users.mjs   # Mongoose schema for storing user profiles
├── routes/
│   └── users.js            # Authentication routes
├── config/
│   └── passport.js        # Passport.js Google OAuth 2.0 strategy
├── .env                   # Environment variables
├── .gitignore             # Ignored files (e.g., node_modules, .env)
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```

---


---



## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

- **Author**: Deepak Mishra  
- **GitHub**: [@deepak2301](https://github.com/deepak2301)

---

