const mongoose = require('mongoose');

const {Schema} = mongoose;


const TweetSchema = new Schema(
{ 
    content : 
    {
        type:String,
    },
    image:
    {
        type:String
    },
    // added this to distinguish between original tweets and
    // reply tweets of some objectId
    isAReply:
    {
        type:Boolean,
        default:false
    },
    // find the parent of a reply tweet made by another objectId
    isAReplyOfTweet:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tweet'
    },
    // to find the tweet made by which objectId
    tweetedBy:
    {
        type:mongoose.Types.ObjectId,
        ref:'User',
    },

    // likes array stores the IDs of users who have liked it
    likes:
    [{
        user:
        {
            type:mongoose.Types.ObjectId,
            immutable:false,
            ref:'User',   
        }
    }],

    comments : 
    [{      
        comment:
        {
            type:mongoose.Types.ObjectId,
            ref:'Tweet',
    
            content:
            {
                type:String
            },
            commentedBy:
            {
                type:mongoose.Types.ObjectId,
                ref:'User'
            }
        }
    }],
    
    reTweetedBy:
    [{
            type:mongoose.Types.ObjectId,
            ref:'User'
    }],

    thisTweetIsRetweetedBy:
    {
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    isARetweet:
    {
        type:Boolean,
        default:false
    },
    replies:
    [{
        reply:
        {
            type:mongoose.Types.ObjectId,
            ref:'Tweet'   
        }
    }],
   
},{timestamps:true}
)


module.exports = mongoose.model("Tweet",TweetSchema)