const bodyParser = require('body-parser');
const express = require('express')
const db=require('./config/db/index')
const { dirname } = require('path');


const app = express()
const port = 3000
db.connectDB();

app.use(bodyParser.urlencoded({
  extended:false
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({
  extended:true
}))
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})