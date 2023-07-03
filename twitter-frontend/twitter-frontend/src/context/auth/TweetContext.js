import axios from 'axios'
import { useState, createContext, useContext, useEffect } from 'react'
import { useNavigate,Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import  { getLoggedInUser, getTweetsFromFollowingUsers } from './tweet-utils/getTweetsFromFollowingUser';

const TweetContext = createContext();

const TweetProvider = ({ children }) => 
{    
    const navigate = useNavigate()
    const [allTweets, setAllTweets] = useState([]);
    const [auth, setAuth] = useAuth();

    // storing the tweets & replies from the single user page
    const [singleUserPageDetails,setSingleUserPageDetails] = useState()
    const [tweetsFromFollowingUsers,setTweetsFromFollowingUsers] = useState([])
    const [authDetails,setAuthDetails] = useState()
    
    const [tweetBool, setTweetBool] = useState(false);
    const [tweetToAddACommentOn,setTweetToAddACommentOn] = useState(null)

    const sendLikeRequest = async(tweetToLike)=>
    {
        const {data} = await axios.put(`/tweet/likeTweet/${tweetToLike}`)
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
            getSingleUserDetails()
            getAllTweets()
        }
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
        navigate(`/tweet/${id}`);
    }

    const fetchDetailsOfTweetToCommentOn = async(IDOftweetToCommentOn)=>
    {
        setTweetToAddACommentOn(IDOftweetToCommentOn)
        const {data} = await axios.get(`/tweet/getSingleTweet/${IDOftweetToCommentOn}`)  
    }
   
    const sendRequestToBackendToReTweeet=async(id)=>
    {
        const {data} = await axios.post(`/tweet/createReTweet/${id}`)
        console.log(data)
        if(data?.error)
        {
            toast.error(data?.error)
        }
        else
        {
            toast.success('retweeted Successfully')
            navigate('/')
        }
        getAllTweets()
    }
   
    async function getLoggedInDetails()
    {
        const loggedInUser = await getLoggedInUser();
        console.log(loggedInUser)
        const following = await getTweetsFromFollowingUsers(loggedInUser);
        console.log(following)
        setTweetsFromFollowingUsers(following?.tweets)
        return loggedInUser;
    }

    const getSingleUserDetails = async()=>
    {
        const {data} = await axios.get(`/user/getSingleUser`);
        if(data?.error)
        {
            toast?.error(data?.error)
        }
        else
        {
            setSingleUserPageDetails(data)
        }
    }

    if(!singleUserPageDetails)
    {
        getSingleUserDetails();
    }
    console.log(singleUserPageDetails)

    if(!tweetsFromFollowingUsers)
    {
        getLoggedInDetails()
    }

    console.log(tweetsFromFollowingUsers)
  
    const getAllTweets = async()=>
    {
        try 
        {
            const authData = localStorage.getItem("auth");
            if(authData)
            {
                var authDataToUse = JSON.parse(authData);
                const {data} = await axios.get('/tweet/getAllTweets',{headers:{ Authorization:`Bearer ${authDataToUse?.token}`}});
                if(data?.tweets)
                {
                    setAllTweets(data?.tweets)
                }
            }
        } 
        catch (error) 
        {
            console.log(error)
        }
    }

    if(tweetsFromFollowingUsers)
    {
        console.log(tweetsFromFollowingUsers)
    }    
   
    // creating tweet Modal
    useEffect(()=>
    {
        const authData = localStorage.getItem("auth");
        if(authData)
        {
            const parsed = JSON.parse(authData);
            setAuthDetails({...authDetails,user : parsed.user,token:parsed.token})
        }
        getAllTweets()
        getLoggedInDetails()

    },[])


    return (
        <TweetContext.Provider value={{showSingleTweet,sendDeleteRequestToBackend,sendRequestToBackendToReTweeet,fetchDetailsOfTweetToCommentOn,getSingleUserDetails,sendLikeRequest,auth,tweetToAddACommentOn,setAuthDetails,setTweetToAddACommentOn, tweetBool,setTweetBool,tweetsFromFollowingUsers,allTweets,getAllTweets,authDetails,setAuthDetails,singleUserPageDetails }}>
            {children}
        </TweetContext.Provider>
    )
}

const useTweetContext = () => useContext(TweetContext)

export { useTweetContext, TweetProvider }