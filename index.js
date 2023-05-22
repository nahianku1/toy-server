let express = require("express");
let cors = require("cors");
let dotenv = require("dotenv");
let app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  })
);

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

app.get("/", async (req, res) => {
  res.send(`Server is running!`);
});

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
          res.send({ msg: "No item found" });
        }
        await client.close();
      }
    }
  } catch (e) {
    res.send(`Failed to fetch`);
  }
});

app.get("/sorted-toys", async (req, res) => {
  console.log(req.query);
  try {
    if (req.query.sort === "-1") {
      console.log(`entered`);
      await client.connect();
      let result = await client
        .db("edufundb")
        .collection("alltoys")
        .find({ selleremail: req.query.email })
        .sort({
          price: -1,
        })
        .toArray();

      if (result) {
        if (result.length > 0) {
          res.send(result);
          console.log(83, result);
        } else {
          res.send({ msg: "Not Found" });
        }
        await client.close();
      }
    } else {
      console.log(`second entered`);
      await client.connect();
      let result = await client
        .db("edufundb")
        .collection("alltoys")
        .find({ selleremail: req.query.email })
        .toArray();

      if (result) {
        if (result.length > 0) {
          res.send(result);
          console.log(102, result);
        } else {
          res.send({ msg: "Not Found" });
        }
        await client.close();
      }
    }
  } catch (e) {
    res.send(e);
  }
});

app.get("/single-toy/:id", async (req, res) => {
  console.log(req.params);
  try {
    await client.connect();
    let result = await client
      .db("edufundb")
      .collection("alltoys")
      .findOne({
        _id: new ObjectId(req.params.id),
      });

    if (result) {
      res.send(result);
      console.log(result);
      await client.close();
    } else {
      res.send(`Failed to Save`);
    }
  } catch (e) {
    res.send(e);
  }
});

app.post("/add-toy", async (req, res) => {
  console.log(req.body);
  let { price } = req.body;
  let convertedPrice = Number(price);
  await client.connect();
  let result = await client
    .db("edufundb")
    .collection("alltoys")
    .insertOne({
      ...req.body,
      price: convertedPrice,
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

app.get("/all-toys", async (req, res) => {
  let page = Number(req.query.page);
  let limit = Number(req.query.itemPerPage);
  let skip = (page - 1) * limit;
  console.log({ page, limit });
  try {
    await client.connect();
    let result = await client
      .db("edufundb")
      .collection("alltoys")
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();
    let totalrecord = await client
      .db("edufundb")
      .collection("alltoys")
      .estimatedDocumentCount();
    let totalPage = Math.ceil(totalrecord / limit);
    if (result.length > 0) {
      res.send({ result, totalPage });
    } else {
      res.send({ msg: "No item found!" });
    }
    await client.close();
  } catch (e) {
    console.log(e.message);
  }
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
