const express = require('express');
const userController = require('../controller/user');
const app = express();
const router = express.Router();

// router.post('/api/login', (req ,res) => {
//     res.set('Access-Control-Allow-Origin', '*');
//     //res.set(cors())
//     //res.send({ "msg": req.body })
//     console.log(req.body)
//     userController.loginUser(req, res)
// });
router.post('/api/checkappointment', (req ,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    //res.set(cors())
    //res.send({ "msg": req.body })
    console.log(req.body)
    userController.checkAppointment(req, res)
});

router.post('/api/checkapphours', (req ,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    //res.set(cors())
    //res.send({ "msg": req.body })
    console.log(req.body)
    userController.checkAppointmentHours(req, res)
});

router.post('/api/addappointment', (req ,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    //res.set(cors())
    //res.send({ "msg": req.body })
    console.log(req.body)
    userController.addAppointment(req, res)
});
// router.post('/api/send-sms', (req ,res) => {
//     res.set('Access-Control-Allow-Origin', '*');
//     //res.set(cors())
//     //res.send({ "msg": req.body })
//     console.log(req.body)
//     //userController.sendSMS(req, res)
//     UserSMS.SMS(req, res)
// });
router.post('/api/send-code', (req ,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    //res.set(cors())
    //res.send({ "msg": req.body })
    console.log(req.body)
    //userController.sendSMS(req, res)
    userController.sendCode(req, res)
});

router.post('/api/verify-code', (req ,res) => {
    res.set('Access-Control-Allow-Origin', '*');
    //res.set(cors())
    //res.send({ "msg": req.body })
    console.log(req.body)
    //userController.sendSMS(req, res)
    userController.verifyCode(req, res)
});
//router.post('/api/register', userController.registerUser);


module.exports = router;
