const { MongoClient, Logger } = require('mongodb');
const express = require('express');
const { ObjectID } = require('bson');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const config = { uri: "mongodb+srv://test:CR2nur7khJ5UfD53@cluster0.qt9ah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", port: 3000 }
const client = new MongoClient(config.uri, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000, keepAlive: 1 });
client.connect((err, mongo) => {
    if (err) console.error(`Failed to connect to the database. ${err.stack}`);
    app.locals.mongo = mongo;
    app.listen(config.port, () => {
        console.info(`Node.js app is listening at http://localhost:${config.port}`);
    });
});

//CREATE
app.post('/', async (req, res) => {
    try {
        const mongo = req.app.locals.mongo;
        const collection = mongo.db("Test").collection("bookings");
        const body = req.body;
        let data = {
            title: body.title,
            price: body.price,
            description: body?.description,
            image: body?.image,
            created_at: (new Date()).toISOString(),
            updated_at: (new Date()).toISOString()
        };
        const result = await collection.insertOne(data);
        data._id = result.insertedId;
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

//CREATE MULTIPLE
app.post('/many', async (req, res) => {
    try {
        const mongo = req.app.locals.mongo;
        const collection = mongo.db("Test").collection("bookings");
        const body = req.body;
        let data = [];
        await body.forEach(val => {
            data.push({
                title: val.title,
                price: val.price,
                description: val?.description,
                image: val?.image,
                created_at: (new Date()).toISOString(),
                updated_at: (new Date()).toISOString()
            })
        });
        const result = await collection.insertMany(data);
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

//READ
app.get('/', async (req, res) => {
    res.send("WELCOME TO TEST BOOKING");
});

//READ
app.get('/:id', async (req, res) => {
    try {
        const mongo = req.app.locals.mongo;
        const collection = mongo.db("Test").collection("bookings");
        const id = req.params.id;
        const result = await collection.findOne({ _id: new ObjectID(id) });
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

//FIND WHICH PRICE's BELOW
app.get('/price-below/:price', async (req, res) => {
    try {
        const mongo = req.app.locals.mongo;
        const collection = mongo.db("Test").collection("bookings");
        const price = Number(req.params.price);
        await collection.find({ price: { $lt: price } }).sort({ price: 1 }).toArray((err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    } catch (error) {
        res.send(error);
    }
});

//UPDATE
app.put('/:id', async (req, res) => {
    try {
        const mongo = req.app.locals.mongo;
        const collection = mongo.db("Test").collection("bookings");
        const id = req.params.id;
        const body = req.body;
        const data = {
            $set: {
                title: body?.title,
                description: body?.description,
                price: body?.price,
                image: body?.image,
                updated_at: (new Date()).toISOString()
            }
        };
        const result = await collection.updateOne({ _id: new ObjectID(id) }, data);
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

//DELETE
app.delete('/:id', async (req, res) => {
    try {
        const mongo = req.app.locals.mongo;
        const collection = mongo.db("Test").collection("bookings");
        const id = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectID(id) });
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});
