import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTweetContext } from '../../../context/auth/TweetContext';
import CreateCommentModal from '../Tweet/Comment/CreateCommentModal';
import CreateTweetModal from '../Tweet/CreateTweetModal';
import moment from 'moment'
import './Home.css'

const Home = () => 
{
    const [auth,setAuth] = useAuth();
    const {setTweetToAddACommentOn,tweetToAddACommentOn} = useTweetContext()
    const [showAllTweets,setShowAllTweets] = useState(true)
    const [reloadSingleTweet,setReloadSingleTweet] = useState(false)
    const ref = useRef(null);
    const {tweetBool,setTweetBool,allTweets,getAllTweets,getLoggedInUser,tweetsFromFollowingUsers} = useTweetContext()
    
    const scrollToTop = () => 
    {
        ref.current.scroll
        ({
            top: 0,
        });
    };

    console.log(tweetsFromFollowingUsers,'from home component')
    const followingTweetIds = tweetsFromFollowingUsers?.map((tweet)=>
    {
        return tweet?.tweetedBy?._id;
    })

    const navigate = useNavigate()
    
    const sendRequestToBackendToReTweeet=async(id)=>
    {
        const {data} = await axios.post(`/tweet/createReTweet/${id}`)
        console.log(data)
        if(data?.error)
        {
            toast.error(data?.error)
        }
        else if(data?.createNewTweetAsRetweet)
        {
            toast.success('retweeted Successfully')   
        }
        getAllTweets()
    }

    const sendDeleteRequestToBackend = async(id)=>
    {
        // delete request
        const {data} = await axios.delete(`/tweet/deleteTweet/${id}`)    
        if(data?.error)
        {
            toast.error(data?.error)
        }
        else
        {
            if(data?.deletedReplies)
            {
                toast.success(`Tweet deleted successfully along with ${data?.deletedReplies} nested reply(ies)`)
            }
            toast.success('Tweet Deleted Successfully');
            getAllTweets();
        }
    }

    const showSingleTweet = (id)=>
    {
        navigate(`/tweet/${id}`)
    }

    const fetchDetailsOfTweetToCommentOn = async(IDOftweetToCommentOn)=>
    {
        setTweetToAddACommentOn(IDOftweetToCommentOn)
        const {data} = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`)  
    }
    console.log(tweetToAddACommentOn,'from fetch tweet details in home.js')

    const fetchUserDetails = async(userId)=>
    {
        navigate(`/profile/${userId}`)
    }

    const sendLikeRequest = async(id)=>
    {
        const {data} = await axios.put(`/tweet/likeTweet/${id}`)
        if(data?.error)
        {
            toast.error(data?.error)
        }
        else
        {
            // sending a boolean from the backend
            if(data?.like)
            {
                toast.info("Tweet Liked Successfully")
            }
             // if like is true the tweet was unliked
            if(!data?.like)
            {
                toast.info("Tweet Unliked Successfully")
            }
            getAllTweets()
        }
    }

   
   

    useEffect(()=>
    {
        getAllTweets();
    },[])
   

   
    return (
    <>
    <div class="feed " ref={ref}  style={{"minWidth":"40rem"}}>
        <div class="feed-header d-flex justify-content-between align-items-center">
            <h2>Home</h2>
            <button type="button" class="btn btn-primary tweet-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Tweet</button>
        </div>

        {allTweets.length===0 && <h1 style={{"textAlign":"center"}}>No Tweets </h1>}
        {allTweets && allTweets.map((singleTweet,index)=>
        {
            if(index===1)
            {
                console.log(singleTweet)
            }
            if(singleTweet?.isAReply)
            {
                return;
            }

            return <div class="single-feed">
                {singleTweet?.isARetweet && <p style={{color:"#6e6f70"}}><i class="fa-solid fa-retweet" /> Retweeted by : @{singleTweet?.thisTweetIsRetweetedBy?.username}</p>}
                <div class="tweet-header d-flex ">
                    <div class="user-profile-img-container">
                        {singleTweet?.tweetedBy?.profile_picture ? <img src={singleTweet?.tweetedBy?.profile_picture} style={{width:"100%"}} alt="" /> : <img src={require('../images/images/blank-profile-picture.webp')}/> }
                    </div>
                    <div className="username-container" onClick={()=>fetchUserDetails(singleTweet?.tweetedBy._id)}>
                        <span className="username">@{singleTweet?.tweetedBy?.username} -</span>
                    </div>
                    <div class="date-container">
                        <span class="date">{moment(singleTweet?.createdAt).fromNow()}</span>
                    </div>
                    <div class="delete-icon-container d-flex justify-content-between align-items-center" style={{"marginRight":"2rem","width":"5rem",}}>
                        {/* show the delete icon only when the logged in user id is equal to the tweetedBy Id */}
                        {/* if the retweet is created by the logged in user, then show the delete icon */}
                        {singleTweet?.thisTweetIsRetweetedBy?._id===auth?.user?.userId && <i onClick={()=>sendDeleteRequestToBackend(singleTweet._id)} class="fa-solid fa-trash-can"></i>}
                        {auth?.user?.userId === singleTweet?.tweetedBy?._id && !singleTweet?.isARetweet && <i onClick={()=>sendDeleteRequestToBackend(singleTweet._id)} class="fa-solid fa-trash-can"></i>  } 
                        <div  onClick={()=>showSingleTweet(singleTweet._id)}><i class='fa-brands fa-twitter fa-fade fa-xl' style={{"padding":"1rem","marginTop":"10px","marginLeft":"0px"}}></i></div>
                    </div>
                </div>
                <div class="single-tweet-text">
                    <span>{singleTweet.content}</span>
                </div>
                {/* logic to show/hide picture based on whether there is an image in a tweet or not */}
                {singleTweet?.image ? <div class="single-tweet-img-container"><img src={singleTweet?.image} alt="" /></div> : null}
                <div class="tweet-operations  d-flex gap-4">
                    <div class="like-icon-container" onClick={()=> sendLikeRequest(singleTweet._id)}>
                        <a ><i className={`${singleTweet.likes.map((singleLike)=>
                        {
                                // if user has liked a certain post show a solid heart
                            if(singleLike.user===auth?.user?.userId)
                            {
                                return `fa-heart fa-solid`
                            }
                            else
                            {
                                return "fa-heart fa-regular"
                            }
                        })} ${singleTweet?.likes?.length===0 &&'fa-regular fa-heart'}`}></i><span>{singleTweet?.likes?.length}</span></a>
                    </div>
                    <div class="comment-icon-container" onClick={()=>fetchDetailsOfTweetToCommentOn(singleTweet._id)}>
                        <a data-bs-toggle="modal" data-bs-target="#exampleModal2"><i class="fa-regular fa-comment"></i><span>{singleTweet?.replies?.length}</span></a>
                    </div>
    
                    <div class="retweet-icon-container" onClick={()=>sendRequestToBackendToReTweeet(singleTweet._id)}>
                        <i className="fa-solid fa-retweet" style={{color: "#00ac52",}} />
                        <span>{singleTweet?.reTweetedBy?.length}</span>
                    </div>
                </div>
            </div>
            } ) 
        }    
    </div>
    <CreateTweetModal />
    <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet}/>
    </>
  )
}

export default Home