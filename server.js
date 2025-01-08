// Importing required modules
const express = require('express'); // Express is a web application framework for Node.js that provides functionalities to create APIs and web servers.
const mongoose = require('mongoose'); // Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js, used for database interaction.
const cors = require('cors'); // CORS (Cross-Origin Resource Sharing) middleware to allow cross-origin requests.
const authRoutes = require('./routes/auth'); // Importing routes from the 'auth' module to handle authentication-related API endpoints.
require('dotenv').config(); // dotenv allows loading environment variables from a .env file into `process.env`.

// Initializing the Express application
const app = express();

// Defining the port for the server
const PORT = process.env.PORT || 5000;
// `process.env.PORT` allows using an environment-specified port, e.g., in production. Default is 5000 if not set.

// Middleware setup
app.use(cors());
// Enables Cross-Origin Resource Sharing, allowing your API to be accessible from different domains.

app.use(express.json());
// Parses incoming JSON requests and makes their content available in `req.body`.

// Setting up routes
app.use('/api', authRoutes);
// Registers all routes from the `authRoutes` module under the `/api` path.
// Example: A route defined as `/login` in `authRoutes` would be accessible as `/api/login`.

// MongoDB connection
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         // If the connection is successful, the server starts listening on the defined port
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//             console.log("mongodb connected successfully")
//         });
//     })
//     .catch(err => console.error(err));
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log("mongodb connected successfully");
        });
    })
    .catch(err => console.error(err));

// Logs errors if the database connection fails. Useful for debugging issues like incorrect URI or network problems.

// Explanation of `mongoose.connect` options:
// - `useNewUrlParser`: Ensures Mongoose uses the new MongoDB driver's connection string parser.
// - `useUnifiedTopology`: Opts into the MongoDB driver's new connection management engine for better performance.
// (Note: These options are deprecated and have no effect in MongoDB Driver 4.0+.)

