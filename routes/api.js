const bcrypt = require("bcrypt");
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');
const Events = require('../models/event')
const SpecialEvents = require('../models/special')

const mongoose = require('mongoose');
const db = "mongodb+srv://seemaz:seema123@cluster0.iq5wb.mongodb.net/EVENTSDB?retryWrites=true&w=majority";

mongoose.connect(db,{useNewUrlParser: true,useUnifiedTopology: true}, err => {
    if(err)
    {
        console.log("Error!" + err);
    }
    else
    {
        console.log("Connected to MongoDB...");
    }
})

function verifyToken(req, res, next)
{
   if(!req.headers.authorization)
   {
       return res.status(401).send('Unauthorized Request')
   }
   let token = req.headers.authorization.split(' ')[1]
   if(token == null){
       return res.status(401).send('Unauthorized Request')
   }
   let payload = jwt.verify(token, 'secretKey')
   if(!payload){
    return res.status(401).send('Unauthorized Request')
   }
   req.userId = payload.subject
   next()
}

router.get('/', (req,res) => {
    res.send("From  API Route");
})

//   Register API
router.post('/register', async (req,res) =>{     
    let userData = req.body;
    let user = new User(userData);

    // generate salt to hash password
    const salt = await bcrypt.genSalt(5);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);

    user.save((error, registeredUser) =>{
       if(error){
        console.log(error);
       }
        else{
            let payload = {subject: registeredUser._id}
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token});
        }
    })    
})

//   Login API
router.post('/login', async(req,res) => {
    
    let userData = req.body;
    await User.findOne({email: userData.email}, async (error, user) => {
        if(error){
             console.log(error);
        }
        if(user){
            // check user password with hashed password stored in the database
            const validPassword = await bcrypt.compare(userData.password, user.password);
            if (validPassword) {
                let payload = { subject: user._id }
                let token = jwt.sign(payload, 'secretKey')
                res.status(200).send({token});
            } else {
                if(user.password !== userData.password){
                    res.status(401).json({ error: "Invalid Password" });
                }
            }
        }
        else{
            if(!user){
                res.status(401).json({ error: "Invalid Email" });
            }
        }

        // if(error){
        //     console.log(error);
        // }
        // else{
        //     if(!user){
        //         res.status(401).send("Invalid Email");
        //     }
        //     else{
        //         if(user.password !== userData.password){
        //             res.status(401).send("Invalid Password");
        //         }
        //         else{
        //             // check user password with hashed password stored in the database
        //             const validPassword = await bcrypt.compare(userData.password, user.password);
        //             if(validPassword){
        //                 let payload = { subject: user._id }
        //                 let token = jwt.sign(payload, 'secretKey')
        //                 res.status(200).send({token});
        //             }
        //         }
        //     }
        // }
    })
})

//   Events API
router.get('/events',(req,res) =>{
    // let events = [
    //     {
    //         "_id" : "1",
    //         "name": "Angular: Web Development",
    //         "duration": "3.5 Months",
    //         "instructor": "Piyush Manohar Khairnar"
    //     },
    //     {
    //         "_id": "2",
    //         "name": "Python: Machine Learning",
    //         "duration": "4 Months",
    //         "instructor": "Piyush Manohar Khairnar"
    //       },
    //       {
    //         "_id": "3",
    //         "name": "GoLang",
    //         "duration": "3 Months",
    //         "instructor": "Piyush Manohar Khairnar"
    //       },
    // ]
    // res.json(events);
    Events.find((err,doc) =>{
       if(err){
        console.log("Error in Get Data " + err)
       }
       else{
        res.send(doc)
       }
   })
})


//   Special Events API
router.get('/special', verifyToken, (req,res) =>{
    SpecialEvents.find((err, doc) => {
        if(err){
            console.log("Error in Get Data " + err)
        }
        else{
            res.send(doc)
        }
    })
    // let special = [
    //     {
    //         "_id": "1",
    //         "name": "IOT",
    //         "duration": "5.5 Months",
    //         "instructor": "Piyush Manohar Khairnar"
    //       },
    //       {
    //         "_id": "2",
    //         "name": "AI",
    //         "duration": "6 Months",
    //         "instructor": "Piyush Manohar Khairnar"
    //       },
    //       {
    //         "_id": "3",
    //         "name": "LSP",
    //         "duration": "5 Months",
    //         "instructor": "Piyush Manohar Khairnar"
    //       }
    // ]
    // res.json(special);


})


module.exports = router;