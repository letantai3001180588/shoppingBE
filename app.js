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
const cors = require('cors')
const nodemailer =  require('nodemailer');



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
  statusOrder:{type:Number},
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

const http = require("http");
const { type } = require('os');
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
      origin: "*",
  }
});


socketIo.on("connection", (socket) => {
console.log("New client connected" + socket.id);

  socket.emit("getId", socket.id);

  socket.on("sendDataClient", function(data) {
    console.log(data)
    socketIo.emit("sendDataServer", { data });
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  
});
server.listen(4000, () => {
  console.log('Server đang chay tren cong 4000');
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.post('/login',(req,res)=>{
  const user=req.body.user
  const password=req.body.password
  acount.findOne({user:user,password:password})
  .then(data=>{
    const accessToken=jwt.sign({_id:data._id},'mk')
    res.send({mesage:'Access',accessToken:accessToken,role:data.role})
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
    const listAcount=await acount.find({})
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id})
    .then((acount)=>{
      const role=String(acount[0].role)
      if(role==='admin'){
        res.json({acount:acount,acountDB:listAcount,product:listProduct,bill:listBill,detailBill:listDetailBill})
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

app.put('/bill/transport/:id', (req, res) => {
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const role=String(data[0].role)
      if(role==='admin'){
        bill.updateOne({_id:req.params.id},{$set:{statusOrder:1}})
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


app.put('/acount/transport/:id', (req, res) => {
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id})
    .then((userAcount)=>{
      bill.find({id_user:verify._id})
      .then((userBill)=>{
        if(userAcount===userBill){
          bill.updateOne({_id:req.params.id},{$set:{statusOrder:2}})
          .then(() => {
            res.send('Access')
          })
          .catch()
            res.send('Failture')
        }
    })


    }).catch(()=>{
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

app.get('/product/:page', (req, res) => {
  let perPage = 12;
  let page = req.params.page || 1; 

  product
    .find() 
    .skip((perPage * page) - perPage) 
    .limit(perPage)
    .then((products) => {
      res.send(products)
  });


});
app.get('/sumPage', async (req,res)=>{
  const estimate = await product.estimatedDocumentCount();
  res.send(String(estimate/12))
})

app.get('/search/:product', async (req,res)=>{
  let search=req.params.product
  let query={}
  query.name = new RegExp(search,'i')
  product.find(query).limit(12)
  .then((a)=>{
    res.send(a)
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

app.get('/bill/waitOrder/:id_user', (req, res) => {
  bill.find({id_user:req.params.id_user,statusOrder:0})
  .then((data)=>{
    res.send(data)
  })
})

app.get('/bill/transportOrder/:id_user', (req, res) => {
  bill.find({id_user:req.params.id_user,statusOrder:1})
  .then((data)=>{
    res.send(data)
  })
})

app.get('/bill/finishOrder/:id_user', (req, res) => {
  bill.find({id_user:req.params.id_user,statusOrder:2})
  .then((data)=>{
    res.send(data)
  })
})

app.post('/bill/create',(req,res)=>{
  const accessToken=req.header('Authorization')
  const transporter =  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'taile07032000@gmail.com', 
        pass: 'ywyzwofihevekaes' 
    }
  });
  let style=`
    style="border: 1px solid #dddddd;padding: 8px;"
  `
  let head=`
    <table style="width: 100%;">
      <thead>
        <tr >
          <th ${style} scope="col">ID</th>
          <th ${style} scope="col">Image</th>
          <th ${style} scope="col">Name</th>
          <th ${style} scope="col">Amount</th>
        </tr>
      </thead>
      <tbody >
  `
  
  let foot=`
      </tbody>
    </table>
  `

  const img=req.body.detailBill[0]
  const name=req.body.detailBill[1]
  const amount=req.body.detailBill[2]

  let content=req.body.detailBill[0].map((item,i)=>{
    return`
      <tr>
          <th ${style}>${i+1}</th>
          <td ${style}>
              <img style="width: 50px;height: 50px;" 
              src="${img[i]}"/>
          </td>
          <td ${style}>
            ${name[i]}
          </td>
          <td ${style}>
            ${amount[i]}
          </td>
      </tr>
      `;

  })

  const html=head+String(content.join(''))+foot;
  const mainOptions = { 
      from: 'NQH-Test nodemailer',
      to: req.body.email,
      subject: 'Danh sách đặt hàng từ Shopping',
      text: '',
      html: html
  }
  
  console.log(req.body.email||'Not found')
  
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      const bill=mongoose.model('bill',billSchema)
      const newBill= new bill(req.body.bill)
      newBill.save()
      .then((item) => { 
        res.send(item)
      })
      .then(()=>{
        transporter.sendMail(mainOptions, function(err, info){
          err?res.send(err):console.log(info)
        });
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
  const accessToken=req.header('Authorization')
  if(!accessToken){
    res.send('Ban can phai dang nhap')
  }
  else{
    let verify=jwt.verify(accessToken,'mk')
    acount.find({_id:verify._id}).then((data)=>{
      detailBill.insertMany(req.body)
      .then(()=>res.send('Access'))
      .catch((err)=>res.send(err))
    }).catch(()=>{
      res.send('Tai khoan hoac mat khau khong dung')
    })
  }

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})