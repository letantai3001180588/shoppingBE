require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
// const path = require('path');
const { default: mongoose } = require('mongoose');
const path = require('path')
const methodOverride=require('method-override')
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
var cors = require('cors')

const app = express()
const port = 3000
db.connectDB();

app.use(express.urlencoded({
  extended:false
}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(bodyParser.json());

const corsOptions ={
    origin:true, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

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
  const accessToken=req.header('Authorization')
  
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id})
    .then((acount)=>{
      res.send({acount:acount})
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
  const accessToken=req.header('Authorization')
  
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    const listProduct=await product.find({})
    const listBill=await bill.find({}).populate('id_user')
    const listDetailBill=await detailBill.find({}).populate('id_product')
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id})
    .then((acount)=>{
      const role=String(acount[0].role)
      if(role==='admin'){
        res.json({acount:acount,product:listProduct,bill:listBill,detailBill:listDetailBill})
      }
      else{
        res.send('Failture')
      }
    })
    .catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})



app.use('/acount/delete/:id', (req, res) => {
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const role=String(data[0].role)
      if(role==='admin'){
        acount.deleteOne({_id:req.params.id})
        .then(() => {
          res.send('Access'); 
        })
        .catch()
      }
      else{
        res.send('Failture')
      }
    }).catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})

app.put('/acount/update/:id', (req, res) => {
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const role=String(data[0].role)
      if(role==='admin'){
        acount.updateOne({_id:req.params.id},req.body)
        .then(() => {
          res.send('Access')
        })
        .catch()
      }
      else{
        res.send('Failture')
      }
    }).catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})

app.get('/product',(req,res)=>{
  product.find({})
  .then((product)=>{
    res.send(product)
  })
})

app.post('/product/create', (req, res) => {
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const role=String(data[0].role)
      if(role==='admin'){
        const a=mongoose.model('product',productSchema)
        const product=new a(req.body)
        product.save()
      }
      else{
        res.send('Failture')
      }
    }).catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})

app.use('/product/delete/:id', (req, res) => {
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const role=String(data[0].role)
      if(role==='admin'){
        product.deleteOne({_id:req.params.id})
        .then(() => {
          res.send('Access')
        })
        .catch()
      }
      else{
        res.send('Failture')
      }
    }).catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})

app.put('/product/update/:id', (req, res) => {
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const role=String(data[0].role)
      if(role==='admin'){
        product.updateOne({_id:req.params.id},req.body)
        .then(() => {
          res.send('Access')
        })
        .catch()
      }
      else{
        res.send('Failture')
      }
    }).catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})

app.use('/bill/create',(req,res)=>{
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const newBill= new bill(req.body)
      newBill.save()
      .then(() => {
        res.send('Access')
      })
      .catch()
    }).catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})

app.use('/bill/delete/:id',(req,res)=>{
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const role=String(data[0].role)
      if(role==='admin'){
        bill.deleteOne({_id:req.params.id}).then(()=>{
          detailBill.deleteMany({id_bill:req.params.id}).then(()=>{
            res.send("Xoa thanh cong")
          })
          .catch()
        })
        .catch()
      }
    }).catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }
})

app.post('/detailBill/create', (req, res) => {
  
  // const accessToken=req.header('Authorization')
  // if(!accessToken){
  //   res.send('Ban can phai dang nhap')
  // }
  // else{
  //   let verify=jwt.verify(accessToken,'mk')
  //   acount.find({_id:verify._id}).then((data)=>{
        // const newBill= new detailBill(req.body)
        
        res.send([req.body,req.body])
        const a=[req.body,req.body]
        // detailBill.insertMany(a)
        // .then(()=>res.send(req.body))
        // .catch(()=>)
      
  //   }).catch(()=>{
  //     res.send('Tai khoan hoac mat khau khong dung')
  //   })
  // }

  // res.send(req.body)

  // const a=mongoose.model('acount',acountSchema)
  // const product=new a(req.body)
  // product.save().then(()=>res.send(req.body))

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})