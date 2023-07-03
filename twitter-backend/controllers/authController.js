const User = require('../models/User.js');
const { hashPassword, matchPassword } = require('../utilities/auth-utils.js');
const jwt = require('jsonwebtoken');


const register = async(req,res)=>
{
    // email expresssions
    let emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    console.log(req.body)
    try 
    {    
        const {name,email,password,username} = req.body;
        // if email is invalid

        console.log(req.body)
        
        if(!emailPattern.test(email))
        {
            // returning toast
            return res.json({error:'Please enter a valid email'});
        }
        // if any input is missing
        if(!name || !email || !password || !username )
        {
            return res.json({error:'One or more values are missing.'});
        }

        // to check wheather user exists
        const alreadyExistingUser = await User.findOne({email});
        const alreadyExistingUserName = await User.findOne({username});

        // 200 status code means success
        // if user is already made with the email
        if(alreadyExistingUser)
        {
            return res.json({error:"User already present with this email"});
        }

        if(alreadyExistingUserName)
        {
            return res.json({error:"User already present with this username"});
        }

        const hashedPassword = await hashPassword(password);

        const user = await new User({name,email,password:hashedPassword,username}).save();

        // creating json web token

        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'2d'});
        res.json({
            user:
            {
                name:user.name,
                email:user.email,
                role:user.role, 
                address:user.address,
            },
            token
        });
    }
    catch (error) 
    {
        console.log(error)
        return res.json({error:error})
    }    
}

const login = async(req,res)=>
{    
    let emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    try 
    {
        // from the frontend via axios request
        const {email,password} = req.body;

        console.log(req.body,email)
        // if email is invalid
            
        if(!emailPattern.test(email))
        {    
            // toast
            return res.json({error:'Please enter a valid email'});
        }
        // if any input is missing
        if(!email || !password )
        {
            return res.json({error:'One or more values are missing.'});
        }

        // if user exists
        const user = await User.findOne({email});

        console.log(user)
        // 200 status code means success
        // if user already present or password does not match
        if(!user)
        {
            return res.json({error:"user not found"});
        }

        const isMatch = await matchPassword(password,user.password);

        if(!isMatch)
        {
            return res.json({error:"Wrong Password"});
        }

        // creating json web token

        const token = jwt.sign({_id:user._id,name:user.name},process.env.JWT_SECRET,{expiresIn:'10d'});

        console.log(user)
        
        res.status(200).json({
            user:{
                userId:user._id,
                name:user.name,
                email:user.email,
                role:user.role, 
                joiningDate:user.createdAt,
                username:user.username,
                following:user?.following,
                followers:user?.followers,
                profile_picture:user?.profile_picture
            },
            token
        });
    } 
    catch (error) 
    {
        return res.json({error:error})
    }
}

module.exports = {register,login}