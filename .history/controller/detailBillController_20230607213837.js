const acountSchema=require('../model/userModal');
const billSchema=require('../model/billModal');
const detailBillSchema=require('../model/detailBillModal');
const productSchema=require('../model/productModal');

const getDetailBill = async (req,res) =>{
    detailBillSchema.find({}).populate('id_product')
    .then((data)=>{
        res.send(data)
    })
}

module.exports={
    getDetailBill,
}