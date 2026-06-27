# WTWR (What to Wear?): Back End

<<<<<<< HEAD

# The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

The Problem
Deciding what to wear requires checking the weather forecast and manually figuring out which clothes match the temperature. The WTWR backend solves this by storing clothing data categorized by weather conditions, enabling the application to dynamically cross-reference real-time weather data and instantly suggest the perfect outfit.

What a user can do
Through the client interface powered by this backend, users can: Get Weather-Based Recommendations: Receive instant outfit suggestions tailored entirely to the live outdoor temperature. Manage a Digital Wardrobe: Upload new clothing items and categorize them by weather type (e.g., hot, warm, cold). Interact with Items: Like or unlike specific clothing pieces to save preferences. Securely Sync Data: Register and log in to save their unique wardrobe and preferences across devices.

Technologies and Techniques
Node.js / Express: Core framework used to build the server architecture and manage the REST API routing.MongoDB / Mongoose: NoSQL database and Object Data Modeling library used to store and validate user accounts and weather-categorized clothing schemas. JSON Web Tokens (JWT): Utilized for token-based user authentication and route authorization. bcryptjs: Implemented for hashing and securely storing user passwords.

Engineering approaches
REST API Architecture: Clean, stateless HTTP endpoints (/users, /items) to handle profile management and wardrobe requests. Data Categorization Logic: Database schemas structured to filter clothing items based on temperature ranges and weather conditions. Security & Validation: Centralized error handling and custom middleware to protect private user data and restrict unauthorized actions. Cloud Deployment: Hosted on a remote machine (VPS) to provide a live, reliable API for the client application.

> > > > > > > d880c68c3790ca3816bf445c9686882055014513

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
