const express = require('express')
const mongoose=require('mongoose')
// const connectDB=require('./db').ConnectDb
const app = express()
const port = 5000
const mongoDB =require("./db")
mongoDB();

app.get('/', (req, res) => {
  res.send('ajay')

})
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
  res.header("Access-Control-Allow-Headers",
  "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
})
app.use(express.json());
app.use("/api/",require("./Routes/CreateUser"));

app.listen(port, () => {
  console.log(`Your app listening on port ${port}`)
})
