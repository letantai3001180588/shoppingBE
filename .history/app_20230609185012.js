// const methodOverride=require('method-override')
// const cookieParser = require('cookie-parser');
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
// const path = require('path');
const { default: mongoose } = require('mongoose');
const path = require('path')
const jwt=require('jsonwebtoken');
const cors = require('cors')
const nodemailer =  require('nodemailer');
const multer = require('multer');
const fs = require("fs");

const userRoute=require('./routes/userRoute')
const productRoute=require('./routes/productRoute')
const billRoute=require('./routes/billRoute')
const detailBillRoute=require('./routes/detailBillRoute')

const compression = require('compression');

const app = express()
const port = 3000
db.connectDB();

app.use(express.urlencoded({
  extended:false,
  limit:'50mb'
}
))
// app.use(methodOverride('_method'))
// app.use(cookieParser())

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(compression({ filter: shouldCompress }))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

const corsOptions ={
  origin:true, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));


const http = require("http");
const { type } = require('os');
const { brotliCompress } = require('zlib');
const server = http.createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
      origin: "*",
  }
});

app.use('/',userRoute);
app.use('/',productRoute);
app.use('/',billRoute);
app.use('/',detailBillRoute)

// socketIo.on("connection", (socket) => {
// console.log("New client connected" + socket.id);

//   socket.emit("getId", socket.id);

//   socket.on("sendDataClient", function(data) {
//     console.log(data)
//     socketIo.emit("sendDataServer", { data });
//   })

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
  
// });
// server.listen(4000, () => {
//   console.log('Server đang chay tren cong 4000');
// });


app.get('/', (req, res) => {
  res.send('Hello world');
})

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
})

// app.post('/login',(req,res)=>{
//   const user=req.body.user
//   const password=req.body.password
//   acount.findOne({email:user,password:password})
//   .then(data=>{
//     const accessToken=jwt.sign({_id:data._id},'mk')
//     res.send({mesage:'Access',accessToken:accessToken,role:data.role})
//   })
//   .catch(()=>{
//     res.send('Failure')
//   })
// })


// app.get('/home', async(req, res) => {
//   const accessToken=req.header('Authorization')
  
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id})
//     .then((acount)=>{
//       res.send({acount:acount})
//     })
//     .catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })

// app.post('/register', (req, res) => {
//   res.send(req.body)
//   const a=mongoose.model('acount',acountSchema)
//   const acount=new a(req.body)
//   acount.save()
//   .then(() => res.redirect('/') )
//   .catch(error => {})
// })

// app.get('/admin', async(req, res) => {
//   const accessToken=req.header('Authorization')
  
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     const listProduct=await product.find({})
//     const listBill=await bill.find({}).populate('id_user')
//     const listDetailBill=await detailBill.find({}).populate('id_product')
//     const listAcount=await acount.find({})
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id})
//     .then((acount)=>{
//       const role=String(acount[0].role)
//       if(role==='admin'){
//         res.json({acount:acount,acountDB:listAcount,product:listProduct,bill:listBill,detailBill:listDetailBill})
//       }
//       else{
//         res.send('Failture')
//       }
//     })
//     .catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })

// app.put('/bill/transport/:id', (req, res) => {
//   const accessToken=req.header('Authorization')
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       const role=String(data[0].role)
//       if(role==='admin'){
//         bill.updateOne({_id:req.params.id},{$set:{statusOrder:1}})
//         .then(() => {
//           res.send('Access')
//         })
//         .catch()
//       }
//       else{
//         res.send('Failture')
//       }
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })

// app.put('/bill/receive/:id', (req, res) => {
//   bill.updateOne({_id:req.params.id},{$set:{statusOrder:2}})
//   .then(() => {
//     res.send('Access') 
//   })
// })

// app.get('/filterProduct/:trademark/:design/:price',(req,res)=>{
//   let a=''
//   if(req.params.price==1||req.params.price==-1)
//     a=req.params.price

//   let b={
//     $and:[
//       {name: new RegExp(req.params.design,'i'),
//       trademark:new RegExp(req.params.trademark,'i')}
//     ]
//   }
//   if(req.params.design===' '&&req.params.trademark===' ')
//     b={}
  
//   product.find(b)
//   .sort({price:a})
//   .limit(12)
//   .then((product)=>{
//     res.send(product)
//   })
// })

// app.use('/acount/delete/:id', (req, res) => {
//   const accessToken=req.header('Authorization')
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       const role=String(data[0].role)
//       if(role==='admin'){
//         acount.deleteOne({_id:req.params.id})
//         .then(() => {
//           res.send('Access'); 
//         })
//         .catch()
//       }
//       else{
//         res.send('Failture')
//       }
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })

// app.put('/acount/update/:id', (req, res) => {
//   const accessToken=req.header('Authorization')
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       const role=String(data[0].role)
//       if(role){
//         acount.updateOne({_id:req.params.id},req.body)
//         .then(() => {
//           res.send('Access')
//         })
//         .catch()
//       }
//       else{
//         res.send('Failture')
//       }
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })

// app.get('/product/:page', (req, res) => {
//   let perPage = 12;
//   let page = req.params.page || 1; 

//   product
//     .find() 
//     .skip((perPage * page) - perPage) 
//     .limit(perPage)
//     .then((products) => {
//       res.send(products)
//   });


// });

// app.get('/sumPage', async (req,res)=>{
//   const estimate = await product.estimatedDocumentCount();
//   res.send(String(estimate/12))
// })

// app.get('/search/:product', async (req,res)=>{
//   let search=req.params.product
//   let query={}
//   query.name = new RegExp(search,'i')
//   product.find(query).limit(12)
//   .then((a)=>{
//     res.send(a)
//   })
// })

