const express = require('express');
const { getDetailBill, createDetailBill } = require('../controller/detailBillController');
const router = express.Router();

router.get('/detailBill',getDetailBill)
router.post('/detailBill/create',createDetailBill)

module.exports=router