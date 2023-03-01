const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
const path = require('path');
const { default: mongoose } = require('mongoose');


const app = express()
const port = 3000
db.connectDB();

// const MongoClient = require('mongodb').MongoClient;
// const url ='mongodb+srv://taiphuloc56:thienhavodich@cluster-shopping.armngar.mongodb.net/?retryWrites=true&w=majority'

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.createCollection("customers", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

// db.createCollection("acount")    

app.use(bodyParser.urlencoded({
  extended:false
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({
  extended:true
}))
app.use(express.json())


const Schema = mongoose.Schema;
const acountSchema = new Schema({
    user: { type: String},
    password: { type: String},
  },{
    collection:'acount'
  });
  const acount=mongoose.model('acount',acountSchema)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})