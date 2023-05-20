let express = require("express");
let cors = require("cors");
let dotenv = require("dotenv");
let app = express();
dotenv.config();

let PORT = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = process.env.DB_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(express.json());
app.use(cors());

app.get("/tab-details", async (req, res) => {
  await client.connect();
  let result = await client
    .db("edufundb")
    .collection("tabcollection")
    .find()
    .toArray();
  if (result) {
    res.send(result);
    await client.close();
  } else {
    res.send(`Failed to fetch`);
  }
});
app.get("/my-toys", async (req, res) => {
  try {
    if (req.query.email !== "undefined") {
      console.log(req.query);
      await client.connect();
      let result = await client
        .db("edufundb")
        .collection("alltoys")
        .find({
          selleremail: req.query.email,
        })
        .toArray();
      if (result) {
        if (result.length > 0) {
          res.send(result);
          console.log(51, result);
        } else {
          res.send(["No item found"]);
        }
        await client.close();
      }
    }
  } catch (e) {
    res.send(`Failed to fetch`);
  }
});

app.post("/add-toy", async (req, res) => {
  console.log(req.body);
  await client.connect();
  let result = await client
    .db("edufundb")
    .collection("alltoys")
    .insertOne({
      ...req.body,
    });

  if (result) {
    res.send(result);
    console.log(result);
    await client.close();
  } else {
    res.send(`Failed to Save`);
  }
});

app.put("/my-toys-update/:id", async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  let filter = { _id: new ObjectId(req.params.id) };
  await client.connect();
  let result = await client
    .db("edufundb")
    .collection("alltoys")
    .updateOne(filter, {
      $set: { ...req.body },
    });

  if (result) {
    res.send(result);
    console.log(result);
    await client.close();
  } else {
    res.send(`Failed to Update`);
  }
});
app.delete("/my-toys-delete/:id", async (req, res) => {
  console.log(req.params.id);
  let filter = { _id: new ObjectId(req.params.id) };
  await client.connect();
  let result = await client
    .db("edufundb")
    .collection("alltoys")
    .deleteOne(filter);

  if (result) {
    res.send(result);
    console.log(result);
    await client.close();
  } else {
    res.send(`Failed to Delete`);
  }
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
