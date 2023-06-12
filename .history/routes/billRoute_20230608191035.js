const { getBillUser, createBill, deleteBill, transportBill, isStatusBill } = require('../controller/billController')
const {getPage, sumPage, searchProduct, createProduct, deleteProduct, updateProduct, filterProduct}=require('../controller/productController')
const express=require('express')
const router=express.Router()

router.get('/bill/:id_user',getBillUser)
router.post('/bill/create',createBill)
router.delete('/bill/delete/:id',deleteBill)

router.put('/bill/transport/:id',transportBill)
router.put('/bill/receive/:id',isStatusBill)

module.exports=router
