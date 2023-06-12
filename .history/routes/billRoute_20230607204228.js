const { getBillUser } = require('../controller/billController')
const {getPage, sumPage, searchProduct, createProduct, deleteProduct, updateProduct, filterProduct}=require('../controller/productController')
const express=require('express')
const router=express.Router()

router.get('/bill/:id_user',getBillUser)
router.post('/bill/create',createBill)

module.exports=router
