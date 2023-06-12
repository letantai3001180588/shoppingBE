const acountSchema=require('../model/userModal');
const billSchema=require('../model/billModal');
const detailBillSchema=require('../model/detailBillModal');
const productSchema=require('../model/productModal');
const jwt=require('jsonwebtoken');
const multer = require('multer');
const fs = require("fs");


const login = async (req,res) => {
    const {email,password} = req.body;
    try{
        const user = await acountSchema.findOne({email})
        if(!user) return res.status(500).json('Wrong email')

        const mathPassword = await acountSchema.findOne({password:password})
        if(!mathPassword) return res.status(500).json('Wrong password')

        const accessToken = jwt.sign({_id:user._id},'mk')
        res.status(200).json({mesage:'Access',accessToken:accessToken,role:user.role})   
    }
    catch(error){
        res.status(500).json(error.message)
    }
}

const getUser = async (req,res) => {
    const accessToken=req.header('Authorization')
    if(!accessToken){
        res.send('You need login!')
    }
    else{
        try {
            let verify=jwt.verify(accessToken,'mk')
            const acount=acountSchema.find({_id:verify._id})
            acount?res.send({acount:acount}):res.send('Wrong acount')
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
}

const signup = async (req,res)=>{
    res.send(req.body)
    const acount=new acountSchema(req.body)
    acount.save()
    .then(() => res.redirect('/') )
    .catch(error => {})
}

const requireAdmin= async (req,res) =>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
        res.send('Ban can phai dang nhap')
    }
    else{
        const listProduct=await productSchema.find({})
        const listBill=await billSchema.find({}).populate('id_user')
        const listDetailBill=await detailBillSchema.find({}).populate('id_product')
        const listAcount=await acountSchema.find({})

        try {
            let verify=jwt.verify(accessToken,'mk')
            acountSchema.find({_id:verify._id})
                .then((acount)=>{
                    const role=String(acount[0].role)
                    if(role==='admin'){
                        res.status(200).json({acount:acount,acountDB:listAcount,product:listProduct,bill:listBill,detailBill:listDetailBill})
                    }
                    else{
                        res.send('You do not have access')
                    }
                })
                .catch(()=>{
                    res.send('Acount is not valid')
                })
            
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
}

const deleteAcount= async (req,res) =>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
        res.send('Ban can phai dang nhap')
    }
    else{
        let verify=jwt.verify(accessToken,'mk')
        acountSchema.find({_id:verify._id}).then((data)=>{
        const role=String(data[0].role)
        if(role==='admin'){
            acountSchema.deleteOne({_id:req.params.id})
            .then(() => {
            res.send('Access'); 
            })
            .catch()
        }
        else{
            res.send('Failture')
        }
        }).catch(()=>{
        res.send('Tai khoan hoac mat khau khong dung')
        })
    }
}

const updateAcount= async (req,res) =>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
        res.send('Ban can phai dang nhap')
    }
    else{
        let verify=jwt.verify(accessToken,'mk')
        acountSchema.find({_id:verify._id}).then((data)=>{
            const role=String(data[0].role)
            if(role){
                acountSchema.updateOne({_id:req.params.id},req.body)
                .then(() => {
                res.send('Access')
                })
                .catch()
            }
            else{
                res.send('Failture')
            }
        }).catch(()=>{
        res.send('Tai khoan hoac mat khau khong dung')
        })
    }
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public');
	},
	filename: function (req, file, cb) {
		console.log(file);
		cb(null,  file.originalname);
	},
});
const upload = multer({ storage: storage }).single('myfile');

const uploadAvatar= async (req,res)=>{
    upload(req, res, function (err) {
		if (err) {
			res.send(err);
		} else {
            res.send('Success, Image uploaded!');
		}
	});
}

const getAvatar=async (req,ers)=>{
    res.sendFile(path.join(__dirname+'/public/'+req.params.address));
}

const deleteAvatar= async (req,res)=>{
    const filename=req.params.address;
    const directory='/shoppingbe/public/';
    fs.unlink(directory+filename,(err)=>{
        if (err) {
        res.status(500).send({
            message: "Could not delete the file. " + err,
        });
        }

        res.status(200).send({
        message: "File is deleted.",
        });
    })
}


module.exports={
    login,getUser,signup,requireAdmin,deleteAcount,updateAcount,
    uploadAvatar,getAvatar,deleteAvatar,
}