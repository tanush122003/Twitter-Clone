const express = require('express');
const router = express.Router();
const {register,login} = require('../controllers/authController.js')

router.get('/showMessage',async(req,res)=>
{
    res.json({message:"ohio you are in show message route"})
})

// register post
router.post('/register',register)

// login post
router.post('/login',login)


module.exports = router