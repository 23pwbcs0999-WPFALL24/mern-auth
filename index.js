const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Importing routes from the 'auth' module to handle authentication-related API endpoints.
require('dotenv').config();


const app = express();


const PORT = process.env.PORT || 5000;

app.use(cors());


app.use(express.json());


app.use('/api', authRoutes);
// Fallback route for root access
app.get('/', (req, res) => {
    res.send('Welcome to the MERN Auth Backend! Use /api/signup, /api/signin, or /api/protected to interact with the API.');
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).send('Error 404: Route not found. Please use the correct API endpoints.');
});

// MongoDB connection

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log("mongodb connected successfully");
        });
    })
    .catch(err => console.error(err));

