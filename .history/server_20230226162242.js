const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
// const path = require('path');
const { default: mongoose } = require('mongoose');
const { mongooseToObject } = require('../ExpressJs/src/mongoose');


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
    email: { type: String},
    address: { type: String},
    phone: { type: String},
  },{
    collection:'acount'
  });
const acount=mongoose.model('acount',acountSchema)

const productSchema = new Schema({
  name:{type:String},
  price:{type:Number},
  img:{type:String}

  },{
    collection:'product'
  });
const product=mongoose.model('product',productSchema)

const billSchema = new Schema({
  id_user:{type:String},
  total:{type:Number},
  },{
    collection:'bill',
    timestamps:true
  });
const bill=mongoose.model('bill',billSchema)

const detailBillSchema = new Schema({
  id_user:{type:String},
  id_product:{type:String},
  quantity:{type:Number},
  },{
    collection:'detailBill',
    timestamps:true
  });
const detailBill=mongoose.model('detailBill',detailBillSchema)

app.get('/', (req, res) => {
  res.send('Home')
})

app.get('/acount', (req, res) => {
  acount.find({},(err,result)=>{
    // if (err) throw err;
    console.log(result);
    res.send(result)
  })
})

app.get('/product', (req, res) => {
  product.find({},(err,result)=>{
    // if (err) throw err;
    console.log(result);
    res.send(result)
  })
})

app.get('/bill', (req, res) => {

  // bill.find()
  // .then((bill)=>{
  //   res.send(bill)
  // })
  // .catch()
  const a=[]
  acount.find({_id:'63f9ce6cb427f60b39f5b9b7'})
  .then((bill)=>{
    a=bill
    res.send(a)
  })
  .catch()


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})