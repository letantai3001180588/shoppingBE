const express = require('express');
const { getDetailBill } = require('../controller/detailBillController');
const router = express.Router();

router.get('/detailBill',getDetailBill)

module.exports=router