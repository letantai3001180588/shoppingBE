const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
const path = require('path');
const { default: mongoose } = require('mongoose');


const app = express()
const port = 3000
db.connectDB();


app.use(bodyParser.urlencoded({
  extended:false
}))
app.use(bodyParser.json())


const Schema = mongoose.Schema;
const acountSchema = new Schema({
    user: { type: String},
    password: { type: String},
  },{
    collection:'acount'
  });
const acount=mongoose.model('acount',acountSchema)

const productSchema = new Schema({
    user: { type: String},
    password: { type: String},
  },{
    collection:'acount'
  });
const product=mongoose.model('product',productSchema)


app.get('/', (req, res) => {
  acount.find({},(err,result)=>{
    if (err) throw err;
    console.log(result);
    res.send(result)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})