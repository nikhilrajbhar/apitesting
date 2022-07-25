import express from "express"
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import EmailData from "./models/emailData.js";
import Product from "./models/product.js";
import { encrypt, decrypt } from "./components/encryption.js"
import { RANDOM_KEY } from "./components/global.js"



//Database Connection
import ("./mongoose/connection.js")


const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(express.json());
// app.all('*', function (req, res) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     next();
// });

app.get('/product', async (req, res) =>  {
    console.log("get request=");

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

    try {
        let result = await Product.find()
        res.status(200).json(result)
    } catch (error) {
        res.json({success:false, error })
    }
})

app.post('/product', async (req, res) =>  {
    console.log("posting========");
    console.log(req.body);
    console.log("posting======1==");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

    try {
        const postedData = await new Product(req.body).save()
        res.status(200).json(postedData)
    } catch (error) {
        res.json({success:false, error })
    }
})



// Generate Secure Token Logic



app.get('/check', (req, res) => {
    res.send('Send Email Api ==== !')
})

app.post('/secureToken', async (req, res) => {
    let { Host, Username, Password } = req.body;

    const rand = crypto.randomBytes(20);
    let chars = RANDOM_KEY.repeat(5);
    let str = '';
    for (let i = 0; i < rand.length; i++) {
        let decimal = rand[i];
        str += chars[decimal];
    }
    let passwordEncrypt = encrypt(Password);
    const product = await new EmailData({
        secretToken: str,
        email: Username,
        password: passwordEncrypt,
        host: Host
    }).save()
    console.log(product);

    res.send("Copy this token " + str)
})

app.post('/', async (req, res) => {

    let secureTokentest = req.body.secureToken
    if (secureTokentest) {
        let { To, From, Subject, Body } = req.body;
        try {
            let result = await EmailData.findOne({ secretToken: secureTokentest })
            console.log('result', result);
            let dbpassword = result.password;
        
            let decryptedPassword = decrypt(dbpassword)
            if (result.email && decryptedPassword && result.host) {
                let resultEmail = await sendEmail(result.host, result.email, decryptedPassword, To, From, Subject, Body)
                res.send(resultEmail)
            } else {
                res.send('Enter all feilds')
            }
        } catch (error) {
            res.send('No data found ! Kindly check your secureTokentoken');
        }

    } else {
        let { Host, Username, Password, To, From, Subject, Body } = req.body;
        console.log(Host);
        if (Host && Username && Password && To) {
            try {
                let result = await sendEmail(Host, Username, Password, To, From, Subject, Body)
                res.send(result)
            } catch (error) {
                
            }
           
        } else {
            res.send('Enter all required feilds')
        }
    }
})


// 
app.listen(PORT, () =>
    console.log(`Server running on port: http://localhost:${PORT}`)
);
