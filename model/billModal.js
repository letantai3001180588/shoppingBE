const mongoose=require('mongoose')
const Schema=mongoose.Schema

const billSchema = new Schema({
    id_user:{type:Schema.Types.ObjectId,ref:'acount'},
    total:{type:Number},
    statusOrder:{type:Number},
    },{
        collection:'bill',
        timestamps:true
});

module.exports=mongoose.model('bill',billSchema)