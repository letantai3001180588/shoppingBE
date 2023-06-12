const mongoose=require('mongoose')
const Schema=mongoose.Schema


const detailBillSchema = new Schema({
    id_bill:{type:Schema.Types.ObjectId,ref:'bill'},
    id_product:{type:Schema.Types.ObjectId,ref:'product'},
    quantity:{type:Number},
    },{
        collection:'detailBill',
        timestamps:true
});

module.exports=mongoose.model('detailBill',detailBillSchema)