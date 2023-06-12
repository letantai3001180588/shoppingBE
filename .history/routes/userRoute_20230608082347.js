const express = require('express');
const router = express.Router();
const { login,getUser, signup, requireAdmin, deleteAcount, updateAcount, uploadImg }=require('../controller/userController')

router.post('/login',login)
router.get('/home',getUser)
router.post('/register',signup)
router.post('/admin',requireAdmin)

router.delete('/acount/delete/:id',deleteAcount)
router.put('/acount/update/:id',updateAcount)

router.post('/upload',uploadImg)


module.exports=router;