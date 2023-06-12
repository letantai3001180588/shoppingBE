const express = require('express');
const router = express.Router();
const { login,getUser, signup, requireAdmin, deleteAcount, updateAcount,uploadAvatar, getAvatar, deleteAvatar }=require('../controller/userController')

router.post('/login',login)
router.get('/home',getUser)
router.post('/register',signup)
router.get('/admin',requireAdmin)

router.delete('/acount/delete/:id',deleteAcount)
router.put('/acount/update/:id',updateAcount)

// router.post('/upload',uploadAvatar)
router.get('/img/:address',getAvatar)
router.get('/delete/img/:address',deleteAvatar)
router.post('/img/update',uploadAvatar)


module.exports=router;