const cors = require('cors');
const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const { query } = require('express');
const port = process.env.PORT || 5000;

// middlewere
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is running successfully')
})

// mongodb connection 



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.jle6tre.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const uploadCollection = client.db('notebook').collection('upload')
        const commentCollection = client.db('notebook').collection('comment')
        const profileCollection = client.db('notebook').collection('profile')


        // posting data to database
        app.post('/upload', async (req, res) => {
            const query = req.body
            const result = await uploadCollection.insertOne(query)
            res.send(result)
        })

        // profile data 

        app.post('/profile', async (req, res) => {
            const query = req.body
            const result = await profileCollection.insertOne(query)
            res.send(result)
        })

        // getting profile data by email 

        app.get('/profile/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const result = await profileCollection.find(filter).toArray()
            res.send(result)
        })

        app.post('/comment', async (req, res) => {
            const query = req.body
            const result = await commentCollection.insertOne(query)
            res.send(result)
        })

        // get uplodet data from database 
        app.get('/uploaded', async (req, res) => {
            const query = {}
            const result = await uploadCollection.find(query).sort({ '_id': -1 }).toArray()
            res.send(result)
        })

        // getting uploaded data by id 
        app.get('/uploaded/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await uploadCollection.find(filter).toArray()
            res.send(result)
        })
        // getting comment 
        app.get('/comment', async (req, res) => {
            const query = {}
            const result = await commentCollection.find(query).toArray()
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(err => console.log(err))


app.listen(port, () => {
    console.log(`notebook server is running on ${port}`)
})