// app.post('/product/create', (req, res) => {
//   const accessToken=req.header('Authorization')
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       const role=String(data[0].role)
//       if(role==='admin'){
//         const a=mongoose.model('product',productSchema)
//         const product=new a(req.body)
//         product.save()
//       }
//       else{
//         res.send('Failture')
//       }
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })

// app.use('/product/delete/:id', (req, res) => {
//   const accessToken=req.header('Authorization')
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       const role=String(data[0].role)
//       if(role==='admin'){
//         product.deleteOne({_id:req.params.id})
//         .then(() => {
//           res.send('Access')
//         })
//         .catch()
//       }
//       else{
//         res.send('Failture')
//       }
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })

// app.put('/product/update/:id', (req, res) => {
//   const accessToken=req.header('Authorization')
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       const role=String(data[0].role)
//       if(role==='admin'){
//         product.updateOne({_id:req.params.id},req.body)
//         .then(() => {
//           res.send('Access')
//         })
//         .catch()
//       }
//       else{
//         res.send('Failture')
//       }
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })

// app.get('/bill/:id_user', async(req, res) => {
//   bill.find({id_user:req.params.id_user})
//   .then(async(data)=>{
//     res.json(data)
//   })
// })

// app.post('/bill/create',(req,res)=>{
//   const accessToken=req.header('Authorization')
//   const transporter =  nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL, 
//         pass: process.env.APP_PASSWORD,

//     }
//   });
//   let style=`
//     style="border: 1px solid #dddddd;padding: 8px;"
//   `
//   let head=`
//     <table style="width: 100%;">
//       <thead>
//         <tr >
//           <th ${style} scope="col">ID</th>
//           <th ${style} scope="col">Image</th>
//           <th ${style} scope="col">Name</th>
//           <th ${style} scope="col">Amount</th>
//         </tr>
//       </thead>
//       <tbody >
//   `
  
//   let foot=`
//       </tbody>
//     </table>
//   `

//   const img=req.body.detailBill[0]
//   const name=req.body.detailBill[1]
//   const amount=req.body.detailBill[2]

//   let content=req.body.detailBill[0].map((item,i)=>{
//     return`
//       <tr>
//           <th ${style}>${i+1}</th>
//           <td ${style}>
//               <img style="width: 50px;height: 50px;" 
//               src="${img[i]}"/>
//           </td>
//           <td ${style}>
//             ${name[i]}
//           </td>
//           <td ${style}>
//             ${amount[i]}
//           </td>
//       </tr>
//       `;

//   })

//   const html=head+String(content.join(''))+foot;
//   const mainOptions = { 
//       from: 'NQH-Test nodemailer',
//       to: req.body.email,
//       subject: 'Danh sách đặt hàng từ Shopping',
//       text: '',
//       html: html
//   }
  
//   console.log(req.body.email||'Not found')
  
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       const bill=mongoose.model('bill',billSchema)
//       const newBill= new bill(req.body.bill)
//       newBill.save()
//       .then((item) => { 
//         res.send(item)
//       })
//       .then(()=>{
//         transporter.sendMail(mainOptions, function(err, info){
//           err?console.log(err):console.log(info)
//         });
//       })
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })


// app.use('/bill/delete/:id',(req,res)=>{
//   const accessToken=req.header('Authorization')
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       const role=String(data[0].role)
//       if(role==='admin'){
//         bill.deleteOne({_id:req.params.id}).then(()=>{
//           detailBill.deleteMany({id_bill:req.params.id}).then(()=>{
//             res.send("Xoa thanh cong")
//           })
//           .catch()
//         })
//         .catch()
//       }
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }
// })


// app.get('/detailBill',async(req,res)=>{
//   detailBill.find({}).populate('id_product')
//   .then((data)=>{
//     res.send(data)
//   })
// })

// app.post('/detailBill/create', (req, res) => {
//   const accessToken=req.header('Authorization')
//   if(!accessToken){
//     res.send('Ban can phai dang nhap')
//   }
//   else{
//     let verify=jwt.verify(accessToken,'mk')
//     acount.find({_id:verify._id}).then((data)=>{
//       detailBill.insertMany(req.body)
//       .then(()=>res.send('Access'))
//       .catch((err)=>res.send(err))
//     }).catch(()=>{
//       res.send('Tai khoan hoac mat khau khong dung')
//     })
//   }

// })

// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, './public');
// 	},
// 	filename: function (req, file, cb) {
// 		console.log(file);
// 		cb(null,  file.originalname);
// 	},
// });
// const upload = multer({ storage: storage }).single('myfile');

// app.post('/upload',(req,res,next)=>{
//   upload(req, res, function (err) {
// 		if (err) {
// 			res.send(err);
// 		} else {
//       res.send('Success, Image uploaded!');
// 		}
//     console.log(req.file.filename);
// 	});
// })

// app.get('/img/:address',(req,res)=>{
//   res.sendFile(path.join(__dirname+'/public/'+req.params.address));

// })

// app.use('/delete/img/:address',(req,res)=>{
//   const filename=req.params.address;
//   const directory='/shoppingbe/public/';
//   fs.unlink(directory+filename,(err)=>{
//       if (err) {
//       res.status(500).send({
//         message: "Could not delete the file. " + err,
//       });
//     }

//     res.status(200).send({
//       message: "File is deleted.",
//     });
//   })
// })

// app.post('/img/update',(req,res,next)=>{
//   upload(req, res, function (err) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log('thanh cong');
//       // console.log(req.file.filename);
//       res.send('Success, Image uploaded!');
// 		}
// 	})

// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})