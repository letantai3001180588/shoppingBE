const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
// const path = require('path');
const { default: mongoose } = require('mongoose');
const { mongooseToObject } = require('../ExpressJs/src/mongoose');
const path = require('path')
const methodOverride=require('method-override')
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express()
const port = 3000
db.connectDB();

app.use(express.urlencoded({
  extended:false
}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(cookieParser())

const Schema = mongoose.Schema;
const acountSchema = new Schema({
    user: { type: String},
    password: { type: String},
    email: { type: String},
    address: { type: String},
    role:{type:String},
    phone: { type: String},
  },{
    collection:'acount'
  });
const acount=mongoose.model('acount',acountSchema)

const productSchema = new Schema({
  name:{type:String},
  price:{type:Number},
  img:{type:String},

  },{
    collection:'product'
  });
const product=mongoose.model('product',productSchema)

const billSchema = new Schema({
  id_user:{type:Schema.Types.ObjectId,ref:'acount'},
  total:{type:Number},
  },{
    collection:'bill',
    timestamps:true
  });
const bill=mongoose.model('bill',billSchema)

const detailBillSchema = new Schema({
  id_bill:{type:Schema.Types.ObjectId,ref:'bill'},
  id_product:{type:Schema.Types.ObjectId,ref:'product'},
  quantity:{type:Number},
  },{
    collection:'detailBill',
    timestamps:true
  });
const detailBill=mongoose.model('detailBill',detailBillSchema)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.post('/login',(req,res)=>{
  const user=req.body.user
  const password=req.body.password
  acount.findOne({user:user,password:password})
  .then(data=>{
    const accessToken=jwt.sign({_id:data._id},'mk')
    res.send({mesage:'Access',accessToken:accessToken})
  })
  .catch(()=>{
    res.send('Failure')
  })
})


app.get('/home', async(req, res) => {
  const accessToken=req.cookies.token
  const listProduct=await product.find({})
  
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id})
    .then((acount)=>{
      res.send({acount:acount,product:listProduct})
    })
    .catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})

app.post('/register', (req, res) => {
  res.send(req.body)
  const a=mongoose.model('acount',acountSchema)
  const acount=new a(req.body)
  acount.save()
  .then(() => res.redirect('/') )
  .catch(error => {})
})

app.get('/admin', async(req, res) => {
  const accessToken=req.cookies.token
  const listProduct=await product.find({})
  const listBill=await bill.find({}).populate('id_user')
  const listDetailBill=await detailBill.find({}).populate('id_product')
  
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id})
    .then((acount)=>{
      res.json({acount:acount,product:listProduct,bill:listBill,detailBill:listDetailBill})
    })
    .catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})



app.use('/acount/delete/:id', (req, res) => {
  const accessToken=req.cookies.token
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      // res.send(data[0].role)
      if(data[0].role){
        acount.deleteOne({_id:req.params.id})
        .then(() => {
          res.send('Access'); 
        })
        .catch()
      }
      else{
        res.send('Failture')
      }
    })
  }
})

app.put('/acount/update/:id', (req, res) => {
  acount.updateOne({_id:req.params.id},req.body)
  .then(() => {
    res.redirect('/'); 
  })
  .catch()
})


app.post('/product/create', (req, res) => {
  res.send(req.body)
  const a=mongoose.model('product',acountSchema)
  const product=new a(req.body)
  product.save()
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
  bill.find({})
  .populate('id_user')
  .then((bill)=>{
    res.send(bill)
  })
  .catch()
})

app.use('/bill/create',(req,res)=>{
  res.send(req.body)
  const newBill= new bill(req.body)
  newBill.save()
})

app.use('/bill/delete/:id',(req,res)=>{
  bill.deleteOne({_id:req.params.id}).then(()=>{
    detailBill.deleteMany({id_bill:req.params.id}).then(()=>{
      res.send("Xoa thanh cong")
    })
    .catch()
  })
  .catch()
})

app.get('/detailBill', (req, res) => {
  detailBill.find({})
  .populate('id_product')
  .then((bill)=>{
    res.send(bill)
  })
  .catch()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})