const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema = new Schema(
{
    name:
    {
        type:String,
        trim:true,
        required:true,
    },
    username:
    {
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    email:
    {
        type:String,
        trim:true,
        required:true,
        unique:true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide a valid email',],
    },
    password:
    {
        type:String,
        required:true,
        min:6,
        max:30    
    },
    profile_picture:
    {
        // uploading to cloudinary and the link generated is stired in this area
        type:String,
    },
    location:
    {
        type:String,
    },
    DateOfBirth : 
    {
        type:Date,
    },

    // followers
    followers:
    [{
        user:{
        type:Schema.ObjectId,
        ref:'User'
    }}],

    // following
    following:
    [{
        user:
        {type:Schema.ObjectId,
        ref:'User'}
    }],
    address:
    {
        type:String,
        trim:true
    },
    role:
    {
        type:String,
        enum:['admin','user'],
        default:'user'
    }
    },
    {timestamps:true}
)

module.exports = mongoose.model("User",UserSchema)