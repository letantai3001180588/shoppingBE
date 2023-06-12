const acountSchema=require('../model/userModal');
const billSchema=require('../model/billModal');
const detailBillSchema=require('../model/detailBillModal');
const productSchema=require('../model/productModal');

const getPage= async (req,res)=>{
    let perPage = 12;
    let page = req.params.page || 1; 
    productSchema
        .find() 
        .skip((perPage * page) - perPage) 
        .limit(perPage)
        .then((products) => {
            res.send(products)
        });
}

const sumPage = async (req,res)=>{
    const estimate = await productSchema.estimatedDocumentCount();
    res.send(String(estimate/12))
}

const searchProduct = async (req,res)=>{
    let search=req.params.product
    let query={}
    query.name = new RegExp(search,'i')
    productSchema.find(query).limit(12)
    .then((data)=>{
        res.send(data)
    })
}

const createProduct= async (req,res)=>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
    res.send('Ban can phai dang nhap')
    }
    else{
    let verify=jwt.verify(accessToken,'mk')
    acountSchema.find({_id:verify._id}).then((data)=>{
            const role=String(data[0].role)
            if(role==='admin'){
            const a=mongoose.model('product',productSchema)
            const product=new a(req.body)
            productSchema.save()
        }
        else{
            res.send('Failture')
        }
    }).catch(()=>{
        res.send('Tai khoan hoac mat khau khong dung')
    })
    }
}

const deleteProduct= async (req,res)=>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
        res.send('Ban can phai dang nhap')
    }
    else{
        let verify=jwt.verify(accessToken,'mk')
        acountSchema.find({_id:verify._id}).then((data)=>{
        const role=String(data[0].role)
        if(role==='admin'){
            productSchema.deleteOne({_id:req.params.id})
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

const updateProduct= async (req,res)=>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
        res.send('Ban can phai dang nhap')
        }
        else{
        let verify=jwt.verify(accessToken,'mk')
        acountSchema.find({_id:verify._id}).then((data)=>{
            const role=String(data[0].role)
            if(role==='admin'){
            productSchema.updateOne({_id:req.params.id},req.body)
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

const filterProduct= async (req,res)=>{
    let a=''
    if(req.params.price==1||req.params.price==-1)
        a=req.params.price

    let b={
        $and:[
        {name: new RegExp(req.params.design,'i'),
        trademark:new RegExp(req.params.trademark,'i')}
        ]
    }
    if(req.params.design===' '&&req.params.trademark===' ')
        b={}
    
    productSchema.find(b)
    .sort({price:a})
    .limit(12)
    .then((product)=>{
        res.send(product)
    })
}

const transport= async (req,res)=>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
        res.send('Ban can phai dang nhap')
    }
    else{
        let verify=jwt.verify(accessToken,'mk')
        acountSchema.find({_id:verify._id}).then((data)=>{
        const role=String(data[0].role)
        if(role==='admin'){
            billSchema.updateOne({_id:req.params.id},{$set:{statusOrder:1}})
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

module.exports = { 
    getPage,sumPage,searchProduct,createProduct,deleteProduct,updateProduct,filterProduct,transport
}