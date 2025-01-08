// Importing required modules
const express = require('express'); // Express is used to create the router for handling authentication routes.
const bcrypt = require('bcryptjs'); // bcryptjs is used for hashing passwords to securely store them in the database.
const jwt = require('jsonwebtoken'); // jsonwebtoken is used to create and verify JSON Web Tokens (JWT) for authentication.
const User = require('../models/User'); // Importing the User model to interact with the MongoDB collection for user data.

const router = express.Router(); // Creating a new Express Router instance for defining authentication routes.

// Route for user sign-up
router.post('/signup', async (req, res) => {
    console.log("im inside signup controller");
    const { username, email, password } = req.body; // Extracting user input from the request body.

    try {
        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' }); // Respond with error if the email is already registered.
        }

        // Hash the user's password using bcrypt for security
        const hashedPassword = await bcrypt.hash(password, 10); // `10` is the salt rounds, determining hash complexity.

        // Create a new user document and save it to the database
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Respond with a success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for user sign-in
router.post('/signin', async (req, res) => {
    console.log("I am inside sign in");
    const { email, password } = req.body; // Extracting login credentials from the request body.

    try {
        // Find the user by email in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Respond with error if user is not found.
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Respond with error if passwords don't match.
        }

        // Generate a JSON Web Token (JWT) for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // `process.env.JWT_SECRET` is used as the secret key for signing the token.
        // The token expires in 1 hour (`expiresIn: '1h'`).

        // Send the token to the client
        res.json({ token });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for accessing protected resources
router.get('/protected', (req, res) => {
    console.log("Protected route hit");
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Extracted Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        console.log("Decoded Token Payload:", decoded);
        res.json({ message: 'Protected data', userId: decoded.id });
    });
});


module.exports = router; // Exporting the router to be used in the server.js file.
