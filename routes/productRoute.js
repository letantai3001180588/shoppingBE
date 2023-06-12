const {getPage, sumPage, searchProduct, createProduct, deleteProduct, updateProduct, filterProduct}=require('../controller/productController')
const express=require('express')
const router=express.Router()

router.get('/product/:page',getPage);
router.get('/sumPage',sumPage);
router.get('/search/:product',searchProduct);
router.put('/filterProduct/:trademark/:design/:price',filterProduct)

router.post('/product/create',createProduct);
router.delete('/product/delete/:id',deleteProduct)
router.put('/product/update/:id',updateProduct)


module.exports=router