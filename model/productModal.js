const mongoose=require('mongoose')
const Schema=mongoose.Schema

const productSchema = new Schema({
    name:{type:String},
    price:{type:Number},
    img:{type:String},
    trademark: { type: String},
    },
    {
        collection:'product'
    }
);

module.exports=mongoose.model('product',productSchema)
