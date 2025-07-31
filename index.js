const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection URI - Replace <db_password> and <dbname> with your details
const uri = "mongodb+srv://tomasfss004:J9Y5Z6KibdqCAUa@cluster0.8p3wk.mongodb.net/MotoclubDB?retryWrites=true&w=majority";

// Create a new MongoClient instance
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('MotoclubDB'); // Specify your database name here
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

app.post('/save', async (req, res) => {
    const { name, total } = req.body;
    const date = new Date();

    if (!name || total == null) {
        return res.status(400).send('Name and total are required');
    }

    try {
        const database = await connectToDatabase();
        const collection = database.collection('MotoclubCollection'); // Specify your collection name here

        const record = {
            name: name,
            date: date,
            total: total,
        };

        const result = await collection.insertOne(record);
        console.log(`New record created with the following id: ${result.insertedId}`);
        res.status(201).send({ message: 'Data saved successfully', id: result.insertedId });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data. Check server logs for details.');
    }
});

// Default route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
