import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/auth/AuthContext';
import { useTweetContext } from '../../../context/auth/TweetContext';
import '../SharedLayoutPage.css'
import {ProfileImage} from '../images/images/blank-profile-picture.webp'
import EditProfileModal from './EditProfileModal';
import './Profile.css'
import CreateCommentModal from '../Tweet/Comment/CreateCommentModal';
import EditProfileDetailsModal from './EditProfileDetailsModal.js';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const Profile = () => 
{    
    const [auth,setAuth] = useAuth()
    const {authDetails,getSingleUserDetails,singleUserPageDetails,showSingleTweet,sendDeleteRequestToBackend,sendLikeRequest,fetchDetailsOfTweetToCommentOn,sendRequestToBackendToReTweeet,allTweets} = useTweetContext();
    const [loggedInUser,setLoggedInUser] = useState()
    const [reloadSingleTweet,setReloadSingleTweet] = useState(false)
    const[renderBool,setRenderBool] = useState(false)
    
    console.log(authDetails,'from profile js')
    
    console.log(singleUserPageDetails)

    const fetchSingleUserDetails = async(id)=>
    {
        const {data} = await axios.get(`/user/getSingleUser/${id}`)
        if(data?.user)
        {
            setLoggedInUser(data?.user)
        }
    }

    const fetchUserDetails = async(userId)=>
    {
        navigate(`/profile/${userId}`)
    }
   
    const navigate = useNavigate()
    
    if(!loggedInUser)
    {
        fetchSingleUserDetails(auth?.user?.userId)
    }
    
    useEffect(()=>
    {
        getSingleUserDetails()
    },[allTweets,loggedInUser,renderBool])


    console.log(loggedInUser,'profile page single user')
    const date = new Date(auth?.user?.joiningDate);


// ! jsx
  return (
    <div class="profile">
        <div class="feed-header d-flex justify-content-between align-items-center" style={{marginTop:"30px"}}><h2>Profile</h2></div>
            <div class="profile-details border border-white">
                <div class="profile-followbtn d-flex justify-content-between align-items-center">
                    <div class="profile-information">
                        <center>
                            <div class="profile-information-img ">
                                <img src={loggedInUser?.profile_picture ? loggedInUser?.profile_picture : require('../images/images/blank-profile-picture.webp')} alt=""/>
                            </div>
                        </center>
                        <div class="profile-name"><h2>{auth?.user?.name}</h2><span>@{auth?.user?.username}</span></div>
                    </div>
                    <button  type="button" class="btn btn-dark user-profile-photo-upload " data-bs-toggle="modal" data-bs-target="#exampleModal3">
                        <span >Update Profile Photo</span>
                    </button>
                    <button type="button" class="btn btn-dark user-profile-edit" data-bs-toggle="modal" data-bs-target="#exampleModal4">
                        <span>Edit</span>
                    </button>
                </div>
                <div class="other-details">
                    <div class="birthday-location d-flex">
                        <div class="birthday">
                            <i class="fa-solid fa-cake-candles" style={{"marginRight":"3px"}}></i>
                            <span>Date Of Birth: </span>
                            <span id="dob">{(new Date(auth?.user?.DateOfBirth).toDateString())}</span>
                        </div>
                        <div class="location">
                            <i class="fa-solid fa-location-dot" style={{"marginRight":"3px"}}></i>
                            <span>Location: </span>
                            <span id="location">{auth?.user?.location || loggedInUser?.location}</span>
                        </div>
                    </div>
                    <div class="joining-date">
                        <i class="fa-regular fa-calendar" style={{"marginRight":"3px"}}></i>
                        <span>Joined: </span>
                        <span id="joining">{date.toDateString()}</span>
                    </div>
                </div>
                <div class="followers-n-following d-flex">
                    <div class="following">
                        <span id="Following">{loggedInUser?.following?.length}</span><span>Following</span>
                    </div>
                    <div class="followers">
                        <span  id="Followers">{loggedInUser?.followers?.length}</span><span>Followers</span>
                    </div>    
                </div>
                <div class="heading-tweet-profile"><center><h4>Tweets and Replies</h4></center></div>
               {singleUserPageDetails && singleUserPageDetails?.tweets?.map((tweet)=>
               {
                    return<div class="single-feed">

                    {/* user-profile picture, username, date and delete icon */}
                    <div class="tweet-header d-flex ">
                    
                        {/* profile image container */}
                        <div class="user-profile-img-container">
                            {loggedInUser?.profile_picture ?  <img src={loggedInUser?.profile_picture} alt="" /> : <img src={require('../images/images/blank-profile-picture.webp')} alt="" />}
                        </div>

                        {/* username container */}
                        <div class="username-container">
                            <span  onClick={()=>fetchUserDetails(auth?.user?.userId)} class="username">@{tweet?.tweetedBy?.username} -</span>
                        </div>

                        {/* date-container */}
                        <div class="date-container">
                            <span class="date">{moment(tweet?.createdAt).fromNow()}</span>
                        </div>
                
                        {auth?.user?.userId===tweet?.tweetedBy?._id && <div class="delete-icon-container" onClick={()=>sendDeleteRequestToBackend(tweet._id)}><i class="fa-solid fa-trash-can"></i></div>}

                        <div  onClick={()=>showSingleTweet(tweet._id)}>
                            <i class='fa-brands fa-twitter fa-fade  fa-xl' style={{"padding":"1rem","marginTop":"17px","marginLeft":"0px"}}></i>
                        </div>
                    </div>
                    <div class="single-tweet-text"><span>{tweet?.content}</span></div>

                    {tweet?.image ? <div class="single-tweet-img-container"><img src={tweet?.image} alt="" /></div>:null}
                    <div class="tweet-operations  d-flex gap-4">
                        <div class="like-icon-container" onClick={()=>sendLikeRequest(tweet._id)}>
                            <i class={`${tweet.likes.map((singleLike)=>
                            {
                                if(singleLike.user===auth?.user?.userId)
                                {
                                    return `fa-heart fa-solid`
                                }
                                else
                                {
                                    return "fa-heart fa-regular"
                                }
                            })} ${tweet?.likes?.length===0 &&'fa-regular fa-heart'}`}></i><span>{tweet?.likes?.length}</span>
                        </div>
                        <div class="comment-icon-container" onClick={()=>fetchDetailsOfTweetToCommentOn(tweet._id)}>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal2"><i class="fa-regular fa-comment"></i>
                            <span>{tweet?.replies?.length}</span></a>
                        </div>
                        <div class="retweet-icon-container" onClick={()=>sendRequestToBackendToReTweeet(tweet._id)}>
                            <i className="fa-solid fa-retweet" style={{color: "#00ac52",}} />
                            <span>{tweet?.reTweetedBy?.length}</span>
                        </div>
                    </div>
                </div>
                }) 
                } 
                {singleUserPageDetails?.tweets?.length===0 && <h1 style={{"textAlign":"center",border:"1px solid black",borderRadius:"20px"}}>No Tweets & Replies To Show</h1>}
            </div>
        <EditProfileModal/>
        <CreateCommentModal reloadSingleTweet={reloadSingleTweet} setReloadSingleTweet={setReloadSingleTweet}/>  
        <EditProfileDetailsModal currentUser={auth} />
    </div>
  )
}

export default Profile