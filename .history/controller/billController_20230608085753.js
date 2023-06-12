const acountSchema=require('../model/userModal');
const billSchema=require('../model/billModal');
const detailBillSchema=require('../model/detailBillModal');
const productSchema=require('../model/productModal');

const getBillUser = async (req,res)=>{
    billSchema.find({id_user:req.params.id_user})
    .then(async(data)=>{
        res.json(data)
    })
}

const createBill = async (req,res)=>{
    const accessToken=req.header('Authorization')
    const transporter =  nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.APP_PASSWORD,

        }
    });
    let style=`
        style="border: 1px solid #dddddd;padding: 8px;"
    `
    let head=`
        <table style="width: 100%;">
        <thead>
            <tr >
            <th ${style} scope="col">ID</th>
            <th ${style} scope="col">Image</th>
            <th ${style} scope="col">Name</th>
            <th ${style} scope="col">Amount</th>
            </tr>
        </thead>
        <tbody >
    `
    
    let foot=`
        </tbody>
        </table>
    `

    const img=req.body.detailBill[0]
    const name=req.body.detailBill[1]
    const amount=req.body.detailBill[2]

    let content=req.body.detailBill[0].map((item,i)=>{
        return`
        <tr>
            <th ${style}>${i+1}</th>
            <td ${style}>
                <img style="width: 50px;height: 50px;" 
                src="${img[i]}"/>
            </td>
            <td ${style}>
                ${name[i]}
            </td>
            <td ${style}>
                ${amount[i]}
            </td>
        </tr>
        `;

    })

    const html=head+String(content.join(''))+foot;
    const mainOptions = { 
        from: 'NQH-Test nodemailer',
        to: req.body.email,
        subject: 'Danh sách đặt hàng từ Shopping',
        text: '',
        html: html
    }
    
    console.log(req.body.email||'Not found')
    
    if(!accessToken){
        res.send('Ban can phai dang nhap')
    }
    else{
        let verify=jwt.verify(accessToken,'mk')
        acountSchema.find({_id:verify._id}).then((data)=>{
        const bill=mongoose.model('bill',billSchema)
        const newBill= new bill(req.body.bill)
        newBill.save()
        .then((item) => { 
            res.send(item)
        })
        .then(()=>{
            transporter.sendMail(mainOptions, function(err, info){
            err?console.log(err):console.log(info)
            });
        })
        }).catch(()=>{
        res.send('Tai khoan hoac mat khau khong dung')
        })
    }
}

const deleteBill = async (req,res)=>{
    const accessToken=req.header('Authorization')
    if(!accessToken){
        res.send('Ban can phai dang nhap')
    }
    else{
        let verify=jwt.verify(accessToken,'mk')
        acountSchema.find({_id:verify._id}).then((data)=>{
            const role=String(data[0].role)
            if(role==='admin'){
                billSchema.deleteOne({_id:req.params.id}).then(()=>{
                detailBill.deleteMany({id_bill:req.params.id}).then(()=>{
                        res.send("Xoa thanh cong")
                    })
                    .catch()
                })
            }
        }).catch(()=>{
            res.send('Tai khoan hoac mat khau khong dung')
        })
    }
}

const transportBill= async (req,res) => {

}


module.exports={
    getBillUser,createBill,deleteBill,transportBill
}