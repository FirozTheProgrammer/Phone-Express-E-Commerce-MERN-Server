const express = require("express");
const cros = require("cors");

const app = express();
const port = process.env.PROT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// midelware
app.use(cros());
app.use(express.json());

const uri =
  "mongodb+srv://firozhasan1542:vNAJMze2izzpi3cl@cluster0.erw5vvy.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const phoneCollection = client.db("phoneDB").collection("phone");

    app.get("/phone", async (req, res) => {
      const cursor = phoneCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/phone/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await phoneCollection.findOne(query);
      res.send(result);
    });

    app.post("/phone", async (req, res) => {
      const newphone = req.body;
      console.log(newphone);
      const result = await phoneCollection.insertOne(newphone);
      res.send(result);
    });

    app.put("/phone/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedphone = req.body;
      const phone = {
        $set: {
          image: updatedphone.image,
          name: updatedphone.name,
          brand: updatedphone.brand,
          type: updatedphone.type,
          price: updatedphone.price,
          description: updatedphone.description,
          rating: updatedphone.rating,
        },
      };
      const result = await phoneCollection.updateOne(filter, phone, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Phone shop is running");
});

app.listen(port, () => {
  console.log(`Phone shop is running on prot : ${port}`);
});
