const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2bthq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try {
        await client.connect();
        const database = client.db('travelAgency');
        const packagesCollection = database.collection('packages');
        const bookingsCollection = database.collection('bookings');

        // Get Packages API
        app.get('/packages', async(req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // Get Bookingss API
        app.get('/bookings', async(req, res) => {
            console.log(req.query);
            const query = req.query;
            const cursor = bookingsCollection.find(query);
            const bookings = await cursor.toArray();
            res.send(bookings);
        });

        // Get Single Package API
        app.get('/packages/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singlePackage = await packagesCollection.findOne(query);
            res.json(singlePackage);
        });

        // Insert a Booking API
        app.post('/bookings', async(req, res) => {
            const newBooking = req.body;
            const result = await bookingsCollection.insertOne(newBooking);
            console.log('hitting', req.body);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        });

        // Delete a Booking API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            console.log('deleting id', result);
            res.json(result);
        });
        
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running.');
});

app.listen(port, () => {
    console.log('server is running on port', port);
});