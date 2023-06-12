const { mongoose } = require("mongoose");
const Schema=mongoose.Schema;

const acountSchema = new Schema({
    username: { type: String},
    password: { type: String},
    email: { type: String},
    address: { type: String},
    role:{type:String},
    phone: { type: String},
    avatar: { type: String},
  },{
    collection:'acount'
  });

module.exports=mongoose.model('acount',acountSchema)