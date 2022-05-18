const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongodb = require("mongodb");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config();
app.use(express.json());
// connect mongodb database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmpzz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
const run = async () => {
    try {
        await client.connect();
        console.log("Database Connected");
        const TaskCollection = client.db("AllTasks").collection("Task");

        app.get("/tasks", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const data = TaskCollection.find(query);
            const result = await data.toArray();
            res.status(200).send(result);
        });
        app.post("/tasks", async (req, res) => {
            const newTask = req.body;

            const result = await TaskCollection.insertOne(newTask, {
                writeConcern: { w: "majority", wtimeout: 5000 },
            });
            res.send(result);
        });
        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: mongodb.ObjectId(id) };
            const result = await TaskCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
    }
};
run().catch(console.dir);
app.get("/", (reqest, res) => {
    res.status(200).send("Hello I'm set and listening form doctor portal");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(` Hello I'm Listening on port ${port}...`));
