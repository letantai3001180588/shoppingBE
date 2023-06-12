const acountSchema=require('../model/userModal');
const billSchema=require('../model/billModal');
const detailBillSchema=require('../model/detailBillModal');
const productSchema=require('../model/productModal');

const getBillUser = async (req,res)=>{
    bill.find({id_user:req.params.id_user})
    .then(async(data)=>{
        res.json(data)
    })
}

module.exports={
    getBillUser
}