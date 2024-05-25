const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@listing.tcnlxqb.mongodb.net/?retryWrites=true&w=majority&appName=listing`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // database name

    const countryCollection = client.db("country").collection("city");
    const categoryCollection = client.db("categorys").collection("category");

    // country api code ---------------------------------------------------

    // Get all country
    app.get("/country", async (req, res) => {
      try {
        const cursor = await countryCollection.find({});
        const data = await cursor.toArray();
        res.json(data);
      } catch (err) {
        console.error("Error getting data:", err);
        res.status(500).json({ message: "Error getting data 41" });
      }
    });

    // end country api code ---------------------------------------------------

    // category api code ---------------------------------------------------

    // Get all category
    app.get("/category", async (req, res) => {
      try {
        const cursor = await categoryCollection.find({});
        const data = await cursor.toArray();
        res.json(data);
      } catch (err) {
        console.error("Error getting data:", err);
        res.status(500).json({ message: "Error getting data 57" });
      }
    });

    // Add sub-category to a category
    app.post("/category/:id/sub-category", async (req, res) => {
      try {
        const id = req.params.id;
        const { sub_category } = req.body;
        const result = await categoryCollection.updateOne(
          { _id: new ObjectId(id) },
          { $push: { sub_categories: sub_category } }
        );
        res.json(result);
      } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ message: "Error updating data" });
      }
    });

    // post category

    app.post("/category", async (req, res) => {
      try {
        const data = req.body;
        const result = await categoryCollection.insertOne(data);
        res.json(result);
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ message: "Error inserting data 70" });
      }
    });

    // delete category by id

    app.delete("/category/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await categoryCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.json(result);
      } catch (err) {
        console.error("Error deleting data:", err);
        res.status(500).json({ message: "Error deleting data 85" });
      }
    });

    // end category api code ---------------------------------------------------

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensure the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
