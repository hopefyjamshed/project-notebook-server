const cors = require('cors');
const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // posting data to database
        app.post('/upload', async (req, res) => {
            const query = req.body
            const result = await uploadCollection.insertOne(query)
            res.send(result)
        })

        // get uplodet data from database 
        app.get('/uploaded', async (req, res) => {
            const query = {}
            const result = await uploadCollection.find(query).toArray()
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