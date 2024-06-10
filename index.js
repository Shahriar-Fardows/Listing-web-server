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

    const userEmail = client.db("user").collection("email");
    const countryCollection = client.db("country").collection("city");
    const categoryCollection = client.db("categorys").collection("category");
    const sponsor = client.db("sponsor").collection("lists");
    const post = client.db("user").collection("post");

    // Country API ---------------------------------------------------

    // Get all emails and password
    app.get("/email", async (req, res) => {
      try {
        const cursor = await userEmail.find({});
        const data = await cursor.toArray();
        res.json(data);
      } catch (err) {
        console.error("Error getting data:", err);
        res.status(500).json({ message: "Error getting data 41" });
      }
    });

    // Post a new email and password
    app.post("/email", async (req, res) => {
      try {
        const data = req.body;
        const result = await userEmail.insertOne(data);
        res.json(result);
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ message: "Error inserting data 70" });
      }
    });

    // Country API ---------------------------------------------------

    // Get all countries
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

    // Post a new country
    app.post("/country", async (req, res) => {
      try {
        const data = req.body;
        const result = await countryCollection.insertOne(data);
        res.json(result);
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ message: "Error inserting data 70" });
      }
    });
    

    // sponsor  API ---------------------------------------------------

    // Get all sponsors
    app.get("/sponsor", async (req, res) => {
      try {
        const cursor = await sponsor.find({});
        const data = await cursor.toArray();
        res.json(data);
      } catch (err) {
        console.error("Error getting data:", err);
        res.status(500).json({ message: "Error getting data 41" });
      }
    });

    // Category API ---------------------------------------------------

    // Get all categories
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

    // Post a new category
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

    // Delete category by id
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

    // Delete a sub-category from a category
    app.delete("/:categoryId/sub-category/:subCategoryName", async (req, res) => {
      try {
          const categoryId = req.params.categoryId;
          const subCategoryName = req.params.subCategoryName;
          const result = await categoryCollection.updateOne(
              { _id: new ObjectId(categoryId) },
              { $pull: { sub_categories: subCategoryName } }
          );
          res.json(result);
      } catch (err) {
          console.error("Error deleting sub-category:", err);
          res.status(500).json({ message: "Error deleting sub-category" });
      }
  });
  

    // End Category API ---------------------------------------------------


    // Post api for user ---------------------------------------------------

    // Get all posts

    app.get("/post", async (req, res) => {
      try {
        const cursor = await post.find({});
        const data = await cursor.toArray();
        res.json(data);
      } catch (err) {
        console.error("Error getting data:", err);
        res.status(500).json({ message: "Error getting data 41" });
      }
    });

    // get all posts by id
    
    app.get("/post/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const cursor = await post.find({ _id: new ObjectId(id) });
        const data = await cursor.toArray();
        res.json(data);
      } catch (err) {
        console.error("Error getting data:", err);
        res.status(500).json({ message: "Error getting data 41" });
      }
    });
    

    // post all posts
    app.post("/post", async (req, res) => {
      try {
        const data = req.body;
        const result = await post.insertOne(data);
        res.json(result);
      } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ message: "Error inserting data 70" });
      }
    });




    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensure the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
