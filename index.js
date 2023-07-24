const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
// const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hxno4y0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const collegeCollection = client.db('brightStorm').collection('college')
        const reviewCollection = client.db('brightStorm').collection('review')
        const applyCollection = client.db('brightStorm').collection('apply')

        app.get('/college', async (req, res) => {
            const cursor = collegeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/college/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const college = await collegeCollection.findOne(query);
            res.send(college)
        })

        app.post('/apply', async (req, res) => {
            const classes = req.body
            console.log(classes)
            const result = await applyCollection.insertOne(classes)
            res.send(result)
        })
        app.get('/apply', async (req, res) => {
            const cursor = applyCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/apply/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await applyCollection.findOne(query);
            res.send(user);
        })

        app.post('/review', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('admission is running')
})

app.listen(port, () => {
    console.log(`college admission is running on port ${port}`)
})