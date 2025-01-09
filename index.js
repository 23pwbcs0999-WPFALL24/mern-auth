const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Welcome to the MERN Auth Backend!');
});


app.get('/api/signup', (req, res) => {
    res.send('Welcome to the Signup Endpoint! ');
});


app.get('/api/signin', (req, res) => {
    res.send('Welcome to the Signin Endpoint! ');
});


app.use('/api', authRoutes);


app.use((req, res) => {
    res.status(404).send('Error 404: Route not found. Please use the correct API endpoints.');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log("MongoDB connected successfully");
        });
    })
    .catch(err => console.error(err));
