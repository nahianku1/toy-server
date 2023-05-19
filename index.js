let express = require("express");
let cors = require("cors");
let dotenv = require("dotenv").config();
let app = express();

let PORT = process.env.PORT || 5000;
app.use(cors());

app.get('/',(req,res)=>{
    res.send(`Welcome to Server`)
})
app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});
