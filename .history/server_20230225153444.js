const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
const path = require('path');


const app = express()
const port = 3000
db.connectDB();
db.createCollection("acount")    

app.use(bodyParser.urlencoded({
  extended:false
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({
  extended:true
}))
app.use(express.json())


const Schema = mongoose.Schema;
const acountSchema = new Schema({
    user: { type: String},
    password: { type: String},
  },{
    collection:'acount'
  });
  const acount=mongoose.model('acount',acountSchema)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})