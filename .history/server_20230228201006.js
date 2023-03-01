const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
// const path = require('path');
const { default: mongoose } = require('mongoose');
const { mongooseToObject } = require('../ExpressJs/src/mongoose');
const path = require('path')
const methodOverride=require('method-override')
const app = express()
const port = 3000
db.connectDB();


// app.use(bodyParser.urlencoded({
//   extended:false
// }))
// app.use(bodyParser.json())
app.use(express.urlencoded({
  extended:false
}))
app.use(express.json())
app.use(methodOverride('_method'))

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
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/',function(req,res) {
  res.sendFile('index.html');
});
app.get('/acount', (req, res) => {
  acount.find({},(err,result)=>{
    // if (err) throw err;
    console.log(result);
    res.send(result)
  })
})

app.post('/register', (req, res) => {
  res.send(req.body)
  const a=mongoose.model('acount',acountSchema)
  const acount=new a(req.body)
  acount.save()
  .then(() => res.redirect('/') )
  .catch(error => {})
})

app.use('/acount/delete/:id', (req, res) => {
  res.send(req.params.id)
  acount.deleteOne({_id:req.params.id})
  .then(() => {
    res.redirect('/'); 
  })
  .catch()
})
app.put('/acount/update/:id', (req, res) => {
  res.send(req.body)
  acount.updateOne({_id:req.params.id},req.body)
  .then(() => {
    res.redirect('/'); 
  })
  .catch()
})

app.get('/product', (req, res) => {
  product.find({},(err,result)=>{
    // if (err) throw err;
    console.log(result);
    res.send(result)
  })
})

app.post('/product/create', (req, res) => {
  res.send(req.body)
  const a=mongoose.model('product',acountSchema)
  const product=new a(req.body)
  product.save()
  .then(() => res.redirect('/') )
  .catch(error => {})
})

app.use('/product/delete/:id', (req, res) => {
  res.send(req.params.id)
  product.deleteOne({_id:req.params.id})
  .then(() => {
    res.redirect('/'); 
  })
  .catch()
})
app.put('/product/update/:id', (req, res) => {
  res.send(req.body)
  product.updateOne({_id:req.params.id},req.body)
  .then(() => {
    res.redirect('/'); 
  })
  .catch()
})


app.get('/bill', (req, res) => {

  // bill.find()
  // .then((bill)=>{
  //   res.send(bill)
  // })
  // .catch()
  const a=[]
  detailBill.find({user:'Le Tan Tai'},(err,result)=>{
    if (err) throw err;
    res.send(result)
  })


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})