const acountSchema=require('../model/userModal');
const billSchema=require('../model/billModal');
const detailBillSchema=require('../model/detailBillModal');
const productSchema=require('../model/productModal');
const jwt=require('jsonwebtoken');

const getDetailBill = async (req,res) =>{
    detailBillSchema.find({}).populate('id_product')
    .then((data)=>{
        res.send(data)
    })
}

const createDetailBill = async (req,res) =>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
    res.send('Ban can phai dang nhap')
    }
    else{
    let verify=jwt.verify(accessToken,'mk')
    acountSchema.find({_id:verify._id}).then((data)=>{
        detailBillSchema.insertMany(req.body)
        .then(()=>res.send('Access'))
        .catch((err)=>res.send(err))
        }).catch(()=>{
            res.send('Tai khoan hoac mat khau khong dung')
        })
    }
    // console.log(req.body)
}

module.exports={
    getDetailBill,createDetailBill
}